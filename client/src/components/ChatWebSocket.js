import React, { useContext, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import * as Auth from '../utils/auth';

class ChatWebSocket {
  static Context = React.createContext(new ChatWebSocket());

  /**
   * Creates a new ChatWebSocket
   * @param {WebSocket} ws the websocket
   */
  constructor(ws) {
    this.ws = ws;
  }

  /**
   * Whether or not the websocket is open
   */
  get isOpen() {
    return this.ws !== null && this.ws.readyState === ReadyState.OPEN;
  }

  /**
   * Sends a message over the websocket.
   *
   * @param {string} msg the text to send over the websocket
   * @param {string} chatId the chat ID to send the text to
   */
  send(msg, chatId) {
    try {
      if(this.ws && this.ws.readyState !== ReadyState.CLOSED) {
        const payload = { type: 'message', msg, chatId };
        return this.ws.send(JSON.stringify(payload));
      }
      console.error('Attempted to send message while websocket was closed!');
    } catch(err) {
      console.error(err);
    }
  }
}

/**
 * Uses the current ChatWebSocket context.
 *
 * @returns {{cws: ChatWebSocket}} The ChatWebSocket context
 *
 * @see ChatWebSocketProvider
 */
export function useChatWebSocket() {
  const cws = useContext(ChatWebSocket.Context);
  return { cws };
}

/**
 * Provides ChatWebSocket.Context to all child elements.
 *
 * @param {React.PropsWithChildren & {
 *    wsURL: string,
 *    loadingElement?: JSX.Element,
 *    handleNewMessage?: (data: {type: string, message: string, userId: string, chatId: string}) => void
 *  }} props The element props
 *
 * @see useChatWebSocket
 */
export default function ChatWebSocketProvider(props) {
  const { wsURL, loadingElement, handleNewMessage, children } = props;

  // if wsURL is missing throw an error
  if(!wsURL)
    throw new Error('Missing wsURL property on ChatWebSocketProvider!');

  if(!Auth.loggedIn())
    throw new Error('Client was not logged in!');

  // set heartbeat to the state
  const [heartbeatInterval, setHeartbeatInterval] = useState(null);

  // Here, we're building a websocket into the context
  const { readyState, getWebSocket } = useWebSocket(wsURL, {
    reconnectInterval: 5000,

    onOpen: ({ target: ws }) => {
      // When the websocket opens, we also need to send a heartbeat at least once
      //(but no more than 3 times) every 60s. To facilitate this, we attach an
      //interval to this component's state and have it roll every 45s.
      setHeartbeatInterval(setInterval(() => {
        ws.send(JSON.stringify({ type: 'ping' }));
      }, 45000));
    },

    onMessage: ({ data }) => {
      const payload = JSON.parse(data);
      const ws = getWebSocket();
      switch(payload.type) {
        case 'hello':
          // In order to actually get authenticated with the server, we need to
          //provide our /chat websocket route with a token somehow. This is
          //difficult though, as useWebSocket does not provide an option for us
          //to send via https.

          // To make matters worse, the nature of web-socket connections makes
          //managing the state incredibly difficult and fickle. We solve this
          //by using an authentication flow where the server asks the client
          //for credentials when it's sure the socket is opened.

          // This flow starts with the 'hello' frame:
          // {
          //    "type": "hello"
          // }

          // Following recieving the 'hello' frame, we need to send the
          //client's credentials back to the server:
          // {
          //    "type": "auth",
          //    "token": "<token>"
          // }
          ws.send(JSON.stringify({ type: 'auth', token: Auth.getToken() }));
          break;
        case 'message':
          // Messages are recieved via a 'message' frame:
          // {
          //    "type": "message",
          //    "msg": "Hello Chat!",
          //    "userId": "<author's user ID>"
          //    "chatId": "<chat ID>"
          // }
          handleNewMessage(payload);
          break;
        case 'ping':
          // In the case where the server sends a ping frame, the client
          //should bounce a pong frame back:
          // {
          //    "type": "pong"
          // }
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        case 'pong':
          break; // do nothing, receiving pong is normal
        default:
          console.error('Recieved server frame with unrecognized type: ' + payload.type);
      }
    },

    onClose: () => {
      // on close clear our heartbeat interval so if we're going
      // to reconnect we don't start another heartbeat
      if(heartbeatInterval)
        clearInterval(heartbeatInterval);
    },

    shouldReconnect: ({ code }) => {
      switch(code) {
        case 1006: // CLOSE_ABNORMAL: usually in dev this is gonna be because nodemon restarted the server
        case 1012: // Service restart
        case 3002: // HEART_STOPPED: this could be because the heartbeat died, we should reconnect
          return true;
        default:
          return false;
      }
    }
  });

  switch(readyState) {
    case ReadyState.OPEN:
      const cws = new ChatWebSocket(getWebSocket());
      return (
        <ChatWebSocket.Context.Provider value={cws}>
          {children}
        </ChatWebSocket.Context.Provider>
      );
    case ReadyState.UNINSTANTIATED:
    case ReadyState.CONNECTING:
      return (loadingElement ? loadingElement : <></>);
    case ReadyState.CLOSING:
    case ReadyState.CLOSED:
    default:
      return (<></>);
  }
}
