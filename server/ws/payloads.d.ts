export type WSPayload<Type = 'hello' | 'auth' | 'ping' | 'pong' | 'message'> = { type: Type; };

export type AuthPayload = WSPayload<'auth'> & {
  token: String;
};

export type MessagePayload = WSPayload<'message'> & {
  msg: String;
  chatId: String;
  createdAt?: Date;
};
