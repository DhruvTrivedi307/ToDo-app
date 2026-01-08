import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createRoot } from 'react-dom/client'
import { Pencil } from 'lucide';

function App() {

  const [todos, setTodos] = useState([]);
  const retrive = import.meta.env.VITE_APP_RETRIVE_URL;
  useEffect(() => {
    fetch(retrive)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const [input, setInput] = useState('');
  const handleInput = (event) => {
    setInput(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const retrive = import.meta.env.VITE_APP_RETRIVE_URL;
    fetch(retrive, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input })
    })
      .then(res => res.json())
      .then(newTask => {
        setTodos([...todos, newTask]);
        setInput("");
      });
  }

  const handleDelete = (index) => {
    const id = todos[index].id;
    const destroy = import.meta.env.VITE_APP_DESTROY_URL;
    fetch(destroy + id, {
      method: "DELETE",
    })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  }

  const handleEdit = (index) => {
    const newText = prompt("Enter new Text:", todos[index].text);
    if (newText === "" || newText === null) {
      return
    }
    const update = import.meta.env.VITE_APP_UPDATE_URL;
    fetch(update + todos[index].id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: newText, status: "todo" })
    })
      .then(res => res.json())
      .then(newTask => {
        setTodos(todos.map(t => t.id === newTask.id ? { ...t, text: newTask.text } : t));
        console.log(todos[index]);
      });
  }

  function handleDragEnd(event){  
    const {active, over} = event;
    if(!over) return; 

    const taskId = active.id;
    const newstatus = over.id;
  }

  return (
    <>
      <div className="container p-10 mt-10 justify-self-center">
        <div className="add">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter task..." className="border rounded-xl p-2 mr-5 w-270" value={input} onChange={handleInput} />
            <button type="submit" className="border p-2 h-11 rounded-xl w-20 text-[12px] mb-10 cursor-pointer">Add</button>
          </form>
        </div>

        <div className="search">
          <form action="">
            <input type="text" placeholder="Search..." className="border rounded-xl p-2 mr-5 w-50" id="search" />
          </form>
          <span id="result"></span>
        </div>

        <table className="mt-10">
          <thead className="border-b">
            <tr className="h-20">
              <th className="w-100 text-[26px] border-r">ToDo</th>
              <th className="w-100 text-[26px] border-r">In Progress</th>
              <th className="w-100 text-[26px]">Done</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-8 border-r pt-0">
                <div id="todo-list">
                  <div className="">
                    {todos.filter(t => t.status === "todo").map((todo, index) => (
                      <div key={todo.id} className='mt-10'>
                        <div className="text-xs mb-1">{todo.created_at.slice(8, 10)}{todo.created_at.slice(4, 8)}{todo.created_at.slice(0, 4)}</div>
                        <div className="font-semibold text-[28px]">{todo.text}</div>
                        <div className="flex gap-2 mt-5">
                          <button onClick={() => handleEdit(index)} className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(index)} className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td className="p-8 border-r">
                <div id="progress-list">
                  <div className="">
                    {todos.filter(t => t.status === "progress").map(todo => (
                      <div key={todo.id}>
                        <div className="text-xs mb-1">{todo.created_at.slice(0, 10)}</div>
                        <div className="font-semibold text-[28px]">{todo.text}</div>
                        <div className="flex gap-2 mt-5">
                          <button className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Edit</button>
                          <button className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td className="p-8">
                <div id="done-list">
                  <div className="">
                    {todos.filter(t => t.status === "done").map(todo => (
                      <div key={todo.id}>
                        <div className="text-xs mb-1">{todo.created_at.slice(0, 10)}</div>
                        <div className="font-semibold text-[28px]">{todo.text}</div>
                        <div className="flex gap-2 mt-5">
                          <button className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Edit</button>
                          <button className="border p-2 rounded-lg w-20 text-[12px] cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )

}

export default App
