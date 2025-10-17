package com.example.chat_app_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // cho phep server gui tin nhan den client dang subscribe vao cac topic bat dau bang /topic
        registry.enableSimpleBroker("/topic");

        // chi dinh tien to /app cho cac tin nhan gui tu client den server
        // de dinh tuyen den cac phuong thuc xu ly tin nhan (@MessageMapping)
        // /app/chat -> server-side: @MessageMapping("/chat")
        registry.setApplicationDestinationPrefixes("/app");


    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/chat") // dinh nghia endpoint cho ket noi WebSocket
                .setAllowedOrigins("*") // cho phep ket noi tu bat ky nguon goc nao
                .withSockJS(); // su dung SockJS de ho tro trinh duyet khong ho tro WebSocket


    }
}
