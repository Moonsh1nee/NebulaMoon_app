import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { fetchTasks } from "../store/slices/tasksSlice";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks());
    }
  }, [token, dispatch]);

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
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.completed ? "Done" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
