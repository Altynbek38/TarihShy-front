import { CommandLineIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState } from 'react'

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div
    className="border-b border-black/10 bg-gray-50 text-gray-800"
  >
    <div
      className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
    >
      <div className="min-w-[30px]">
        <CommandLineIcon />
      </div>
      <span className="animate-pulse cursor-default mt-1">▍</span>
    </div>
  </div >
)

// util helper to convert new lines to <br /> tags
const convertNewLines = (text) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ role = 'assistant', content, isStreaming, session, selectedPerson }) {
  if (!content) {
    return null
  }
  const contentWithCursor = `${content}${isStreaming ? '▍' : ''}`
  const formatteMessage = convertNewLines(contentWithCursor)
  const [audioElement, setAudioElement] = useState(null);

  const [isButtonActive, setIsButtonActive] = useState(true);

  const handleButtonClick = async () => {
    setIsButtonActive(true);
    try {
      const payload = {
        user_id: String(session.user.email),
        conversation_id: Number(selectedPerson.id),
        query: String(content)
      };
  
      const response = await axios.post('http://localhost:8000/tarih/text_to_speech', payload);
  
      if (audioElement) {
        // Pause and reset the previous audio
        audioElement.pause();
        audioElement.currentTime = 0;
      }
  
      if (response.data) {
        const audio = new Audio(response.data);
        audio.play();
        setAudioElement(audio);
        audioElement.pause();
      }
    } catch (error) {
      console.error('Error while fetching or playing audio:', error);
    }
  };
  

  return (
    <div
      className={
        role === 'assistant'
          ? "border-b border-black/10 bg-gray-50 text-gray-800"
          : "border-b border-black/10 bg-white text-gray-800"
      }
    >
      <div
        className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
      >
        <div className="min-w-[30px]">
          {role === 'assistant' ? <CommandLineIcon /> : <UserIcon />}
        </div>

        <div className="prose whitespace-pre-wrap flex-1">
          {formatteMessage}
        </div>

        {/* Add your button here */}
        {role === 'assistant' && (
          <button
            onClick={handleButtonClick}
            className={`ml-2 px-4 h-10 rounded-md ${isButtonActive ? "bg-gray-700" : "bg-gray-300 hover:bg-gray-500"} text-white`}
            onMouseEnter={() => setIsButtonActive(false)}
            onMouseLeave={() => setIsButtonActive(true)}
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
}
