import React, { useEffect, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import ACTIONS from '../Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { initSocket } from '../socket'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import Axios from 'axios';

import { Editor as EditorArea } from "@monaco-editor/react";
const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null)
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([
    //         {socketId:1, username:'Anik D'},
    //         {socketId:2, username:'Soumya D'},
  ])
  // State variable to set users input
  const [userInput, setUserInput] = useState("");
  const [userLang, setUserLang] = useState("python");
  // State variable to set users output
  const [userOutput, setUserOutput] = useState("");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket Connection failed, try again later!!')
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      })
      //Listening for Joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) { toast.success(`${username} joined the room.`); }
        setClients(clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        })

      })
      //Listening for Disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room..`)
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId)
        })
      })
    }
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

      socketRef.current.disconnect();

    }
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('RoomID has been copied..')
    } catch (err) {
      toast.error('Could not copy RoomID')

    }

  }
  function leaveRoom() {
    reactNavigator('/');
  }
  function compile() {

    if (codeRef.current === ``) {
      return
    }
    console.log(codeRef.current);
    // Post request to compile endpoint
    Axios.post(`https://wcs-devcamp.herokuapp.com/`, {
      code: codeRef.current,

      language: userLang,
      input: userInput
    }).then((res) => {
      setUserOutput(res.data.output);
    })
  }
  function clearOutput() {
    setUserOutput("");

  }


  if (!location.state) {
    <Navigate to="/" />
  }
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img src='/logo.png' className='logoImg' />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className='btn btnCopy' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn btnLeave' onClick={leaveRoom}>Leave Room</button>

      </div>
      <div className='editorWrap'>

        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
      </div>
      <div className="input-output">
        <h4>Input:</h4>
        <div className="input">
          <textarea id="code-inp" onChange=
            {(e) => setUserInput(e.target.value)}>
          </textarea>
        </div>
        <h4>Output:</h4>
        {/* {loading ? (
            <div className="spinner-box">
              <img src={spinner} alt="Loading..." />
            </div>
          ) : ( */}
        <div className="output-box">
          <pre>{userOutput}</pre>
          <button onClick={() => { clearOutput() }}
            className="clear-btn">
            Clear
          </button>

          <button className="run-btn" onClick={() => compile()}>
            Run
          </button>
        </div>
      </div>
      {/* <div className='input-output'>
                    <div className='lang'>
                        Language: <select name='lang' id='lang'>
                            <option value='python'>Python</option>

                        </select>
                    </div>
                    <form id="code" name="code" method="post">
                    <div className='input'>
                    <textarea id='input' placeholder='Input goes here...'></textarea>
                    </div>
                    <div className='output'><textarea id='output' placeholder='Output goes here...'></textarea></div>
                    
                    <button onclick="submit">Submit</button>
                     </form>
        </div> */}
    </div>
  )
}

export default EditorPage