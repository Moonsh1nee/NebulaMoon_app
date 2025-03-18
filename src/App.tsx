import React from "react";
import "./assets/styles/main.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
