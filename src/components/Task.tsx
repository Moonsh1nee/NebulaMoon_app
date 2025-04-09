import React from 'react';
import { TaskType } from '../types';
import { useAppDispatch } from '../hook';
import { updateTask, deleteTask } from '../store/slices/tasksSlice';

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit }) => {
  const dispatch = useAppDispatch();

  const handleToggleComplete = () => {
    dispatch(
      updateTask({
        id: task._id,
        title: task.title,
        completed: !task.completed,
      }),
    );
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(task._id));
  };

  return (
    <li className="tasks__list-item">
      <input
        type="checkbox"
        className="tasks__checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
      />

      <div className="tasks__item" onClick={() => onEdit(task)}>
        <span className="tasks__item-title">{task.title}</span>
        {task.dueDate && <span className="tasks__item-due-date">- Due: {task.dueDate}</span>}
        {task.description && <p className="tasks__item-desc">{task.description}</p>}
      </div>

      <button className="btn btn__tasks-delete" onClick={handleDeleteTask}>
        Delete
      </button>
    </li>
  );
};

export default Task;
