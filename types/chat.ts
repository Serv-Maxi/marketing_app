export interface SendMessagePayload {
  text: string;
}

export interface ResponseData<T> {
  code: number;
  status: string;
  data: T;
}

export interface ChatResponse {
  text: string;
  chat_id: string;
}
