import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import EmojiPicker from 'emoji-picker-react';
import { LuSendHorizonal } from "react-icons/lu";
import { AiOutlinePicture } from "react-icons/ai";
import { MdEmojiEmotions } from "react-icons/md";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sendMessage = async () => {
    if (currentMessage !== '' || selectedImage) {
      const messageData = {
        room: room,
        author: username,
        message: selectedImage || currentMessage,
        type: selectedImage ? 'image' : 'text',
        time: new Date(Date.now()).toLocaleTimeString(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      setSelectedImage(null); // Clear the selected image after sending
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Store the image data URL in the state
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', receiveMessageHandler);

    // Clean up the event listener on component unmount
    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [socket]);

  const onEmojiClick = (event, emojiObject) => {
    setCurrentMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="chat-window mx-52">
      <div className="">
        <p className='bg-blue-300 rounded-3xl font-semibold p-4'>Live Chat - {username}</p>
      </div>

      <div className="chat-body border-2 mt-1 mr-2 rounded-2xl">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              className="message"
              id={username === messageContent.author ? 'you' : 'other'}
              key={index}
            >
              <div>
                <div className="message-content">
                  {messageContent.type === 'text' ? (
                    <p>{messageContent.message}</p>
                  ) : (
                    <img src={messageContent.message} alt="uploaded" />
                  )}
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      <div className="border-2 border-cyan-400  rounded-md py-2">

        <button  onClick={() => setShowEmojiPicker(!showEmojiPicker)}>

        <MdEmojiEmotions className=' ml-2 mr-2 text-xl'/>

        </button>

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <input
        className=''
          type="text"
          value={currentMessage}
          placeholder="Enter your message"
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />

        
        <button onClick={() => document.getElementById('image-upload').click()}> <AiOutlinePicture className=' mx-2 text-xl '/> </button>

        <button onClick={sendMessage} > <LuSendHorizonal className=' text-lg'/> </button>
      </div>
    </div>
  );
}

export default Chat;



