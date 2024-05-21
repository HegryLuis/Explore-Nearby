import React, { useState } from "react";
import "./Header.css";

// Header
const Header: React.FC = () => {
  const [modalActive, setModalActive] = useState(false);

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
              fill="rgba(244, 91, 105, 1)"
            />
          </svg>
        </div>
        <div className="header-title">Explore Nearby</div>
      </div>

      <div className="header-right">
        <button className="header-button" onClick={toggleModal}>
          Sign up/Log in
        </button>
      </div>

      <div className={`modal ${modalActive ? "active" : ""}`}>
        <div className="modal-content">
          <form className="login">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;
