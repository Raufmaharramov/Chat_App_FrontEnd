import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDom from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";
Axios.defaults.baseURL = process.env.BACKENDURL || "https://rauf-chat-app.herokuapp.com";

// My Components
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import Terms from "./components/Terms";
import About from "./components/About";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const SinglePagePost = React.lazy(() => import("./components/SinglePagePost"));
import FlashMessages from "./components/FlashMessages";
import stateContext from "./stateContext";
import dispatchContext from "./dispatchContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingDotsIcon";
function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("ComplexAppUser")),
    flashMessage: [],
    user: {
      token: localStorage.getItem("ComplexAppToken"),
      username: localStorage.getItem("ComplexAppUser"),
      avatar: localStorage.getItem("ComplexAppAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatMessage: 0
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashmsg":
        draft.flashMessage.push(action.value);
        return;
      case "SearchOn":
        draft.isSearchOpen = true;
        return;
      case "SearchOff":
        draft.isSearchOpen = false;
        return;
      case "chatToggle":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "increaseMessage":
        draft.unreadChatMessage++;
        return;
      case "endChatMessage":
        draft.unreadChatMessage = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("ComplexAppUser", state.user.username);
      localStorage.setItem("ComplexAppToken", state.user.token);
      localStorage.setItem("ComplexAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("ComplexAppUser");
      localStorage.removeItem("ComplexAppToken");
      localStorage.removeItem("ComplexAppAvatar");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token });
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashmsg", value: "Your session has expired. please log in again." });
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <stateContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/post/:id" exact>
                <SinglePagePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/about-us">
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition in={state.isSearchOpen} timeout={330} className="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </dispatchContext.Provider>
    </stateContext.Provider>
  );
}

ReactDom.render(<Main />, document.querySelector("#app"));
