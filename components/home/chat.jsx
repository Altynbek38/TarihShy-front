'use client'
import { authOptions } from "@/lib/authOptions";
import { throttle } from '@/lib/throttle'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatLine, LoadingChatLine } from './chat-line'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import cx from 'classnames'
import { AcademicCapIcon } from '@heroicons/react/24/outline' 
import axios from 'axios'
import ReactPlayer from "react-player";
import toast, { Toaster } from 'react-hot-toast'


// default first message to display in UI (not necessary to define the prompt)
export const initialMessages = [
  {
    role: 'assistant',
    content: 'Ассалаумағалейкум! Мен сізге тарих жөнінде кез келген сұраққа жауап беремін.',
  },
]

export const emptyMessages = [
  {
    role: 'assistant',
    content: 'Cіздің таңдауылы хабарламаңыз жоқ.',
  },
]

const InputMessage = ({ input, setInput, sendMessage, loading, session, person, handleTrashClick, sidebarCollapsed, handleFavoritesClick, isFavoriteButtonActive }) => {
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const [question, setQuestion] = useState(null)
  const [questionError, setQuestionError] = useState(null)
  const inputRef = useRef(null)

  const shouldShowLoadingIcon = loading || isGeneratingQuestion
  const inputActive = input !== '' && !shouldShowLoadingIcon

  useEffect(() => {
    const input = inputRef?.current
    if (question && input) {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [question, inputRef])

  useEffect(() => {
    if (questionError) {
      toast.error(questionError)
    }
  }, [questionError])

  let text = ""

  if (person.name === "Шоқан Уәлиханов" || person.name === "Әлихан Бөкейханов" || person.name === "Мұхамеджан Тынышбаев" || person.name === "Тұрар Рысқұлов" || person.name === "Дінмұхаммед Қонаев") {
    text = `${person.name}пен чатты тазалау`
  }
  else {
    text = `${person.name}мен чатты тазалау`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-xinc-800 to-zinc-700 flex flex-col items-center clear-both">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          className={`${sidebarCollapsed ? "" :   "hidden md:flex"} mx-auto flex w-fit items-center gap-3 rounded text-white bg-teal-800 py-2 px-3 text-black text-sm hover:bg-teal-700 disabled:opacity-25`}
          onClick={(e) => {
            e.stopPropagation();
            handleTrashClick(person);
          }}
        >
          <img
            src="refresh_btn_zinc.png"
            alt="Clear Chat"
            className="h-5 w-15"
            onMouseEnter={(e) => {
              e.target.src = "refresh_btn_white.png";
            }}
            onMouseLeave={(e) => {
              e.target.src = "refresh_btn_zinc_300.png";
            }}
          />
          {text}
        </button>

        <button
          className={`${sidebarCollapsed ? "" : "hidden md:flex"} mx-auto flex w-32 items-center rounded text-white bg-teal-800 py-1 px-3 text-black text-sm hover:bg-teal-700 disabled:opacity-25`}
          onClick={() => handleFavoritesClick(person)}
        >
          <img
            src="favorite_false_white.png"
            alt="Clear Chat"
            className="h-7 w-15 mr-1"
          />
          <span className="">{isFavoriteButtonActive ? "Қайту" : "Таңдаулы"}</span>
        </button>
      </div>
      <div className="mx-2 my-4 flex-1 w-full md:mx-4 md:mb-[52px] lg:max-w-2xl xl:max-w-3xl">
        <div className="relative mx-2 flex-1 flex-col rounded-md border-black/10 bg-zinc-600 shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
          <input
            ref={inputRef}
            aria-label="chat input"
            required
            className="m-0 w-full border-0 bg-transparent p-0 py-3 pl-4 pr-12 text-white text-white::placeholder"
            placeholder="Сіздің сұрағыңыз..."
            value={input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(input, session, person)
                setInput('')
              }
            }}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            disabled={isGeneratingQuestion}
          />
          <button
            className={cx(
              shouldShowLoadingIcon && "hover:bg-inherit hover:text-inhert",
              inputActive && "bg-black hover:bg-neutral-200 hover:text-neutral-100",
              "absolute right-2 top-2 rounded-sm p-1 text-zinc-200 opacity-60 hover:bg-neutral-200 hover:text-zinc-300 transition-colors")}
            type="submit"
            onClick={() => {
              sendMessage(input, session, person)
              setInput('')
            }}
            disabled={shouldShowLoadingIcon}
          >
            {shouldShowLoadingIcon
              ? <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
              : <div className={cx(inputActive && "text-white", "w-6 h-6")}>
                <PaperAirplaneIcon />
              </div>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isMessageStreaming, setIsMessageStreaming] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null);

  // send message to API /api/chat endpoint
  const sendMessage = async (newMessage, session, person) => {
    setLoading(true);
    setError(null);
    const newMessages = [
      ...messages,
      { role: 'user', content: newMessage },
    ];
    setMessages(newMessages);

    try {
      const payload = {
        user_id: String(session.user.email),
        conversation_id: Number(person.id),
        user_query: String(newMessage)
      };

      console.log(payload);

      const response = await axios.post('https://tarihshyback-production.up.railway.app/tarih/me', payload);

      console.log('User query sent to the backend successfully.');

      if (!response.data.assistant) {
        console.log(response);
        setError(response.statusText);
        setLoading(false);
        return;
      }

      // Check if the response contains a ReadableStream
      if (response.data.assistant.getReader) {
        const data = response.data.assistant;
        setIsMessageStreaming(true);

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let lastMessage = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);

          lastMessage = lastMessage + chunkValue;

          setMessages([
            ...newMessages,
            { role: 'assistant', content: lastMessage },
          ]);
        }

        setIsMessageStreaming(false);
      } else {
        // If it's not a ReadableStream, directly update the messages based on the response content
        const assistantMessage = response.data.assistant;
        if (assistantMessage) {
          setMessages([
            ...newMessages,
            { role: 'assistant', content: assistantMessage },
          ]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('An error occurred during the chat.');
      setLoading(false);
      setIsMessageStreaming(false);
    }
  };

  return {
    messages,
    isMessageStreaming,
    loading,
    error,
    sendMessage,
    setMessages,
    setLoading,
  };
};

let defaultPerson = { id: 1, name: 'Қасым Хан', image: '/person_image/kasym_khan_br.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/kasym_khan.mp4' };
export default function Chat({ session }) {
  const [input, setInput] = useState('');
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { messages, isMessageStreaming, loading, error, sendMessage, setMessages, setLoading } = useMessages();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [person, setPerson] = useState(defaultPerson);
  const [selectedPerson, setSelectedPerson] = useState(defaultPerson);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    sendPersonToBackend(person);
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
      } else {
        setAutoScrollEnabled(true);
      }
    }
  };

  const scrollDown = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [autoScrollEnabled]);
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    throttledScrollDown();
  }, [messages, throttledScrollDown]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
  };

  const sendPersonToBackend = (person) => {
    // Check if session and person objects are defined and have required properties
    setMessages([])
    if (!session || !session.user || !session.user.email) {
      console.error('Invalid session object or missing user email.');
      return;
    }

    if (!person || !person.id || !person.name) {
      console.error('Invalid person object or missing id or name.');
      return;
    }

    // Send session and selected person to the backend
    const data = {
      user_id: String(session.user.email),
      conversation_id: Number(person.id),
      tulga: String(person.name),
    };

    axios
      .post('https://tarihshyback-production.up.railway.app/tarih/personality/me', data)
      .then(async (response) => {
        // Handle successful response from the server
        console.log('Person sent to the backend successfully.');
        console.log(response);

        // Fetch chat history after sending the person to the backend
        const payload = {
          user_id: String(session.user.email),
          conversation_id: Number(person.id),
        };
        console.log(payload)
        const historyResponse = await axios.post('https://tarihshyback-production.up.railway.app/tarih/me_get_conversation', payload);
        console.log(historyResponse)
        // Ensure the historyResponse.data is an array of message objects
        if (!Array.isArray(historyResponse.data)) {
          console.error('Invalid response format. Expected an array of message objects.');
          return;
        }

        // Set the messages state with the fetched chat history
        setMessages([...initialMessages, ...historyResponse.data]);
      })
      .catch((error) => {
        // Handle error sending data to the server
        console.error('Error sending person to the backend:', error);
      });
    setPerson(person);
  };
  const handleTrashClick = (person) => {
    const payload = {
      user_id: String(session.user.email),
      conversation_id: Number(person.id)
    }
    console.log(payload)
    axios
      .post('https://tarihshyback-production.up.railway.app/tarih/me_delete_conversation_tulga', payload)
      .then(async (response) => {
        setMessages([...initialMessages])
        console.log(response)
      })
      .catch((error) => {
        console.error('Error removing the person from the backend:', error);

      });
  };

  const ClearChatButton = ({ session, clearChat }) => {
    const handleClearChat = () => {
      clearChat(session);
    };

    return (
      <button
        className="fixed 2 left-40 text-zinc-200 bg-teal-800 rounded-full p-2 focus:outline-none transition-all duration-200 hover:bg-teal-700"
        onClick={handleClearChat}
      >
        <img
          src="refresh_btn_zinc.png"
          alt="Clear Chat"
          className="h-4 w-4"
          onMouseEnter={(e) => {
            e.target.src = "refresh_btn_white.png";
          }}
          onMouseLeave={(e) => {
            e.target.src = "refresh_btn_zinc.png";
          }}
        />
      </button>
    );
  };

  const clearChat = (session) => {
    // Check if session object is defined and has the required properties
    if (!session || !session.user || !session.user.email) {
      console.error('Invalid session object or missing user email.');
      return;
    }

    // Clear the messages and reset to initial messages
    setMessages([...initialMessages]);

    // Send the clear chat request to the backend
    const payload = {
      user_id: String(session.user.email),
    };

    axios
      .post('https://tarihshyback-production.up.railway.app/tarih/me_delete_conversation_full', payload)
      .then((response) => {
        console.log('Chat cleared successfully.');
        console.log(response);
      })
      .catch((error) => {
        console.error('Error clearing the chat:', error);
      });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if the component is mounted
    setMounted(true);

    // If the component is mounted and it's the first time, send the default person
    if (mounted) {
      handlePersonClick(defaultPerson);
    }
  }, [mounted]);


  const [audioElement, setAudioElement] = useState(null);
  const audioRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(selectedPerson.video); // Update the videoUrl state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showVideoSurface, setShowVideoSurface] = useState(false);



  const handleAudioButtonClick = async (content) => {
    try {
      const payload = {
        user_id: String(session.user.email),
        conversation_id: Number(selectedPerson.id),
        query: String(content)
      };

      const response = await axios.post('https://tarihshyback-production.up.railway.app/tarih/text_to_speech', payload);

      if (!response.data) {
        console.error('Empty response received from the server');
        return;
      }

      const newAudio = new Audio(response.data);

      if (audioRef.current && audioRef.current.src !== newAudio.src) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false); // Pause the floating video when audio is paused
      }

      if (audioRef.current && audioRef.current.src === newAudio.src) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsAudioPlaying(true);
          // Trigger video playback when audio is played
          setShowVideoSurface(true);
        } else {
          audioRef.current.pause();
          setIsAudioPlaying(false);
          // Pause the video when audio is paused
          setShowVideoSurface(false);
        }
      } else {
        newAudio.play();
        setIsAudioPlaying(true);
        // Set the videoUrl and trigger video playback when audio is played
        setVideoUrl(selectedPerson.video);
        setShowVideoSurface(true);
        setAudioElement(newAudio);
        audioRef.current = newAudio;

        // Add event listeners for the 'play' and 'pause' events of the audio element
        newAudio.addEventListener('play', () => {
          setIsAudioPlaying(true);
        });

        newAudio.addEventListener('pause', () => {
          setIsAudioPlaying(false);
        });

        newAudio.addEventListener('ended', () => {
          setShowVideoSurface(false);
        });

      }


    } catch (error) {
      console.error('Error while fetching or playing audio:', error);
    }
  };


  const [isFavoriteButtonActive, setFavoriteButtonActive] = useState(false)
  const handleFavorite = async (content) => {
    try {
      const payload = {
        user_id: String(session.user.email),
        conversation_id: Number(selectedPerson.id),
        query: String(content)
      };

      const response = await axios.post('https://tarihshyback-production.up.railway.app/tarih/add_favorites', payload);

      if (!response.data) {
        console.error('Empty response received from the server');
        return;
      }

      console.log(response)

    } catch (error) {
      console.error('Error while adding message to favorites', error);
    }
  }


  const showFavorites = async (person) => {
    try {
      setMessages([])
      const payload = {
        user_id: String(session.user.email),
        conversation_id: Number(person.id)
      };
      const response = await axios.post('https://tarihshyback-production.up.railway.app/tarih/get_favorites', payload);
      console.log(response.data)
      if (response.data.length !== 0) {
        setMessages([...response.data]);
      }
      else {
        setMessages([...emptyMessages])
      }

    } catch (error) {
      console.error('Error while getting message to favorites', error);
    }
  }

  const handleFavoritesClick = () => {
    if (isFavoriteButtonActive) {
      setFavoriteButtonActive(false)
      handlePersonClick(selectedPerson);
    }
    else {
      setFavoriteButtonActive(true);
      showFavorites(selectedPerson);
    }
  };

  const Sidebar = ({ selectedPerson, handlePersonClick, handleTrashClick }) => {
    const persons = [
      { id: 1, name: 'Қасым Хан', image: '/person_image/kasym_khan_br.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/kasym_khan.mp4' },
      { id: 2, name: 'Хақназар Хан', image: '/person_image/haqnazar_khan.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/haqnazar_khan.mp4' },
      { id: 3, name: 'Есім Хан', image: '/person_image/esim_khan_new.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/esim_khan.mp4' },
      { id: 4, name: 'Салқам Жәнгір Хан', image: '/person_image/zhangir_khan.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/zhangir_khan.mp4' },
      { id: 5, name: 'Абылай Хан', image: '/person_image/abylay_khan.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/abylay_khan.mp4' },
      { id: 6, name: 'Төле Би', image: '/person_image/tole_bi.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/tole_bi.mp4' },
      { id: 7, name: 'Қазыбек Би', image: '/person_image/kazybek_bi_hd.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/kazybek_bi.mp4' },
      { id: 8, name: 'Әйтеке Би', image: '/person_image/aiteke_bi_hd.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/aiteke_bi.mp4' },
      { id: 9, name: 'Шоқан Уәлиханов', image: '/person_image/shoqan.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/shoqan.mp4' },
      { id: 10, name: 'Әлихан Бөкейханов', image: '/person_image/bokeikhanov.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/bokeikhanov.mp4' },
      { id: 11, name: 'Ахмет Байтұрсынұлы', image: '/person_image/baitursynov.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/baitursynov.mp4' },
      { id: 12, name: 'Мұхамеджан Тынышбаев', image: '/person_image/tynyshpaev.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/tynyshpaev.mp4' },
      { id: 13, name: 'Мұстафа Шоқай', image: '/person_image/shoqai_new.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/shoqai.mp4' },
      { id: 14, name: 'Тұрар Рысқұлов', image: '/person_image/rysqulov.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/rysqulov.mp4' },
      { id: 15, name: 'Дінмұхаммед Қонаев', image: '/person_image/qonaev_new.jpg', video: 'https://storage.googleapis.com/tulga_videos-bucket/qonaev.mp4' },
    ];


    return (
      <div className={`w-64 border-r bg-zinc-800 flex-none ${sidebarCollapsed ? 'border-r-2 w-16' : ''}`} style={{ height: '100vh' }}>
        <div className="grid grid-cols-1 gap-0 mb-3 max-h-[calc(100vh-64px)] overflow-y-auto scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-neutral-800 scrollbar-thumb-rounded-full scrollbar-thumb-hover:scrollbar-thumb-gray-500">
          {persons.map((person) => (
            <div
              key={person.id}
              className={`flex items-center p-2  text-zinc-200 border duration-100  ${selectedPerson.id === person.id ? 'border-neutral-900 selected bg-zinc-900' : 'border-neutral-800 bg-zinc-800 hover:bg-zinc-700'
                } cursor-pointer ${person.id === 1 ? 'md:mt-0 mt-8' : ''
                }
                ${person.id === 15 ? 'mb-32' :  ''}`}
              onClick={() => handlePersonClick(person)}
            >
              {sidebarCollapsed ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover mx-2 my-1"
                />
              ) : (
                <>
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover mx-2 my-1"
                  />
                  <span className={`ml-2 flex-grow`}>
                    {person.name}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="flex-1 w-full border-zinc-100 bg-zinc-700 overflow-hidden flex">
      {/* Collapsible Sidebar */}
      <button
        className="block md:hidden absolute w-8 top-50px z-10 ml-2 h-8 text-zinc-300 hover:text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        {!sidebarCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 pr-2 bg-teal-800 hover:teal-700 rounded "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l 7-7-7-7" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0 md:w-24' : 'w-64'
          } overflow-hidden`} // Add 'overflow-hidden' to prevent scrolling
      >
        {/* Sidebar content */}
        <div className={`h-full overflow-y-auto`}>
          <div className="md:flex hidden px-2 py-2 bg-neutral-800 text-white items-center justify-between">
            <h2 className="text-xl font-medium">Тұлға</h2>
            <button
              className="text-zinc-300 hover:text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              {!sidebarCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l 7-7-7-7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-none w-64 overflow-y-auto scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full scrollbar-thumb-hover:scrollbar-thumb-gray-500">
            {/* Pass selectedPerson, handlePersonClick, and handleTrashClick as props */}
            <Sidebar
              selectedPerson={selectedPerson}
              handlePersonClick={handlePersonClick}
              handleTrashClick={handleTrashClick}
            />
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 w-full relative max-h-[calc(100vh-4rem)] overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Chat lines */}
        {messages.map(({ content, role, is_favorite }, index) => (
          <ChatLine key={index} role={role} content={content} isStreaming={index === messages.length - 1 && isMessageStreaming} session={session} selectedPerson={selectedPerson} handleAudioButtonClick={handleAudioButtonClick} isAudioPlaying={isAudioPlaying} handleFavorite={handleFavorite} isFavorite={is_favorite} />
        ))}
        {loading && <LoadingChatLine />} {/* Show loading indicator when loading is true */}
        <div className="h-[152px] bg-zinc-700" ref={messagesEndRef} />
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading || isMessageStreaming}
          session={session}
          person={person}
          handleTrashClick={handleTrashClick}
          sidebarCollapsed={sidebarCollapsed}
          handleFavoritesClick={handleFavoritesClick}
          isFavoriteButtonActive={isFavoriteButtonActive}
          className={`${sidebarCollapsed ? "" : "ml:0 md:ml-24"}`}
        />

      </div>
      {/* Video Surface */}
      <div className="fixed bottom-28 md:bottom-16 md:right-8 right-4  border md:border-8 border-4 border-teal-800 rounded-full md:w-64 w-32 md:h-96 h-32 bg-black">
        {/* Video Poster */}
        <img
          src={selectedPerson.image}
          alt="Video Poster"
          className={`w-full h-full rounded-full object-cover ${showVideoSurface ? 'hidden' : 'block'}`}
        />
        {/* Video Element */}
        {showVideoSurface && (
          <video
            poster={selectedPerson.image}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            className="w-full h-full rounded-full object-cover"
            onCanPlay={() => {
              console.log("Video can start playing.");
            }}
            onPlay={() => {
              console.log("Video is playing.");
            }}
            onPause={() => {
              console.log("Video is paused.");
            }}
            onError={(e) => {
              console.error("Video error:", e);
            }}
            ref={(videoElement) => {
              if (videoElement) {
                if (isAudioPlaying) {
                  videoElement.play();
                } else {
                  videoElement.pause();
                }
              }
            }}
          >
            <source src={selectedPerson.video} type="video/mp4" />
          </video>
        )}
      </div>
      <Toaster />
    </div>
  );
}
