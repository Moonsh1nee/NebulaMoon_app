import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { fetchTasks } from "../store/slices/tasksSlice";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <h1>Please log in to view your tasks.</h1>;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Tasks Page</h1>
      <ul>
        {tasks.tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.completed ? "Done" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
