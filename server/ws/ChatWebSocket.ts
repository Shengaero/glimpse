import { WebSocket, RawData } from 'ws';

import { WSPayload, MessagePayload, AuthPayload } from './payloads';
import * as CODES from './codes';

const MAX_BPI = 3;
const HEART_TIMEOUT = 60000;

export default class ChatWebSocket {
  private readonly _ws: WebSocket;
  private readonly _interval: NodeJS.Timer;
  private readonly _userId: string;
  private readonly _sessionId: string;
  private _bpi: number;
  private _isAuthenticated: boolean;
  constructor(ws: WebSocket, userId: string, sessionId: string) {
    this._ws = ws;
    this._userId = userId;
    this._sessionId = sessionId;
    this._bpi = 0;
    this._interval = setInterval(() => {
      if(this._bpi === 0) {
        // no heartbeats, this heart has stopped
        this.close(CODES.CLOSE.HEART_STOPPED);
      } else {
        // heart will reset
        this._bpi = 0;
      }
    }, HEART_TIMEOUT);
  }

  get ws(): WebSocket {
    return this._ws;
  }

  get interval(): NodeJS.Timer {
    return this._interval;
  }

  get userId(): string {
    return this._userId;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  get bpi(): number {
    return this._bpi;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  pong() {
    this._bpi++;
    if(this._bpi > MAX_BPI) {
      // too many heartbeats, the heart will explode
      this.close(CODES.CLOSE.HEART_EXPLODED);
      return Promise.resolve();
    } else {
      return this.sendFrame({ type: 'pong' });
    }
  }

  send(msg: String, userId: String, userName: String, chatId: String, createdAt: Date) {
    return this.sendFrame({
      type: 'message',
      createdAt: createdAt.getTime(),
      userName, msg, userId, chatId
    });
  }

  onMessage(listener: ((data: RawData) => void) | ((data: RawData) => Promise<void>)) {
    this._ws.on('message', listener);
  }

  onClose(listener: (code: number) => void) {
    this._ws.on('close', listener);
  }

  close(code?: number) {
    // if code was provided we're closing on our end
    if(code)
      this._ws.close(code);
    clearInterval(this._interval);
  }

  private sendFrame<T extends WSPayload>(frame: T) {
    return new Promise<Boolean>((resolve, reject) => {
      if(this.ws.readyState != WebSocket.OPEN) {
        resolve(false);
        return;
      }
      this._ws.send(JSON.stringify(frame), (err) => err ? reject(err) : resolve(true));
    });
  }

}
