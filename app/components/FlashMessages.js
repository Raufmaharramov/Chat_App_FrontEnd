import React, { useEffect, useContext } from "react";
import stateContext from "../stateContext";

function FlashMessages(props) {
  const appState = useContext(stateContext);
  return (
    <div className="floating-alerts">
      {appState.flashMessage.map((msg, index) => {
        return (
          <div key={index} className="alert alert-success text-center floating-alert shadow-sm">
            {msg}
          </div>
        );
      })}
    </div>
  );
}
export default FlashMessages;
