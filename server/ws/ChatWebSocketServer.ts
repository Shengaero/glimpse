import { WebSocket, Server as WebSocketServer, RawData } from 'ws';

import { Chat, Message, User } from '../models';
import { verifyToken } from '../utils/auth';
import { WSPayload, MessagePayload, AuthPayload } from './payloads';
import ChatWebSocket from './ChatWebSocket';
import * as CODES from './codes';

type AuthError = 'not auth' | 'no token' | 'timed out';
type ChatWebSocketMap = {
  [chatId: string]: {
    [sessionId: string]: ChatWebSocket;
  };
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
  readonly wss: WebSocketServer;
  readonly chatMap: ChatWebSocketMap;

  constructor(wss: WebSocketServer) {
    this.chatMap = {};
    this.wss = wss;
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

    // query the database to find the user in question
    const user = await User.findById(userId);

    // subscribe the websocket to all chats it's a part of
    user.chats.forEach(chatId => {
      this.subscribeWebSocketToChat(cws, chatId.toString());
    });

    cws.onMessage(data => this.handleOnMessage(data, cws));
    cws.onClose(async code => {
      console.log(`Client closed connection with code: ${code}!`);
      const user = await User.findById(userId);
      user.chats.forEach(chatId => {
        this.unsubscribeSessionFromChat(cws.sessionId, chatId.toString());
      });
      cws.close();
    });
  }

  unsubscribeSessionFromChat(sessionId: string, chatId: string) {
    // get the session map for the chat
    const sessionMap = this.chatMap[chatId];
    // delete this reference to the websocket session
    delete sessionMap[sessionId];
  }

  subscribeWebSocketToChat(cws: ChatWebSocket, chatId: string) {
    // get the sessions this chatId has subscribing to it
    let chatSessions = this.chatMap[chatId];
    // if none was found, go ahead and add it to the chat map
    if(!chatSessions) {
      chatSessions = {};
      this.chatMap[chatId] = chatSessions;
    }

    chatSessions[cws.sessionId] = cws;
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
          await cws.pong();
          break;
        case 'message':
          // deconstruct msg and chatId
          const { msg, chatId } = command as MessagePayload;

          // create a message object
          const message = await Message.create({
            content: msg,
            author: cws.userId
          });

          // update chat and add the message
          await Chat.updateOne(
            { _id: chatId },
            { $push: { messages: message._id } }
          );

          // get all sessions subscribed to the chatId
          const sessionMap = this.chatMap[chatId.toString()];
          for(const sessionId in sessionMap) {
            // echo it back to all clients in same chat
            await sessionMap[sessionId].send(msg, cws.userId, chatId);
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
