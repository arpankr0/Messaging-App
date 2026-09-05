import  express from 'express';
import dotenv from 'dotenv';
// import dns from 'dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']);   
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
 
 const PORT = process.env.PORT || 3000;
  app.use(express.json());
  app.use(cookieParser());
  
 app.use('/api/auth', authRoute);
 app.use('/api/messages', messageRoute);
app.listen(PORT, () => {
    console.log('Server is running on port:' +PORT);
    connectDB();  
});
