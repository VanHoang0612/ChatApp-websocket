package com.example.chat_app_backend.service;

import com.example.chat_app_backend.entity.Message;
import com.example.chat_app_backend.entity.Room;
import com.example.chat_app_backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    public Room createRoom(String roomId) {
        if (roomRepository.findByRoomId(roomId)
                .isPresent()) {
            throw new IllegalArgumentException("Room with ID " + roomId + " already exists.");
        }
        return roomRepository.save(Room.builder()
                .roomId(roomId)
                .build());
    }

    public Room getRoom(String roomId) {
        return roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room with ID " + roomId + " not found."));
    }

    public List<Message> getMessages(String roomId, int page, int size) {
        Room room  = getRoom(roomId);
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(start + size, messages.size());
        return messages.subList(start, end);
    }
}
