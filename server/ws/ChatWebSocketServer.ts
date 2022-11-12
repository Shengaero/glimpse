import { WebSocket, Server as WebSocketServer, RawData } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models';
import { verifyToken } from '../utils/auth';
import { WSPayload, MessagePayload, AuthPayload } from './payloads';
import { createMessage } from '../schemas/resolvers/mutations';
import ChatWebSocket from './ChatWebSocket';
import * as CODES from './codes';

type AuthError = 'not auth' | 'no token' | 'timed out';

type ChatSessions = {
  [chatId: string]: string[];
};

type UserSessions = {
  [userId: string]: string[];
};

type SessionSockets = {
  [sessionId: string]: ChatWebSocket;
};

function parsePayload(data: RawData) {
  try {
    const rawPayload = JSON.parse(data.toString());
    if(!rawPayload.type)
      return null;
    return rawPayload as WSPayload;
  } catch(err) {
    console.warn('Got error while parsing payload: ' + err);
    return null;
  }
}

export default class ChatWebSocketServer {
  private static INSTANCE: ChatWebSocketServer;
  static get() {
    if(!this.INSTANCE)
      throw new Error('ChatWebSocketServer not created!');
    return this.INSTANCE;
  }

  static create(wss: WebSocketServer) {
    if(this.INSTANCE)
      throw new Error('ChatWebSocketServer already created!');
    this.INSTANCE = new ChatWebSocketServer(wss);
  }

  private readonly wss: WebSocketServer;
  private readonly chatSessions: ChatSessions = {};
  private readonly userSessions: UserSessions = {};
  private readonly sessionSockets: SessionSockets = {};

  private constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.wss.on('connection', (ws) => {
      this.addWebSocket(ws, uuidv4());
    });
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      this.wss.close((err) => err ? reject(err) : resolve());
    });
  }

  async addWebSocket(ws: WebSocket, sessionId: string) {
    const userId = await this.connectFlow(ws);

    if(!userId)
      return;

    console.log(`Client connected (User ID: '${userId}', Session ID: '${sessionId}')`);
    // create a ChatWebSocket wrapper
    const cws = new ChatWebSocket(ws, userId, sessionId);
    // add session socket
    this.sessionSockets[cws.sessionId] = cws;
    // subscribe session to user
    this.subscribeSessionToUser(cws.sessionId, cws.userId);
    // query the database to find the user in question
    const user = await User.findById(userId);
    // subscribe the websocket to all chats it's a part of
    user.chats.forEach(chatId => {
      this.subscribeSessionToChat(cws.sessionId, chatId.toString());
    });

    cws.onMessage(data => this.handleOnMessage(data, cws));

    cws.onClose(async code => {
      try {
        console.log(`Client closed connection with code: ${code}!`);
        // delete session socket
        delete this.sessionSockets[cws.sessionId];
        // unsubscribe session from user
        this.unsubscribeSessionFromUser(cws.sessionId, cws.userId);
        // find user by ID
        const user = await User.findById(userId);
        // unsubscribe them from all their chats
        user.chats.forEach(chatId => {
          this.unsubscribeSessionFromChat(cws.sessionId, chatId.toString());
        });
        // invoke close to clean up heartbeat interval
        cws.close();
      } catch(err) {
        console.log('Error while closing web socket:', err);
      }
    });
  }

  subscribeSessionToChat(sessionId: string, chatId: string) {
    // add sessionId to chatSessions
    let sessions = this.chatSessions[chatId];
    // if no sessions exist
    if(!sessions) {
      // create new array
      sessions = [];
      // add it to chatSessions
      this.chatSessions[chatId] = sessions;
    }
    // push new sessionId
    sessions.push(sessionId);
  }

  subscribeSessionToUser(sessionId: string, userId: string) {
    // add sessionId to userSessions
    let sessions = this.userSessions[userId];
    // if no sessions exist
    if(!sessions) {
      // create new array
      sessions = [];
      // add it to userSessions
      this.userSessions[userId] = sessions;
    }
    // push new sessionId
    sessions.push(sessionId);
  }

  unsubscribeSessionFromChat(sessionId: string, chatId: string) {
    // remove sessionId from chatSessions
    const sessions = this.chatSessions[chatId];
    // if no sessions
    if(!sessions) {
      // return, we can't unsub from something that never existed to begin with
      return;
    }
    // slice out sessionId
    sessions.slice(sessions.findIndex((id) => id === sessionId), 1);
    // if no sessions remain
    if(sessions.length < 1) {
      // delete this chatId from chatSessions
      delete this.chatSessions[chatId];
    }
  }

  unsubscribeSessionFromUser(sessionId: string, userId: string) {
    // remove sessionId to userSessions
    const sessions = this.userSessions[userId];
    // if no sessions
    if(!sessions) {
      // return, we can't unsub from something that never existed to begin with
      return;
    }
    // slice out sessionId
    sessions.slice(sessions.findIndex((id) => id === sessionId), 1);
    // if no sessions remain
    if(sessions.length < 1) {
      // delete this userId from userSessions
      delete this.userSessions[userId];
    }
  }

  subscribeUserToChat(userId: string, chatId: string) {
    // get sessions by userId
    const sessions = this.userSessions[userId];
    // if no sessions
    if(!sessions) {
      // return, we don't do anything here
      return;
    }
    // for each session
    sessions.forEach((sessionId) => {
      // subscribe to the chat
      this.subscribeSessionToChat(sessionId, chatId);
    });
  }

  unsubscribeUserFromChat(userId: string, chatId: string) {
    // get sessions by userId
    const sessions = this.userSessions[userId];
    // if no sessions
    if(!sessions) {
      // return, we don't do anything here
      return;
    }
    // for each session
    sessions.forEach((sessionId) => {
      // don't think about big-oh...
      this.unsubscribeSessionFromChat(sessionId, chatId);
    });
  }

  // In order to actually securely grab the authentication of a connecting user,
  //our options in this instance are incredibly limited. react-use-websocket
  //allows use of queryParams when requesting a websocket, but not headers or
  //request bodies. Thus, the only option of safely transporting the token
  //is via a server handshake flow.
  //
  // When the client connects via websocket, the server will send a hello frame:
  //
  // {
  //    "type": "hello"
  // }
  //
  // Following this, the client will have 5000ms to send a handshake frame:
  //
  // {
  //    "type": "auth",
  //    "token": "<token>"
  // }
  //
  // The result of this interaction will be the server recieving the client's
  //userId via their jwt token.
  private async connectFlow(ws: WebSocket): Promise<string | null> {
    try {
      await new Promise<void>((resolve, reject) => {
        const send = () => ws.send(JSON.stringify({ type: 'hello' }), (err) => {
          if(err)
            return reject(err);
          resolve();
        });

        // fast path, we're already open
        if(ws.readyState === WebSocket.OPEN)
          return send();

        // slow path, wait for open
        ws.once('open', send);
      });
    } catch(err) {
      return null;
    }

    const payload = await new Promise<AuthPayload | AuthError>((resolve) => {
      const timeout = setTimeout(() => resolve('timed out'), 5000);
      // wait for first message to websocket
      ws.once('message', (data) => {
        // clear the timeout
        clearTimeout(timeout);
        // parse payload
        const payload = parsePayload(data);
        if(payload.type !== 'auth') {
          // type doesn't match 'auth'
          // resolve with 'not auth' error string
          resolve('not auth');
        } else if(!payload['token']) {
          // no msg property on payload
          // resolve with 'no token'
          resolve('no token');
        } else {
          // otherwise resolve the payload
          resolve(payload as AuthPayload);
        }
      });
    });

    if(typeof payload === 'string') {
      switch(payload) {
        case 'not auth':
          ws.close(CODES.CLOSE.POLICY_VIOLATION);
          break;
        case 'timed out':
          ws.close(CODES.CLOSE.HEART_STOPPED);
          break;
        case 'no token':
          ws.close(CODES.CLOSE.UNSUPPORTED);
          break;
        default:
          ws.close(CODES.CLOSE.SERVER_ERROR);
      }
      return null;
    }

    const verified = verifyToken(payload.token);
    return verified['data']._id as string;
  }

  private async handleOnMessage(data: RawData, cws: ChatWebSocket) {
    try {
      let command: WSPayload;
      try {
        // get our payload by parsing the data as JSON
        command = parsePayload(data);
      } catch(err) {
        // if we get an error during the parsing, this means that JSON.parse
        //specifically failed to parse the text of the frame into a JSON, so
        //we send back CLOSE_PROTOCOL_ERROR (1002).
        cws.close(CODES.CLOSE.PROTOCOL_ERROR);
        return;
      }

      if(command === null) {
        // if we get an unrecognized command or invalid payload we should
        //close the websocket with CLOSE_UNSUPPORTED (1003).
        cws.close(CODES.CLOSE.UNSUPPORTED);
        return;
      }

      switch(command.type) {
        case 'ping':
          // pong!
          cws.pong();
          break;
        case 'message':
          // deconstruct msg and chatId
          const { msg, chatId } = command as MessagePayload;

          // pass off to createMessage mutation
          const { content, createdAt } = await createMessage(null, { chatId, content: msg }, { user: { _id: cws.userId } });

          // get all sessions subscribed to the chatId
          const sessionIds = this.chatSessions[chatId.toString()];
          for(const sessionId of sessionIds) {
            // Echo it back to all clients in same chat.
            // Note that we pass the content, not the msg. The reason for
            //this is because we want to send the value provided to us
            //AFTER inserting it into the database, as this is validated.
            this.sessionSockets[sessionId].send(content, cws.userId, chatId, createdAt);
          }
          break;
      }
    } catch(err) {
      try {
        // if we hit this error boundary this means we had an internal server
        //error of some kind. We will try to send CLOSE_SERVER_ERROR (1011),
        //if we can.
        cws.close(CODES.CLOSE.SERVER_ERROR);
      } finally {
        console.log(err);
      }
    }
  }
}
