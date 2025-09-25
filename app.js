import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import morgan from 'morgan'
import {ensureDataFile, listInfo, addInfo} from './utils/info.js'

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

// Root route
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Gets all of the submissions
app.get('/api/info', async (req, res, next) =>{
    try{
        const entries = await listInfo()
        res.status(200).json({ count: entries.length, entries })
    }catch(err){
        next(err)
    }
})

// Adds a new submission
app.post('/api/info', async (req, res, next) =>{
    try{
        const data = req.body
        const created = await addInfo(data)
        res.status(201).json({message: "Info submitted successfully", entry: created})
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
