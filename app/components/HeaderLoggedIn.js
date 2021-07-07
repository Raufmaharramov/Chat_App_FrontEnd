import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import dispatchContext from "../dispatchContext";
import stateContext from "../stateContext";
import ReactTooltip from "react-tooltip";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(dispatchContext);
  const appState = useContext(stateContext);

  function handelDelete() {
    appDispatch({ type: "logout" });
    appDispatch({ type: "flashmsg", value: "You have successfully logged out." });
    console.log("did");
  }

  function handleSearch(e) {
    e.preventDefault();
    appDispatch({ type: "SearchOn" });
  }
  return (
    <>
      <div className="flex-row my-3 my-md-0">
        <a data-for="search" data-tip="Search" onClick={handleSearch} href="#" className="text-white mr-2 header-search-icon">
          <i className="fas fa-search"></i>
        </a>
        <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
        <span onClick={() => appDispatch({ type: "chatToggle" })} data-for="chat" data-tip="Chat" className="mr-2 header-chat-icon text-white">
          <i className="fas fa-comment"></i>
          <span className={"chat-count-badge " + (!appState.isChatOpen && appState.unreadChatMessage ? "text-danger" : "text-white")}>{appState.unreadChatMessage < 10 ? appState.unreadChatMessage : "9+"}</span>
        </span>
        <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
        <Link data-for="profile" data-tip="Profile" to={`/profile/${appState.user.username}`} className="mr-2">
          <img className="small-header-avatar" src={appState.user.avatar} />
        </Link>
        <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
        <Link className="btn btn-sm btn-success mr-2" to="/create-post">
          Create Post
        </Link>{" "}
        <button onClick={handelDelete} className="btn btn-sm btn-secondary">
          Sign Out
        </button>
      </div>
    </>
  );
}
export default HeaderLoggedIn;
