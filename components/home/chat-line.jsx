import { useState } from 'react'
import { CommandLineIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="border-b border-black/10 bg-zinc-700 text-white">
    <div className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
      <div className="min-w-[30px]">
        <CommandLineIcon />
      </div>
      <span className="animate-pulse cursor-default mt-1">▍</span>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({ role = 'assistant', content, isStreaming, session, selectedPerson, handleAudioButtonClick }) {
  const [isButtonActive, setIsButtonActive] = useState(true);
  if (!content) {
    return null;
  }
  const contentWithCursor = `${content}${isStreaming ? '▍' : ''}`;
  const formatteMessage = convertNewLines(contentWithCursor);

  return (
    <div
      className={
        role === 'assistant'
          ? "border-b border-black/10 bg-zinc-700 text-white"
          : "border-b border-black/10 bg-zinc-600 text-white"
      }
    >
      <div className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[30px]">
          {role === 'assistant' ? <CommandLineIcon /> : <UserIcon />}
        </div>
        <div className="prose whitespace-pre-wrap flex-1 text-zinc-200">
          {formatteMessage}
        </div>
        {role === 'assistant' && (
          <button
            onClick={() => handleAudioButtonClick(content)}
            className={`ml-2 px-4 h-10 rounded-md duration-200 ${isButtonActive ? "bg-teal-800" : "bg-teal-700 hover:bg-teal-700"} text-white `}
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

