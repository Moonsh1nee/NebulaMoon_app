import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hook";
import Icon from "./Icon";
import React from "react";
import { logout } from "../store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
    dispatch(logout());
  };

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <header className="header">
      <div className="header__wrapper">
        <Link to="/" className="header__title">
          Nebula
          <span>Moon</span>
        </Link>
        {isAuthenticated ? (
          <div className="header__auth-icon-wrapper">
            <div className="header__auth-icon" onClick={handleIconClick}>
              <Icon name="account_auth_test" className="auth" />
            </div>
            {isModalOpen && (
              <div className="header__modal" ref={modalRef}>
                <button
                  onClick={handleLogout}
                  className="btn header__modal-button"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header__auth">
            <Link to="/login" className="btn header__auth-link">
              Login
            </Link>
            <Link to="/register" className="btn header__auth-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
