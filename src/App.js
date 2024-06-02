import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './Chat';
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineAccountTree } from "react-icons/md";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className=' mx-64 my-12'>
      {!showChat ? (

        <div className='border-2 mx-40 p-16 py-14 rounded-lg'>

          <div className='mb-12'>
            <h3 className='font-bold text-3xl text-center'> Welcome to chatting application </h3>
          </div>

          <div className='mx-10'>

            <div className='my-5'>

              <div className='mb-2'>
                <label className='font-semibold'>Enter Your Name</label>
              </div>

              <div className="relative w-full max-w-xs">
                <IoPersonSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="input input-bordered pl-10 w-full"
                  type="text"
                  placeholder="Enter Your name"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className='mb-5'>

              <div className='my-2'>
                <label className='font-semibold'>Enter Room ID</label>
              </div>

              <div className="relative w-full max-w-xs">
                <MdOutlineAccountTree className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="input input-bordered w-full pl-10"
                  type="text"
                  placeholder="Enter Room ID"
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                />
              </div>

            </div>

            <button onClick={joinRoom} className='btn btn-success w-full max-w-xs' >Join A Room</button>

          </div>

        </div>

      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
export default App;


