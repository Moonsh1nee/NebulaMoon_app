import React from "react";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="auth">
      <div className="container">
        <h1 className="auth__title">Register</h1>
        <form className="auth__form">
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
          <button type="submit" className="auth__form-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;