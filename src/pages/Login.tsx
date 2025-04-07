import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth">
      <div className="container">
        <div className="auth__wrapper">
          <h1 className="auth__title">Login</h1>
          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="auth__form-field">
              <label htmlFor="email" className="auth__form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="auth__form-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth__form-field">
              <label htmlFor="password" className="auth__form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="auth__form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="auth__form-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="auth__error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
