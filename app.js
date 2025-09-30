/* Mainly copied from teacher codealong */

import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import morgan from 'morgan'
import {ensureDataFile, listInfo, addInfo, updateInfo, deleteInfo} from './utils/info.js'
import {ensureUsersFile, authenticateUser} from './utils/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.static(path.join(__dirname, 'public')))

ensureDataFile()
ensureUsersFile()

// Main route
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Login page
app.get('/login', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Admin page
app.get('/admin', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'admin.html'))
})

// Login check
app.post('/auth/login', async (req, res) =>{
    try{
        const {email, password} = req.body
        const user = await authenticateUser(email, password)

        if(user.role === "admin"){ // If they have an admin role,
            res.redirect('/admin') // they go to the admin page
        }else{
            res.redirect('/') // If not, they go to the main page
        }
    }catch(err){ // If they put in the wrong email/password,
        res.status(401).send("Invalid email or password.") // error message
    }
})

// Adds a new submission
app.post('/submit-form', async (req, res, next) =>{
    try{
        const data = req.body
        const created = await addInfo(data)
        res.status(201).json({message: "Form submitted successfully", submission: created})
    }catch(err){
        next(err)
    }
})

// Gets all of the submissions
app.get('/admin/api/submissions', async (req, res, next) =>{
    try{
        const submissions = await listInfo()
        res.status(200).json({ count: submissions.length, submissions })
    }catch(err){
        next(err)
    }
})

// Updates a submission
app.patch('/admin/api/submissions/:id', async (req, res, next) =>{
    try{
        const {id} = req.params
        const updates = req.body
        const updated = await updateInfo(id, updates)
        res.status(200).json({message: 'Submission Updated:', updated})
    }catch(err){
        next(err)
    }
})

// Deletes a submission
app.delete('/admin/api/submissions/:id', async (req, res, next) =>{
    try{
        const {id} = req.params
        const removed = await deleteInfo(id)
        res.status(200).json({message: 'Submission Deleted:', removed})
    }catch(err){
        next(err)
    }
})

app.get('/admin/api/stats', async (req, res, next) =>{
    try{

    }catch(err){
        next(err)
    }
})

// 404 handler
app.use((req, res) =>{
    res.status(404).send("Sorry, we couldn't find that page.")
})

// 500 handler
app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something broke server-side.")
})

app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
