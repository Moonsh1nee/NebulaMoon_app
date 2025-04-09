import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hook';
import { createTask, fetchTasks, updateTask } from '../store/slices/tasksSlice';
import Task from '../components/Task';
import { TaskType } from '../types';
import TaskEditModal from '../components/TaskEditModal';

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });
  const [newEditTask, setNewEditTask] = React.useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [isAuthenticated, dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    dispatch(createTask(newTask)).then(() => {
      setNewTask({ title: '', description: '', dueDate: '', completed: false });
    });
  };

  const handleEditTask = (task: TaskType) => {
    setEditingTaskId(task._id);
    setNewEditTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      completed: task.completed || false,
    });
  };

  const handleSaveEdit = (id: string) => {
    dispatch(updateTask({ id, ...newEditTask })).then(() => {
      setEditingTaskId(null);
    });
  };

  if (!isAuthenticated) return <h1>Please log in to view your tasks.</h1>;
  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;

  const editingTask = tasks.tasks.find((task) => task._id === editingTaskId);

  return (
    <div className="tasks">
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
          <Task task={task} key={task._id} onEdit={handleEditTask} />
        ))}
      </ul>

      {editingTaskId && editingTask && (
        <TaskEditModal
          task={editingTask}
          setEditingTask={setEditingTaskId}
          newTask={newEditTask}
          setNewTask={setNewEditTask}
          handleSaveEdit={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Tasks;
