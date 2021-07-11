import React, { useState, useContext } from "react";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import stateContext from "../stateContext";
function Header(props) {
  const appState = useContext(stateContext);
  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-white">
            {" "}
            ComplexApp{" "}
          </a>
        </h4>
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
}

export default Header;
