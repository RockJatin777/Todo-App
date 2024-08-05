// importing sqlite database
const sqlite3 = require("sqlite3").verbose();
// importing express server
const express = require("express");
// importing uuid package for unique id
const { v4: uuidv4 } = require("uuid");
// importing cors to communicate frontend to backend
const cors = require("cors");
// importing bcrypt to encrypt or decrypt password
const bcrypt = require("bcryptjs");
// importing jwt token to identify the user
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// connectind database
const db = new sqlite3.Database("./todo.db", (err) => {
    if (err) return console.error(err.message);
    
    console.log("Connected to the SQLite database.");
//  creating user table
    db.run(`CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY, 
        username TEXT UNIQUE, 
        password TEXT
    )`);
//  creating todo table
    db.run(`CREATE TABLE IF NOT EXISTS todo (
        id TEXT PRIMARY KEY, 
        user_id TEXT, 
        task_name TEXT, 
        isComplete INTEGER
    )`);
//  creating a server on port 3001
    app.listen(3001, () => {
        console.log("Server running at http://localhost:3001");
    });
});

// middleware function for authentication 
const authenticationToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.json("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "Token", (error, payload) => {
        if (error) {
            response.status(401);
            response.json("Invalid JWT Token");
            console.log(payload)
        } else {
            request.username = payload.username;
            next();
        }
        });
    }
};

// Register API

app.post("/register", async (request, response) => {
    const { username, password } = request.body;

    if (password.length > 6) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const selectQuery = `SELECT * FROM user WHERE username = ?`;
        db.get(selectQuery, [username], (err, DbUser) => {
            if (err) {
                response.status(500).json({ message: "Database error" });
            } else if (DbUser === undefined) {
                const createQuery = `
                    INSERT INTO user (id, username, password) 
                    VALUES (?, ?, ?)`;
                db.run(createQuery, [uuidv4(), username, hashedPassword], (err) => {
                    if (err) {
                        response.status(500).json({message: "Database error"});
                    } else {
                        const payload = {username: username};
                        const jwtToken = jwt.sign(payload, "Token");
                        response.send({jwtToken});
                    }
                });
            } else {
                response.status(400).json({message: "User already exists"});
            }
        });
    } else {
        response.status(400).json({message: "Password is too short"});
    }
});

// Login API

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const sql = `SELECT * FROM user WHERE username = ?`;

    db.get(sql, [username], async (err, dbUser) => {
        if (err) {
                res.status(500).json({ message: "Database error" });
            } else if (dbUser === undefined) {
                res.status(500).json({ message: "Invalid User" });
            } else {
                const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
                if(isPasswordMatch === true){
                    const payload = {username: username};
                    const jwtToken = jwt.sign(payload, "Token");
                    res.send({jwtToken});
                } else {
                    res.status(400).json({ message: "Invalid Password" })
                }
            }
    })

})


// Getting todoList Api

app.get('/todos', authenticationToken, (req, res) => {
    const { username } = req;

    // Fetch the user ID from the database asynchronously
    db.get(`SELECT id FROM user WHERE username = ?`, [username], (err, row) => {
        if (err) {
            return res.status(500).send("Database error");
        }
        if (!row) {
            return res.status(404).send("User not found");
        }

        const user_id = row.id;

        // Fetch todos for the user asynchronously
        const sql = `SELECT * FROM todo WHERE user_id = ?`;
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).send("Database error");
            }
            res.send(rows);
        });
    });
});


// Adding Task API

app.post("/todos", authenticationToken, (req, res) => {
    const { userInput, isComplete } = req.body;
    const { username } = req;

    // Fetch the user ID from the database asynchronously
    db.get(`SELECT id FROM user WHERE username = ?`, [username], (err, row) => {
        if (err) {
            return res.status(500).send("Database error");
        }
        if (!row) {
            return res.status(404).send("User not found");
        }

        const user_id = row.id;

        // Insert the new task into the database
        db.run(`INSERT INTO todo (id, user_id, task_name, isComplete) VALUES (?, ?, ?, ?)`, [uuidv4(), user_id, userInput, isComplete], (err) => {
            if (err) {
                return res.status(500).send("Database error");
            }
            res.json({ message: "Task added" });
        });
    });
});


// Deleting task API

app.delete('/todos/:id', authenticationToken, (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM todo WHERE id = ?`;
    db.run(sql, [id], (err) =>{
        if(err){
            res.status(500).send("Database error");
        } else{
            res.json({message: "Task deleted"});
        }
    });
});

// updating task Api

app.put('/todos/:id', authenticationToken, (req, res) => {
    const { id } = req.params;
    const { taskName } = req.body;
    const sql = `UPDATE todo SET task_name = ? WHERE id = ?`;
    db.run(sql, [taskName, id], (err) => {
        if(err){
            res.status(500).send("Database error");
        } else{
            res.json({message: "Task Updated"});
        }
    });
});


// marking completed task API

app.put('/todo/:id', authenticationToken, (req, res) => {
    const { id } = req.params;
    const { isComplete } = req.body
    const sql = `UPDATE todo SET isComplete = ? WHERE id = ?`;
    db.run(sql, [isComplete, id], (err) => {
        if(err){
            res.status(500).send("Database error");
        } else{
            res.json({message: "Task Updated"});
        }
    });
});
