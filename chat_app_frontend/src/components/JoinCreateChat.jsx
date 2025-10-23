import { useState } from "react";
import toast from "react-hot-toast";
import { createRoom, joinRoom } from "../services/RoomServices";
import useChatContext from "../context/useChatContext";
import { useNavigate } from "react-router-dom";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();

  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    setDetail({
      ...detail,
      [e.target.name]: e.target.value,
    });
  };

  const joinChat = async () => {
    if (validateForm) {
      try {
        const room = await joinRoom(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (err) {
        console.log(err);
      }
    }
  };
  const createChat = async () => {
    if (validateForm) {
      try {
        const response = await createRoom({ roomId: detail.roomId });
        console.log(response);
        toast.success("Room created success");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
        joinChat();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const validateForm = () => {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid input !");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-8 w-full max-w-md rounded dark:bg-gray-900 shadow flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-center">Join/Create Room</h1>
        {/* name div  */}
        <div className="">
          <label
            htmlFor="name"
            className="block font-medium mb-2"
          >
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="userName"
            placeholder="Enter the name"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={detail.userName}
            onChange={handleFormInputChange}
          />
        </div>
        {/* Room id div */}
        <div className="">
          <label
            htmlFor="name"
            className="block font-medium mb-2"
          >
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            name="roomId"
            placeholder="Enter the room id"
            className="w-full dark:bg-gray-600 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={detail.roomId}
            onChange={handleFormInputChange}
          />
        </div>
        {/* button  */}
        <div className="flex gap-5 justify-center mt-5">
          <button
            className="px-3 py-2 dark:bg-blue-500 hover:bg-blue-800 rounded-full"
            onClick={joinChat}
          >
            Join Room
          </button>
          <button
            className="px-3 py-2 dark:bg-orange-500 hover:bg-orange-800 rounded-full"
            onClick={createChat}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinCreateChat;
