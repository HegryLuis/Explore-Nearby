import React, { useState } from "react";
import "./Header.css";
import axios from "axios";
import { useApp } from "context";

const signUp = async (username: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:3001/users", {
      name: username,
      password,
    });
    console.log("User signed up:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error signing up:", error.response.data);
    throw error;
  }
};

const logIn = async (name: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:3001/users/check", {
      name: name,
      password,
    });
    console.log("User logged in:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error.response.data);
    throw error;
  }
};

const Header: React.FC = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isSighUp, setIsSighUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useApp();

  const handleSighUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newUser = await signUp(username, password);
      console.log("NEw = ", newUser);
      setUser(newUser);
      setIsLoggedIn(true);
      setModalActive(false);
    } catch (error: any) {
      console.error("Error signing up:", error.response.data);
    }
  };

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const loggedInUser = await logIn(username, password);
      console.log("loggedInUser = ", loggedInUser);
      setUser(loggedInUser);
      setIsLoggedIn(true);
      setModalActive(false);
    } catch (error: any) {
      console.error("Error logging in:", error.response.data);
    }
  };

  const toggleModal = () => {
    setModalActive(!modalActive);
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-logo">
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C7.662 0 4.5 3.162 4.5 7.5c0 4.11 6.3 12 7.5 12s7.5-7.89 7.5-12C19.5 3.162 16.338 0 12 0zm0 10.5c-1.656 0-3-1.344-3-3s1.344-3 3-3 3 1.344 3 3-1.344 3-3 3z"
              fill="#03045E"
            />
          </svg>
        </div>
        <div className="header-title">Explore Nearby</div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="greeting">Hello, {user?.name}!</div>
        ) : (
          <button className="header-button" onClick={toggleModal}>
            Sign up/Log in
          </button>
        )}
      </div>

      <div className={`modal ${modalActive ? "active" : ""}`}>
        <div className="modal-content">
          <button className="close-button" onClick={toggleModal}>
            <span>X</span>
          </button>

          <h6>
            <span
              onClick={() => {
                setIsSighUp(false);
              }}
              className={!isSighUp ? "active" : ""}
            >
              {" "}
              Log in
            </span>
            <span
              onClick={() => {
                setIsSighUp(true);
              }}
              className={isSighUp ? "active" : ""}
            >
              Sigh up
            </span>
          </h6>

          {isSighUp ? (
            <form className="login" onSubmit={handleSighUp}>
              <input
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button>Sigh up</button>
            </form>
          ) : (
            <form className="login" onSubmit={handleLogIn}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button>Log in</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
