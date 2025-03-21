import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes.js';
import contactRoutes from './routes/contact.routes.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/', userRoutes);
app.use('/', contactRoutes);
app.get("/", (req, res) => {    
    res.json({message: "Welcome to the Brian's MERN Skeleton"});
  });
export default app;