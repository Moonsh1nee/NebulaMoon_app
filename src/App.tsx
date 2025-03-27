import React from "react";
import "./assets/styles/main.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import { useAppSelector } from "./hook";
import Register from "./pages/Register";
import Header from "./components/Header";

const App = () => {
  const token = useAppSelector((state) => state.auth.token);

  return (
    <Router>
      <Header />
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
