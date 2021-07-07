import React, { useContext, useEffect, useRef } from "react";
import stateContext from "../stateContext";
import dispatchContext from "../dispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import io from "socket.io-client";

function Chat() {
  const socket = useRef(null);
  const appState = useContext(stateContext);
  const appDispatch = useContext(dispatchContext);
  const myRef = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useImmer({
    typeField: "",
    chatMessage: []
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      myRef.current.focus();
    }
    appDispatch({ type: "endChatMessage" });
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.current = io("http://localhost:8080");
    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessage.push(message);
      });
    });
    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessage.length && !appState.isChatOpen) {
      appDispatch({ type: "increaseMessage" });
    }
  }, [state.chatMessage]);

  function handleSubmit(e) {
    e.preventDefault();
    socket.current.emit("chatFromBrowser", { message: state.typeField, token: appState.user.token });
    setState(draft => {
      draft.chatMessage.push({ message: draft.typeField, username: appState.user.username, avatar: appState.user.avatar });
      draft.typeField = "";
    });
  }

  function handleChange(e) {
    const value = e.target.value;
    setState(draft => {
      draft.typeField = value;
    });
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessage.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>{" "}
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.typeField} onChange={handleChange} ref={myRef} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
}

export default Chat;
