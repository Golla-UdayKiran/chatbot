import { useState } from 'react'
import { Chatbot } from 'supersimpledev';
import LoadingSpinner from '../assets/loading-spinner.gif';
import './ChatInput.css';

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || inputText === '') {
      return;
    }

    // Set isLoading to true at the start, and set it to
    // false after everything is done.
    setIsLoading(true);
    
    // We can put this at the top of the function or
    // after the first setChatMessages(). Both work.

    // Clear the textbox at the top now because the Chatbot
    // will take some time to load the response. We want
    // to clear the textbox immediately rather waiting
    // for the Chatbot to finish loading.
    setInputText('');

    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: 'user',
        id: crypto.randomUUID()
      }
      // },
      // Another solution is to add the Loading... message
      // to newChatMessages, but we have to remove it later.
      /*
      {
        message: 'Loading...',
        sender: 'robot',
        id: crypto.randomUUID()
      }
      */
    ];

    setChatMessages([
      ...newChatMessages,
      // This creates a temporary Loading... message.
      // Because we don't save this message in newChatMessages,
      // it will be removed later, when we add the response.
      {
        message: <img src={LoadingSpinner} className="loading-spinner" />,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    // setChatMessages(newChatMessages);
    // We can put this here or at the top of this function
    // (clear the textbox immediately after clicking Send).
    // Both solutions work.
    // setInputText('');

    const response = await Chatbot.getResponseAsync(inputText);
    setChatMessages([
      // This makes a copy of newChatMessages, but without the
      // last message in the array.
      // ...newChatMessages.slice(0, newChatMessages.length - 1),
      ...newChatMessages,
      {
        message: response,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    // Set isLoading to false after everything is done.
    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    } else if (event.key === 'Escape') {
      setInputText('');
    }
  }

  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={saveInputText}
        onKeyDown={handleKeyDown}
        value={inputText}
        className="chat-input"
      />
      <button
        onClick={sendMessage}
        className="send-button"
      >Send</button>
    </div>
  );
}