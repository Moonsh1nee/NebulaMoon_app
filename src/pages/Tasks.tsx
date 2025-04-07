import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../store/slices/tasksSlice";
import TaskEditModal from "../components/TaskEditModal";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = React.useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [isAuthenticated, dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    dispatch(createTask(newTask)).then(() => {
      setNewTask({ title: "", description: "", dueDate: "" });
    });
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task._id);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
    });
  };

  const handleSaveEdit = (id: string) => {
    dispatch(updateTask({ id, ...newTask })).then(() => {
      setEditingTask(null);
      setNewTask({ title: "", description: "", dueDate: "" });
    });
  };

  const handleToggleComplete = (task: any) => {
    dispatch(
      updateTask({
        id: task._id,
        title: task.title,
        completed: !task.completed,
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

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
    <div className="tasks">
      <h1 className="tasks__title">Tasks</h1>

      <form onSubmit={handleAddTask} className="tasks__form">
        <input
          type="text"
          className="tasks__form-input"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          autoFocus
        />
        <input
          type="date"
          className="tasks__form-input"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button type="submit" className="btn btn__tasks-add">
          Add Task
        </button>
      </form>

      <ul className="tasks__list">
        {tasks.tasks.map((task) => (
          <li key={task._id} className="tasks__list-item">
            <input
              type="checkbox"
              className="tasks__checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />

            {editingTask === task._id ? (
              <TaskEditModal
                task={task}
                setEditingTask={setEditingTask}
                newTask={newTask}
                setNewTask={setNewTask}
                handleSaveEdit={handleSaveEdit}
              />
            ) : (
              <div className="tasks__item" onClick={() => handleEditTask(task)}>
                <span className="tasks__item-title">{task.title}</span>
                {task.dueDate && (
                  <span className="tasks__item-due-date">
                    - Due: {task.dueDate}
                  </span>
                )}
                {task.description && (
                  <p className="tasks__item-desc">{task.description}</p>
                )}
              </div>
            )}

            <button
              className="btn btn__tasks-delete"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
