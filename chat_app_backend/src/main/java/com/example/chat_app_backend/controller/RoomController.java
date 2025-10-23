package com.example.chat_app_backend.controller;

import com.example.chat_app_backend.dto.room.CreateRoomRequest;
import com.example.chat_app_backend.entity.Message;
import com.example.chat_app_backend.entity.Room;
import com.example.chat_app_backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rooms")
@CrossOrigin(origins = {"http://localhost:5173"})
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request.getRoomId())) ;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(roomService.getRoom(roomId)) ;
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        return ResponseEntity.ok(roomService.getMessages(roomId, page, size)) ;
    }

}
