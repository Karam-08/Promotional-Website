import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const folder = path.join(__dirname, '..', 'data')
const file = path.join(folder, 'submissions.json')

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

function dataValidation(input){
    const errors = []

    const firstName = String(input.firstName || "").trim()
    const lastName = String(input.lastName || "").trim()
    const email = String(input.email || "").trim()
    const interest = String(input.interest || "").trim().toLowerCase()

    if(!firstName){errors.push("First Name required")}
    if(!lastName){errors.push("Last Name required")}
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        errors.push("Valid email is required")
    }

    if(!interest || !["newsletter", "info", "none"].includes(interest)){
        errors.push("Interest must be 'newsletter' or 'info' or 'none")
    }

    if(errors.length > 0){
        throw new Error(errors.join(", "))
    }

    const capitalize = (s) => s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()

    return{
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        email: email.toLowerCase(),
        interest
    }
}

function genID(){
    return(Date.now().toString(36) + Math.random().toString(36).slice(2, 8).toUpperCase())
}

export async function addInfo(input){
    const cleanData = dataValidation(input)

    const newData = {
        id: genID(),
        ...cleanData,
        fullName: `${cleanData.firstName} ${cleanData.lastName}`,
        createdAt: new Date().toISOString()
    }
    
    const info = await listInfo()
    info.push(newData)
    await fs.writeFile(file, JSON.stringify(info, null, 2), 'utf8')
    return newData
}