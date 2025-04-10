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
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(task.title);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      onEdit(task);
      clickTimeoutRef.current = null;
    }, 300);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = () => {
    if (title.trim() && title !== task.title) {
      dispatch(
        updateTask({
          id: task._id,
          title,
          description: task.description,
          dueDate: task.dueDate,
          completed: task.completed,
        }),
      );
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <li className="tasks__list-item">
      <input
        type="checkbox"
        className="tasks__checkbox"
        checked={task.completed ?? false}
        onChange={handleToggleComplete}
      />

      <div className="tasks__item" onClick={handleClick}>
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={saveTitle}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span
            className={"tasks__item-title"}
            onDoubleClick={handleDoubleClick}>
            {task.title}
          </span>
        )}
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
