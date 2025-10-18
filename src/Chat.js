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
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [socket]);

  const onEmojiClick = (emojiData) => {
    setCurrentMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 text-center text-lg font-semibold shadow-sm">
        Live Chat - <span className="text-cyan-600">{username}</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        <ScrollToBottom className="h-full overflow-y-auto px-4 py-6">
          {messageList.map((messageContent, index) => {
            const isOwnMessage = username === messageContent.author;
            return (
              <div
                key={index}
                className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md ${isOwnMessage ? 'bg-cyan-100 text-right' : 'bg-white text-left'
                    }`}
                >
                  {messageContent.type === 'text' ? (
                    <p className="whitespace-pre-wrap">{messageContent.message}</p>
                  ) : (
                    <img
                      src={messageContent.message}
                      alt="uploaded"
                      className="max-h-64 rounded-md"
                    />
                  )}
                  <div className="text-xs text-gray-500 mt-1 flex justify-between gap-2">
                    <span>{messageContent.author}</span>
                    <span>{messageContent.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 bg-white px-4 py-3 pb-10 flex items-center gap-2 relative">

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <button onClick={() => document.getElementById('image-upload').click()}>
          <AiOutlinePicture className="text-2xl text-gray-600 hover:text-cyan-600" />
        </button>

        {/* Emoji Picker */}
        <div className="relative">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <MdEmojiEmotions className="text-2xl text-gray-600 hover:text-cyan-600" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />



        {/* Send Button */}
        <button onClick={sendMessage}>
          <LuSendHorizonal className="text-xl text-gray-600 hover:text-cyan-600" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
