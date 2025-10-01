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
// Makes sure the submissions and the user files exist

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
        const user = await authenticateUser(email, password) // Checks user credentials

        res.status(200).json({ // If valid,
            message: "Login successful.",
            user: {email: user.email, role: user.role} // returns with message and user info
        })
    }catch(err){ // If invalid,
        res.status(401).send("Invalid email or password.") // error message
    }
})

// Adds a new submission
app.post('/submit-form', async (req, res, next) =>{
    try{
        const data = req.body
        const created = await addInfo(data)
        res.status(201).json({message: "Form submitted successfully.", submission: created})
    }catch(err){
        next(err)
    }
})

// Checks for the x-admin-role header to only allow admins
function requireAdmin(req, res, next){
    const role = req.headers['x-admin-role']
    if(role !== 'admin'){
        return res.status(403).json({error: 'Admins only.'})
    }
    next()
}

// Gets all of the submissions (requires admin)
app.get('/admin/api/submissions', requireAdmin, async (req, res, next) =>{
    try{
        const submissions = await listInfo()
        res.status(200).json({count: submissions.length, submissions})
    }catch(err){
        next(err)
    }
})

// Updates a submission (requires admin)
app.patch('/admin/api/submissions/:id', requireAdmin, async (req, res, next) =>{
    try{
        const {id} = req.params
        const updates = req.body
        const updated = await updateInfo(id, updates)
        res.status(200).json({message: 'Submission Updated:', updated})
    }catch(err){
        next(err)
    }
})

// Deletes a submission (requires admin)
app.delete('/admin/api/submissions/:id', requireAdmin, async (req, res, next) =>{
    try{
        const {id} = req.params
        const removed = await deleteInfo(id)
        res.status(200).json({message: 'Submission Deleted:', removed})
    }catch(err){
        next(err)
    }
})

// Returns total submissions grouped by interest and status (guess what it requires)
app.get('/admin/api/stats', requireAdmin, async (req, res, next) =>{
    try{
        const submissions = await listInfo() // Gets all submissions

        const total = submissions.length // Total number of submissions
        const byInterest = submissions.reduce((acc, s) =>{ // uses reduce to count the submissions by interest area
            // "acc" is a basket, and "s" is a fruit being put in the basket
            
            acc[s.interest] = (acc[s.interest] || 0) + 1
            // For each submission (s):
                // The submission interest count increases by 1
                // If it hasn't appeared yet, it treats it as 0
            return acc;
        }, {})

        const byStatus = submissions.reduce((acc, s) =>{ // Essentially the same thing as before but counts submissions by status
            acc[s.status || 'pending'] = (acc[s.status || 'pending'] || 0) + 1
            return acc;
        }, {})

        res.json({total, byInterest, byStatus}) // Sends back a response containing the total amount of responses, 
        // the counts per interest area, and the counts per status
        
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
