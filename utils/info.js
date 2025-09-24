import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const folder = path.join(__dirname, '..', 'data')
const file = path.join(folder, 'info.json')

// Ensure file exists
export async function ensureDataFile(){
    try{
        await fs.mkdir(folder, {recursive: true})
        await fs.access(file)
    }catch{
        await fs.writeFile(file, '[]', 'utf8')
    }
}

// Read all entries
export async function listInfo(){
    const rawData = await fs.readFile(file, 'utf8')
    try{
        return JSON.parse(rawData)
    }catch{
        await fs.writeFile(file, '[]', 'utf8')
        return []
    }
}