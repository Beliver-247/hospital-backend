import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import api from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Simple health route mounted under /api
app.use('/api', api);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
