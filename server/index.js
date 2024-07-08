const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//middleware
app.use(cors());
app.use(express.json());//req.body



//Authenticate Token Verifiction
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('No Authorization header');
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user_id = verified.user_id;
        console.log('Token verified:', verified); // Log the verified token for debugging
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(400).json({ error: 'Invalid token' });
    }
};



//ROUTES//

//create a todo

app.post("/protected/todos", authenticateToken, async (req, res) => {
    //await
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            //query command
            "INSERT INTO todo (description, user_id) VALUES($1, $2) RETURNING *",
            //$1 value
            [description, req.user_id]
        );

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
})

//get all todo

app.get("/protected/todos", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user_id
        const allTodos = await pool.query(
            //select all from todo where belong to the login user
            "SELECT * FROM todo WHERE user_id = $1",
            [user_id]
        );

        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//get a todo

app.get("/protected/todos/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query(
            //select when id match
            "SELECT * FROM todo WHERE todo_id = $1",
            //$1 value
            [id]
        );

        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//update a todo

app.put("/protected/todos/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            //update with req.body when id match
            "UPDATE todo SET description = $2 WHERE todo_id = $1",
            //$1 value, $2 value
            [id, description]
        );

        res.json("Todo was updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//delete a todo

app.delete("/protected/todos/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
            [id]
        );

        res.json("Todo was deleted!");
    } catch (error) {
        console.error(error.message);
    }
})


//LOGIN REGISTER for User

//getUsers
app.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query(
            //select all from users
            "SELECT * FROM users"
        );

        res.json(allUsers.rows);

    } catch (error) {
        console.error(error.message);
    }
})



//Register
app.post("/register", async (req, res) => {
    //await
    try {
        const { userName, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            //query command
            "INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *",
            //$1 $2 $3 value
            [userName, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);

    } catch (error) {
        console.error(error.message);
    }
})


//Login

const JWT_SECRET = '448f3e5eaed8a2fcb4df6d4d1a1568ba80e88d62961313a5de245a29034f9f090b5ebd446411c9273e19184f4e93d0025937343d00dc76b0a51a639509b3bc21';
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});




// Example protected route
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});




//Delete User
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query(
            "DELETE FROM users WHERE user_id = $1",
            [id]
        );

        res.json("User was deleted!");
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(5001, () => {
    console.log("server has started on port 5001!");
});