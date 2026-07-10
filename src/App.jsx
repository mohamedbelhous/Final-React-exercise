import { useEffect, useState } from "react";

export default function App() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  // تحميل المهام
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // حفظ المهام
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // تحميل وضع الصفحة
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");

    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // حفظ وضع الصفحة + تغيير الـ body
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // إضافة مهمة
  const addTask = () => {
    if (text.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setText("");
    setShow(false);
  };

  // حذف
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // إنهاء
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // بدء التعديل
  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  // حفظ التعديل
  const saveEdit = () => {
    if (editText.trim() === "") return;

    setTasks(
      tasks.map((task) =>
        task.id === editId
          ? { ...task, text: editText }
          : task
      )
    );

    setEditId(null);
    setEditText("");
  };

  // الفلاتر
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;

    if (filter === "completed") return task.completed;

    return true;
  });

  return (
    <div className="all">
      <div className="topBar">
        <h1>Todo List</h1>

        <button
          className="modeBtn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <button onClick={() => setShow(!show)}>
        {show ? "Close" : "Add Task"}
      </button>

      {show && (
        <div className="add">
          <input
            type="text"
            placeholder="Enter task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button onClick={addTask}>Add</button>
        </div>
      )}

      <div className="filters">
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="tasks">
        {filteredTasks.length === 0 ? (
          <p className="empty">No Tasks</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              {editId === task.id ? (
                <>
                  <input
                    className="editInput"
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit();
                      }
                    }}
                  />

                  <button onClick={saveEdit}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={
                      task.completed ? "completed" : ""
                    }
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}