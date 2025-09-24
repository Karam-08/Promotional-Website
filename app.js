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

app.use(express.static(path.join(__dirname, 'public')))
ensureDataFile()

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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use((req, res, next) =>{
    // Log the core request parts
    console.log("\n--- Incoming Request ---")
    console.log("Method:", req.method)
    console.log("URL:", req.url)
    console.log("Headers:", req.headers)
    console.log("Body:", req.body)

    // After the response is sent, we log the status code
    res.on("finish", ()=>{
        console.log("--- Outgoing Response ---")
        console.log("Status:", res.status)
        console.log("-------------------------------\n")
    })

    next()
})

async function readDB(){
    const rawData = await fs.readFile(database, 'utf-8')
    return JSON.parse(rawData)
}

async function writeDB(data){
    const text = JSON.stringify(data, null, 2)
    await fs.writeFile(database, text, 'utf-8')
}

app.get('/', (req, res) =>{
    res.status(200).json({
        message: "Info API is Running",
        endpoints: ["/info (GET, POST)", "/info/:id (GET, PUT, DELETE)"]
    })
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