import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const folder = path.join(__dirname, '..', 'data')
const file = path.join(folder, 'users.json')

export async function ensureUsersFile(){
    try{
        await fs.mkdir(folder, { recursive: true })
        await fs.access(file)
    }catch{
        await fs.writeFile(file, '[]', 'utf8')
    }
}

async function readUsers(){
    const raw = await fs.readFile(file, 'utf8')
    return JSON.parse(raw || '[]')
}

export async function authenticateUser(email, password){
    const users = await readUsers() // Gets all of the users
    const user = users.find(u => u.email === email.toLowerCase() && u.password === password) // Gets the user credentials from users.json

    if(!user){ // If the email/password isn't found,
        throw new Error('Invalid email or password.') // throw error
    }

    return{id: user.id, email: user.email, role: user.role} // Returns the safe info
}