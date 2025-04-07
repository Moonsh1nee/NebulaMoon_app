import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          <li className="sidebar__nav-item">
            <NavLink className="sidebar__nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink className="sidebar__nav-link" to="/tasks">
              Tasks
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink className="sidebar__nav-link" to="/habits">
              Habits
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
