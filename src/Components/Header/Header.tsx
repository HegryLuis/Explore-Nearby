import React, { useState, useEffect } from "react";
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

const checkPassword = async (userId: string, password: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/users/check-password",
      {
        userId,
        password,
      }
    );
    console.log("Password verified");
    return true;
  } catch (error: any) {
    console.error("Error checking password:", error.response.data);
    throw error;
  }
};

const Header: React.FC = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isChangeModalActive, setIsChangeModalActive] = useState(false);
  const [isSighUp, setIsSighUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useApp();
  const [newUsername, setNewUsername] = useState(user ? user.name : "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordValid, setCurrentPasswordValid] = useState(false);

  useEffect(() => {
    setCurrentPasswordValid(false);
  }, [isChangeModalActive]);

  const handleSighUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newUser = await signUp(username, password);
      console.log("New user =", newUser);
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
      setUser(loggedInUser);
      setNewUsername(loggedInUser.name);
      setIsLoggedIn(true);
      setModalActive(false);
    } catch (error: any) {
      console.error("Error logging in:", error.response.data);
    }
  };

  const handleChangeLoginPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      // Проверить текущий пароль перед обновлением
      const passwordVerified = await checkPassword(
        user?.id || "",
        currentPassword
      );
      if (!passwordVerified) {
        throw new Error("Current password does not match.");
      }

      const response = await axios.put(
        `http://localhost:3001/users/${user?.id}`,
        {
          name: newUsername,
          password: newPassword,
        }
      );

      setNewPassword("");
      setCurrentPassword("");
      setIsChangeModalActive(false);
    } catch (error) {
      console.error("Error updating login/password ", error);
    }
  };

  const handleLogOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    setModalActive(false); // Close modal if open
  };

  const toggleModal = () => {
    setModalActive(!modalActive);
  };

  const toggleChangeModal = () => {
    setIsChangeModalActive(!isChangeModalActive);
  };

  // Обработчик изменения текущего пароля
  const handleCurrentPasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCurrentPassword(value); // Обновляем текущее значение поля

    try {
      // Проверяем текущий пароль динамически при каждом изменении
      const passwordVerified = await checkPassword(user?.id || "", value);
      setCurrentPasswordValid(passwordVerified); // Обновляем состояние валидации
    } catch (error) {
      console.error("Error checking current password:", error);
      setCurrentPasswordValid(false); // Если ошибка, считаем пароль неверным
    }
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
        <div className="header-title animated-text">
          <span>Explore Nearby</span>
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="greeting">
            <p>
              Hello, <span>{newUsername}!</span>
            </p>
            <div className="greeting-buttons">
              <button className="btn" onClick={handleLogOut}>
                Log Out
              </button>
              <button className="btn" onClick={toggleChangeModal}>
                Change login/password
              </button>
            </div>
          </div>
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
              Log in
            </span>
            <span
              onClick={() => {
                setIsSighUp(true);
              }}
              className={isSighUp ? "active" : ""}
            >
              Sign up
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
              <button>Sign up</button>
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

      <div className={`modal ${isChangeModalActive ? "active" : ""}`}>
        <div className="modal-content">
          <button className="close-button" onClick={toggleChangeModal}>
            <span>X</span>
          </button>

          <h6>Change login/password</h6>

          <form className="login" onSubmit={handleChangeLoginPassword}>
            <input
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange} // Обработчик для динамической проверки текущего пароля
            />
            {currentPasswordValid ? (
              <button>Update</button>
            ) : (
              <p className="error-message">Current password is incorrect.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;
