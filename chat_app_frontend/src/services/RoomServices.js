import { httpClient } from "../config/AxiosHelper";

export const createRoom = async (roomData) => {
  const response = await httpClient.post("/api/v1/rooms", roomData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const joinRoom = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const getMessages = async (roomId, page = 0, size = 20) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
  return response.data;
};