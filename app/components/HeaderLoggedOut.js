import React, { useEfffect, useState, useContext } from "react";
import Axios from "axios";
import dispatchContext from "../dispatchContext";

function HeaderLoggedOut(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const appDispatch = useContext(dispatchContext);
  async function handleClick(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", { username, password });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({ type: "flashmsg", value: "Congrats! You have successfully logged in to your account." });
        console.log(response.data);
      } else {
        appDispatch({ type: "flashmsg", value: "Incorrect username / password." });
        console.log("Incorrect username / password.");
      }
    } catch (e) {
      console.log("err");
    }
  }

  return (
    <>
      <form onSubmit={handleClick} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    </>
  );
}
export default HeaderLoggedOut;
