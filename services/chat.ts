"use client";

import axiosInterceptor from "@/lib/axios-interceptor";
import { ChatResponse, ResponseData, SendMessagePayload } from "@/types/chat";

const ChatEndpoint = {
  sendMessage: `/webhook/5555d2bb-dc63-42cd-810f-a3d87f5d7ae4/chats`,
};

export const ChatServices = {
  sendMessage: async (data: SendMessagePayload) =>
    await axiosInterceptor.post<ResponseData<ChatResponse>>(
      ChatEndpoint.sendMessage,
      data
    ),
};
