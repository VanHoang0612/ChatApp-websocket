import { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/useChatContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/AxiosHelper";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getMessages } from "../services/RoomServices";
import getShowTimeAgo from "../config/helper";

const Chat = () => {
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  // const [file, setFile] = useState(null);
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();

  const handleLeaveRoom = () => {
    // Logic to leave the room
    setRoomId("");
    setCurrentUser(null);
    setConnected(false);
    setMessage([]);
    navigate("/");
  };
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  // load messages from server
  useEffect(() => {
    if (!roomId) return;
    const loadMessages = async () => {
      try {
        const messagesData = await getMessages(roomId);
        setMessage(messagesData);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [roomId]);

  //   stompClient

  useEffect(() => {
    const connectWebSocket = () => {
      // WebSocket connection logic here
      const socket = new SockJS(`${baseURL}/chat`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          stompClientRef.current = client;
          client.subscribe(`/topic/room/${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessage((prevMessages) => [...prevMessages, receivedMessage]);
          });
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
        },
      });
      client.activate();
    };
    connectWebSocket();

    return () => {
      // Cleanup on unmount
      const client = stompClientRef.current;
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId]);

  // scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [message]);

  // send message handle
  const handleSendMessage = () => {
    const client = stompClientRef.current;
    console.log(stompClientRef.current);
    if (client && connected && input.trim() !== "") {
      console.log(input);
      const chatMessage = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      client.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(chatMessage),
      });

      setInput("");
    }
  };

  return (
    <div className="">
      <header className="dark:bg-gray-900 h-20 fixed top-0 w-full py-3 flex justify-around items-center">
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span>{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{currentUser}</span>
          </h1>
        </div>
        <div>
          <button
            className="dark:bg-red-500 dark:hover:bg-red-800 px-3 py-2 rounded-full"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </header>
      {/* main content */}
      <main className=" py-22 w-2/3 dark:bg-slate-800 mx-auto h-screen">
        <div
          ref={chatBoxRef}
          className="message-container pb-2 overflow-auto h-full flex flex-col gap-2 px-10"
        >
          {message.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.sender === currentUser ? "items-end" : "items-start"
              }`}
            >
              <p className="text-sm font-bold">{message.sender}</p>
              <p
                className={`w-fit rounded-full px-2 py-1 ${
                  message.sender === currentUser ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                {message.content}
              </p>
              <p className="text-gray-400 text-[12px]">
                {getShowTimeAgo(message.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </main>
      {/* message container */}
      <div className="fixed bottom-2 w-full h-18">
        <div className=" rounded-full dark:bg-gray-900 w-2/4 h-full mx-auto flex items-center">
          <input
            type="text"
            placeholder="Type your message here..."
            className="dark:border-gray-700 px-5 rounded-full w-full h-full focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && handleSendMessage();
            }}
          />
          <button className="dark:bg-purple-600 dark:hover:bg-purple-500 cursor-pointer h-12 w-20 flex items-center justify-center rounded-full mr-2">
            <MdAttachFile size={20} />
          </button>
          <button
            className="dark:bg-green-600 dark:hover:bg-green-500 cursor-pointer h-12 w-20 flex items-center justify-center rounded-full mr-2"
            onClick={handleSendMessage}
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
