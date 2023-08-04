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

export function ChatLine({ role = 'assistant', content, isStreaming, session, selectedPerson, handleAudioButtonClick, isAudioPlaying, handleFavorite, isFavorite }) {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [isFavoriteActive, setFavoriteActive] = useState(false)
  const [isAudioPlayingIn, setIsAudioPlayingIn] = useState(false)
  if (!content) {
    return null;
  }
  const contentWithCursor = `${content}${isStreaming ? '▍' : ''}`;
  const formatteMessage = convertNewLines(contentWithCursor);
  const [isFavoriteButtonActive, setFavoriteButtonActive] = useState(isFavorite === "True");

  const handleFavoriteButton = (content) => {
    if (isFavoriteButtonActive){
      setFavoriteButtonActive(false);
    }
    else{
      setFavoriteButtonActive(true);
    }
    handleFavorite(content);
  };

  const handleAudioButtonClickIn = (content) => {
    if (isAudioPlayingIn) {
      setIsAudioPlayingIn(false)
    }
    else {
      setIsAudioPlayingIn(true)
    }
    handleAudioButtonClick(content)
  }

  const initMessage = "Ассалаумағалейкум! Мен сізге тарих жөнінде кез келген сұраққа жауап беремін.";
  const emptyMessage = "Cіздің таңдауылы хабарламаңыз жоқ."

  return (
    <div
      className={
        role === 'assistant'
          ? "border-b border-black/10 bg-zinc-700 text-white"
          : "border-b border-black/10 bg-zinc-600 text-white"
      }
    >
      <div className="relative m-auto flex p-4 text-base sm:max-w-2xl gap-2 sm:gap-6 sm:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[30px]">
          {role === 'assistant' ? <CommandLineIcon /> : <UserIcon />}
        </div>
        <div className="prose whitespace-pre-wrap flex-1 text-zinc-200">
          {formatteMessage}
        </div>
        {role === 'assistant' && (
          <div className="">
            <button
              onClick={() => handleAudioButtonClickIn(content)}
              className={`ml-2 px-4 h-10 w-14 md:w-32 rounded-md duration-200 flex items-center ${isButtonActive ? "bg-teal-800" : "bg-teal-700 hover:bg-teal-700"
                } text-white`}
              onMouseEnter={() => setIsButtonActive(false)}
              onMouseLeave={() => setIsButtonActive(true)}
            >
              <img src="/sound_button.png" alt="" className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">{isAudioPlaying && isAudioPlayingIn ? "Тоқтату" : "Тыңдау"}</span>
            </button>
            <button
              onClick={() => handleFavoriteButton(content)}
              className={`ml-1 md:ml-10 mt-1 px-4 h-8 w-16 rounded-md duration-200 flex items-center hover:bg-zinc-600 ${content === initMessage || content === emptyMessage? "hidden" : ""}`}
              onMouseEnter={() => setFavoriteActive(false)}
              onMouseLeave={() => setFavoriteActive(true)}
            >
              {isFavoriteButtonActive ? <img className="w-8 h-8" src='/favorite_true_white.png'></img>: <img className="w-8 h-8" src='/favorite_false_white.png'></img>}
            </button>
          </div>
        )}

      </div>
    </div>
  );

}

