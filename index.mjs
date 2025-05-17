import express from 'express'
import connectDB from './src/config/db.mjs';
import routes from './src/routes/index.mjs'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { gridFSReady } from './src/config/fileStream.mjs';
import swaggerSpec from './src/config/swagger.mjs';
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

async function startServer(){

  try {
    
    await gridFSReady
    app.use(cors())
    app.use(express.json());
    app.use(cookieParser())
    app.use('/', routes)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    connectDB();
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection:', reason);
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1); // Exit safely
    });   
    app.get('/', (req, res) => {
      res.send('api is running .....')
    }); 
    // Start the server only after DB is ready
    app.listen(PORT, () =>{console.log(`server is running on port: ${PORT}`)})
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
  }
startServer()

