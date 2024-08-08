import React, { useEffect, useState } from 'react'
import { CiLocationArrow1 } from 'react-icons/ci'
import Navbar2 from '../navbar2';
import { BsSearch } from 'react-icons/bs';
import { ImSearch } from "react-icons/im";
import Avatar from './avatar';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = () => {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const [allPeople, setAllPeople] = useState({})
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { id } = useParams();

    useEffect(() => {
        console.log('Connecting to ws')
        connectToWs();
    }, [])

    const connectToWs = () => {
        const ws = new WebSocket('ws://localhost:3000')
        setWs(ws);
        ws.addEventListener('message', handleMessages)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected, Trying to reconnect...')
                connectToWs()
            }, 1000)
        })
    }

    const showOnlinePeople = (peopleArray) => {
        const people = {};
        // console.log('peopleArray', peopleArray)
        peopleArray.forEach(person => {
            if (id != person.userId) people[person.userId] = person.username;
        });
        console.log('people', people)
        setOnlinePeople(people);
    }

    const handleMessages = (e) => {
        const messageData = JSON.parse(e.data);
        console.log('new message', messageData);
        console.log(selectedUserId)

        if (selectedUserId && (messageData.sender === selectedUserId)) {
            setMessages(prev => [...prev, messageData]);
            console.log('messages', messages);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText
        }))
        setNewMessageText('')
        setMessages(messages => [...messages, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),
        }])
    }

    // Scroll to bottom of messages
    useEffect(() => {
        const div = document.getElementById('divUnderMessage')
        if (div) div.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        const fetchPeople = async () => {
            const user_id = id;
            const response = await fetch(`${BASE_URL}/message/people/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',
                }
            )
            if(response.status === 401) navigate('/login')
            const allPeopleArr = await response.json()
            const allPeople = {};
            allPeopleArr.forEach(person => {
                allPeople[person.senderId] = person.senderName;
            });
            setAllPeople(allPeople)
        }
        fetchPeople()

    }, [BASE_URL, id, navigate])

    useEffect(() => {
        const fetchMessages = async () => {
            const user_id = id;
            const selected_user_id = selectedUserId;
            const response = await fetch(`${BASE_URL}/message/user/${user_id}/${selected_user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },  
                }
            )
            const data = await response.json()
            setMessages(data)
        }
        if (selectedUserId) fetchMessages()
    }, [selectedUserId, BASE_URL, id])

    return (
        <div className='h-screen bg-gray-100'>
            <Navbar2 />
            <div className='flex m-16 h-[75%]'>
                <div className='bg-white w-[30%] rounded-3xl mr-10 p-5'>
                    {/* Contacts */}
                    <div className='flex border w-full p-2 rounded-full bg-gray-50 items-center mb-5'>
                        <ImSearch className='text-gray-400 mr-2' />
                        <input type="text" placeholder='Search a chat...' className='w-full outline-none' />
                    </div>
                    {Object.keys(allPeople).map((senderId) => (
                        <div key={senderId}
                            onClick={() => setSelectedUserId(senderId)}
                            className={`${(senderId === selectedUserId) ? 'bg-gray-200' : 'hover:bg-gray-100'} flex items-center gap-2 p-2  rounded-xl h-16 cursor-pointer`}>

                            <Avatar username={allPeople[senderId]} userId={senderId} size={12} />
                            <div>
                                <p className='text-gray-700 font-semibold'>{allPeople[senderId]}</p>
                                <p className='text-gray-400 text-xs mt-1'>Last Message</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className='flex flex-col bg-blue-300 w-2/3 p-2 '> */}
                <div className='flex flex-col  bg-white w-2/3 rounded-3xl'>
                    {selectedUserId && <div className='bg-gray-700 h-16 flex items-center pl-4 rounded-t-xl'>
                        <div className='flex items-center'>
                            <Avatar username={allPeople[selectedUserId]} userId={selectedUserId} size={12} />
                            <h3 className='text-xl mb-1 text-white ml-1'>{allPeople[selectedUserId]}</h3>
                        </div>
                    </div>}
                    <div className='flex-grow pl-2'>
                        {!selectedUserId && <div className='flex items-center h-full justify-center text-gray-400'>
                            <span className='text-2xl mr-1'>&larr;</span> Select a person from sidebar
                        </div>}
                        {selectedUserId && <div className='h-full relative'>
                            <div className='absolute overflow-y-scroll inset-0'>
                                {messages && messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.sender === id ? 'justify-end' : 'justify-start'} items-center gap-2 ${index === 0 ? 'mt-4' : ''} p-2`}>
                                        <div className={`p-2 rounded-lg max-w-96 ${message.sender === id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div id="divUnderMessage"></div>
                            </div>
                        </div>}
                    </div>
                    {selectedUserId && <form
                        className='flex items-center gap-2 p-2 mb-2'
                        onSubmit={sendMessage}
                    >
                        <input
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            type="text"
                            placeholder='Type a message'
                            className='border bg-white flex-grow p-2 rounded-lg outline-blue-500'
                        />
                        <button type='submit' className='flex items-center justify-center bg-blue-500 text-white text-4xl h-10 p-1 w-10 rounded-lg'>
                            <CiLocationArrow1 className='' />
                        </button>
                    </form>}
                </div>
            </div>
        </div>
    )
}

export default Chat
