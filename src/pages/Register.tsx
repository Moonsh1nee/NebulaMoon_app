import React from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { register, resetRegisterSuccess } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (registerSuccess) {
      navigate("/login");
      dispatch(resetRegisterSuccess());
    }
  }, [registerSuccess, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email, password }));
  };

  return (
    <div className="auth">
      <div className="container">
        <div className="auth__wrapper">
          <h1 className="auth__title">Register</h1>
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
                required
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
                required
              />
            </div>
            <button
              type="submit"
              className="auth__form-button"
              disabled={loading}
            >
              {loading ? "Processing..." : "Register"}
            </button>
            {error && <p className="auth__error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;