import React, { Fragment, useEffect, useState } from "react";

import EditTodo from "./EditTodo";

const ListTodos = () => {

    const [todos, setTodos] = useState([]);

    //getTodo function
    const getTodos = async () => {
        try {

            const response = await fetch("http://localhost:5001/protected/todos", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const jsonData = await response.json()

            setTodos(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    }


    //deleteTodo function
    const deleteTodo = async (id) => {
        try {
            const deleteTodo = await fetch(`http://localhost:5001/protected/todos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setTodos(todos.filter(todo => todo.todo_id !== id))
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getTodos()
    }, [])

    //Edit
    const [editId, setEditId] = useState(0);
    const [description, setDescription] = useState("");
    const handleButtonClick = (id, description) => {
        setEditId(id);
        setDescription(description);
    };

    //updateDescription function
    const updateDescription = async (id) => {
        try {

            const body = { description };
            const response = await fetch(`http://localhost:5001/protected/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(body)
            });

            // Update the todos list without changing the order
            setTodos(todos.map(todo =>
                todo.todo_id === id ? { ...todo, description: description } : todo
            ));
            setEditId(0); // Exit edit mode
        } catch (error) {
            console.error(error.message)
        }
    };


    return (
        <Fragment>
            <table class="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr> */}
                    {todos.map(todo => (
                        <tr key={todo.todo_id}>
                            <td>{editId === todo.todo_id ?
                                (<input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />)
                                :
                                (todo.description)}</td>
                            {/* <td><EditTodo todo={todo} /></td> */}
                            <td>{editId === todo.todo_id ?
                                (<button className="btn btn-outline-primary" onClick={() => updateDescription(todo.todo_id)}>Save</button>)
                                :
                                (<button className="btn btn-outline-warning" onClick={() => handleButtonClick(todo.todo_id, todo.description)}>Edit</button>)}</td>
                            <td><button className="btn btn-outline-danger" onClick={() => deleteTodo(todo.todo_id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    )
};

export default ListTodos;