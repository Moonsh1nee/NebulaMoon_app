import React from "react";
import { Task } from "../types";

interface TaskEditModalProps {
  task: Task;
  setEditingTask: React.Dispatch<React.SetStateAction<string | null>>;
  newTask: {
    title: string;
    description: string;
    dueDate: string;
  };
  setNewTask: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      dueDate: string;
    }>
  >;
  handleSaveEdit: (id: string) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  setEditingTask,
  newTask,
  setNewTask,
  handleSaveEdit,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setEditingTask(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setEditingTask]);

  return (
    <div>
      <input
        type="text"
        className="tasks__edit-input"
        placeholder="Task title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <div>
        <input
          type="text"
          className="tasks__edit-input"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />

        <input
          type="date"
          className="tasks__edit-input"
          placeholder="Due Date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />

        <button
          className="btn btn__tasks-save"
          onClick={() => handleSaveEdit(task._id)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskEditModal;
