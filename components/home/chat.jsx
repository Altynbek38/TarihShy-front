'use client'
import { authOptions } from "@/lib/authOptions";
import { throttle } from '@/lib/throttle'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatLine, LoadingChatLine } from './chat-line'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import cx from 'classnames'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'


// default first message to display in UI (not necessary to define the prompt)
export const initialMessages = [
  {
    role: 'assistant',
    content: 'Ассалаумағалейкум! Мен сізге тарих жөнінде кез келген сұраққа jauap beremin',
  },
]

const InputMessage = ({ input, setInput, sendMessage, loading, session, person }) => {
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const [question, setQuestion] = useState(null)
  const [questionError, setQuestionError] = useState(null)
  const inputRef = useRef(null)

  const shouldShowLoadingIcon = loading || isGeneratingQuestion
  const inputActive = input !== '' && !shouldShowLoadingIcon

  const generateJeopardyQuestion = async () => {
    setIsGeneratingQuestion(true)
    setQuestionError(null)

    try {
      const res = await axios.get('/api/question')
      if (!res.data) {
        throw new Error('No question was found in the response.')
      }
      const question_data = res.data

      setQuestion(question_data)
      setInput(`The category is "${question_data.category}". ${question_data.question}`)
    } catch (err) {
      setQuestionError(err.message)
    } finally {
      setIsGeneratingQuestion(false)
    }
  }

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-white to-white flex flex-col items-center clear-both">
      <button
        className="mx-auto flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black text-sm hover:opacity-50 disabled:opacity-25"
        onClick={generateJeopardyQuestion}
        disabled={isGeneratingQuestion}
      >
        <div className="w-4 h-4">
          <AcademicCapIcon />
        </div> {'Generate a Jeopardy question for me'}
      </button>
      <div className="mx-2 my-4 flex-1 w-full md:mx-4 md:mb-[52px] lg:max-w-2xl xl:max-w-3xl">
        <div className="relative mx-2 flex-1 flex-col rounded-md border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
          <input
            ref={inputRef}
            aria-label="chat input"
            required
            className="m-0 w-full border-0 bg-transparent p-0 py-3 pl-4 pr-12 text-black"
            placeholder="Type a message..."
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
              inputActive && "bg-black hover:bg-neutral-800 hover:text-neutral-100",
              "absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 transition-colors")}
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

let defaultPerson = { id: 1, name: 'Қасым Хан', image: '/person_image/kasym_khan.jpg' };
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
        className="fixed bottom-12 left-80 bg-gray-200 rounded-full p-2 focus:outline-none transition-all duration-300 hover:bg-gray-300"
        onClick={handleClearChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
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
        console.log('Paused the previous audio.');
      }
      console.log(audioRef.current)
      console.log(newAudio)
      if (audioRef.current && audioRef.current.src === newAudio.src) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          console.log('Resumed the current audio.');
        } else {
          audioRef.current.pause();
          console.log('Paused the current audio.');
        }
      } else {
        newAudio.play();
        console.log('Started playing new audio.');
        setAudioElement(newAudio);
        audioRef.current = newAudio;
      }
    } catch (error) {
      console.error('Error while fetching or playing audio:', error);
    }
  };


  const Sidebar = ({ selectedPerson, handlePersonClick, handleTrashClick }) => {
    const persons = [
      { id: 1, name: 'Қасым Хан', image: '/person_image/kasym_khan.jpg' },
      { id: 2, name: 'Хақназар Хан', image: '/person_image/haqnazar_khan.jpg' },
      { id: 3, name: 'Есім Хан', image: '/person_image/esim_khan.jpg' },
      { id: 4, name: 'Салқам Жәнгір Хан', image: '/person_image/zhangir_khan.jpg' },
      { id: 5, name: 'Абылай Хан', image: '/person_image/abylay_khan.jpg' },
      { id: 6, name: 'Төле Би', image: '/person_image/tole_bi.jpg' },
      { id: 7, name: 'Қазыбек Би', image: '/person_image/kazybek_bi.jpg' },
      { id: 8, name: 'Әйтеке Би', image: '/person_image/aiteke_bi.jpg' },
      { id: 9, name: 'Шоқан Уәлиханов', image: '/person_image/shoqan.jpg' },
    ];


    return (
      <div className={`w-64 border-r bg-gray-100 flex-none ${sidebarCollapsed ? 'border-r-2 w-16' : ''}`} style={{ height: '100vh' }}>
        <div className="grid grid-cols-1 gap-0 mb-3 max-h-[calc(100vh-64px)] overflow-y-auto scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full scrollbar-thumb-hover:scrollbar-thumb-gray-500">
          {persons.map((person) => (
            <div
              key={person.id}
              className={`flex items-center p-2 border ${selectedPerson.id === person.id ? 'border-gray-900 selected' : 'border-gray-300'
                } cursor-pointer`}
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
                  <span className={`ml-2 flex-grow  ${selectedPerson.id === person.id ? 'text-gray-900' : ''}`}>
                    {person.name}
                  </span>
                </>
              )}
              {/* Trash button */}
              {selectedPerson.id === person.id && !sidebarCollapsed && (
                <button
                  className="text-gray-500 hover:text-gray-900 ml-2 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrashClick(person);
                  }}
                >
                  <img
                    src="trash.png"
                    alt="Clear Chat"
                    className="h-5 w-5"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="flex-1 w-full border-zinc-100 bg-white overflow-hidden flex " >
      {/* Collapsible Sidebar */}
      <button 
        className="block md:hidden absolute top-50px z-10 left-2 bg-gray-700 rounded-md text-white px-1 h-6"
        onClick={toggleSidebar}
      >
        Tulga
      </button>
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0 md:w-24' : 'w-64'
          } overflow-hidden `} // Add 'overflow-hidden' to prevent scrolling
      >
        {/* Sidebar content */}
        <div className={`h-full overflow-y-auto`}>
          <div className="md:flex hidden px-4 py-2 bg-gray-100  items-center justify-between">
            <h2 className="text-xl font-medium">Tulga</h2>
            <button
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
        className="flex-1 w-full relative max-h-[calc(100vh-4rem)] overflow-y-auto" // Set 'overflow-y-auto' to enable scrolling
        onScroll={handleScroll}
      >
        {/* Chat lines */}
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} isStreaming={index === messages.length - 1 && isMessageStreaming} session={session} selectedPerson={selectedPerson} handleAudioButtonClick={handleAudioButtonClick} />
        ))}
        {loading && <LoadingChatLine />} {/* Show loading indicator when loading is true */}
        <div className="h-[152px] bg-white" ref={messagesEndRef} />
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading || isMessageStreaming}
          session={session}
          person={person}
        />
      </div>
      <ClearChatButton session={session} clearChat={clearChat} />
      <Toaster />
    </div>
  );
}
