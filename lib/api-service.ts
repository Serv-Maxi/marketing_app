"use client";

import axiosInterceptor from "./axios-interceptor";

const WEBHOOK_URL = "/webhook/7fa3776f-da44-4ac0-8835-77df5fa7d022";

/**
 * Send a message to the AI service and get a response
 * @param text The user's message
 * @returns Promise with the AI response
 */
export async function sendMessageToAI(text: string): Promise<string> {
  try {
    const response = await axiosInterceptor.post(WEBHOOK_URL, {
      text: text,
    });

    // Return the response text from the API
    // Adjust this based on the actual response structure from the API
    return (
      response.data.text ||
      response.data.response ||
      response.data.message ||
      "No response from AI"
    );
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw new Error("Failed to get response from AI service");
  }
}
