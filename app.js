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

app.get('/info', async (req, res) =>{
    try{
        const info = await readDB()
        res.status(200).json(info)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Server failed to read the information."})
    }
})

app.get('/students/:id', async (req, res) =>{
    try{
        const info = await readDB()
        const data = info.find(i => i.id == req.params.id)
        if(!student){
            return res.status(404).json({error: "Data for that individual was not found."})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'Server failed to read all of the information.'})
    }
})

app.post('/students', async (req, res) =>{
    try{
        let {id, firstName, lastName, question} = req.body;

        if(!id || !firstName || !lastName || !question){
            return res.status(400).json({
                error: "Invalid Body. Required: ID, firstName, lastName, question."
            });
        }

        const student = await readDB();
        if(info.some(i => i.id === id)){
            return res.status(409).json({error: "ID already exists."})
        }

        const newData = {id, firstName, lastName, year};
        info.push(newData)
        await writeDB(info)

        res.status(201).json(newData)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Server cannot add that data."})
    }
})

app.put('/students/:id', async (req, res) =>{
    try{
        const info = await readDB()
        const idx = info.findIndex(i => i.id == req.params.id)

        if(idx === -1){
            return res.status(404).json({error: "The data for that individual was not found."})
        }

        if(firstName !== undefined){info[idx].firstName = firstName;}
        if(lastName !== undefined){info[idx].lastName = lastName;}
        if(year !== undefined){info[idx].year = year;}

        await writeDB(info);
        res.status(200).json(info[idx])
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Server failed to update"})
    }
})

app.delete('/info/:id', async (req, res) =>{
    try{
        const info = await readDB()
        const idx = info.findIndex(s => s.id == req.params.id)

        if(idx === -1){
            return res.status(404).json({error: "The data for that individual was not found."})
        }

        const deletedData = info.splice(idx, 1)[0];
        await writeDB(info)
        
        res.status(200).json(deletedData)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Server failed to delete the data."})
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