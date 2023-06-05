// Importing modules. 
// Express is a minimalist web framework for Node.js, bodyParser helps in parsing the incoming request bodies,
// mongoose is a MongoDB object modeling tool, cors allows for cross-origin resource sharing,
// dotenv loads environment variables from a .env file into process.env, 
// multer is middleware for handling multipart/form-data (used for file uploading), 
// helmet helps secure Express apps with various HTTP headers,
// morgan is a HTTP request logger middleware, and path is a Node.js module for working with file and directory paths.
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import {fileURLToPath} from 'url'

// Getting the directory name of the current module. 
// In Node.js, __dirname and __filename are usually available, 
// but when working with ES modules, these need to be derived from import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Loading environment variables from .env file
dotenv.config()

// Creating an instance of an Express app
const app = express()

// Middleware setup
app.use(express.json()) // Built-in middleware for parsing incoming JSON payloads
app.use(helmet()) // Sets various HTTP headers to make the app more secure
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'})) // Sets the Cross-Origin-Resource-Policy HTTP header to mitigate cross-origin information leakage risks
app.use(morgan('common')) // Logging middleware for incoming requests
app.use(bodyParser.json({limit: '30mb', extended: true})) // Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.urlencoded({limit: '30mb', extended: true})) // This is to parse URL-encoded data
app.use(cors()) // Enable CORS

// Serving static files
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// Configuring multer to store uploaded files in the 'public/assets' directory and retain their original names
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/assets')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

// Creating an instance of multer with the defined storage option. 
// This instance can be used as middleware in routes where you want to handle file uploads
const upload = multer({storage})

// Configuring Mongoose to connect to the MongoDB database, then starting the Express server
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)) // Server starts listening after successful DB connection
}).catch((err) => console.log(`${err} did not connect`)) // Logs the error if DB connection was not successful
