package com.example.chat_app_backend.controller;

import com.example.chat_app_backend.dto.message.MessageRequest;
import com.example.chat_app_backend.entity.Message;
import com.example.chat_app_backend.entity.Room;
import com.example.chat_app_backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class ChatController {

    private RoomRepository roomRepository;


    @MessageMapping("/sendMessage/{roomId}") // client send message to /app/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}") // subscribe to this topic to receive messages
    public Message sendMessage(
            @DestinationVariable("roomId") String roomId,
            @RequestBody MessageRequest request
    ) {

        Room room = roomRepository.findById(request.getRoomId()).orElse(null);

        if(room != null) {
            Message message = new Message();
            message.setContent(request.getContent());
            message.setSender(request.getSender());
            message.setTimestamp(LocalDateTime.now());

            room.getMessages().add(message);
            roomRepository.save(room);
            return message;
        } else {
            throw new IllegalArgumentException("Room with ID " + roomId + " not found.");
        }
    }
}
