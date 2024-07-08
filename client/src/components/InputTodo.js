import React, { Fragment, useState } from "react";

const InputTodo = () => {


    const [description, setDescription] = useState("")

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { description };
            const response = await fetch("http://localhost:5001/protected/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(body)
            });
            //refresh when it's done
            window.location = "/todos";
            console.log(response);
        } catch (error) {
            console.error(error.message)
        }
    };

    return (
        <Fragment>
            <h1 className="text-center mt-5">
                Todo List
            </h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                <div><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></div>
                <button className="btn btn-outline-success">&nbsp;&nbsp;Add&nbsp;&nbsp;</button>
            </form>
        </Fragment>
    );
};

export default InputTodo;