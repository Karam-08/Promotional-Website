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

// This checks for the correct email and password
export async function authenticateUser(email, password){
    const users = await readUsers() // Reads users from users.json
    const user = users.find(u => u.email === email.toLowerCase() && u.password === password) // Gets the user email and password from users.json

    if(!user){ // If the email/password is invalid,
        throw new Error('Invalid email or password.') // throw error
    }

    return {id: user.id, email: user.email, role: user.role} // return the
}
