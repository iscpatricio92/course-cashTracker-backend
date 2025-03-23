import { exit } from 'node:process'
import { db } from "../config/db"

const clearData = async() => {
    try{
        await db.sync({force: true})
        console.log('Data cleared successfully')
        exit(0)
    }
    catch(error){
        console.log(`Error: ${error.message}`)
        exit(1)
    }
}

if(process.argv[2] === '--clear'){
    clearData()
}
