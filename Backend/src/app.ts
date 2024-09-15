import express from 'express';
import cors from 'cors';
import http from 'http';

import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import MessageRouter from './routes/message';
import NotificationRouter from './routes/notification';
import initializeWebSocket from './callWebsocket';
import bodyParser from 'body-parser';

const app = express();
const port = 4001;
const server = http.createServer(app);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

initializeWebSocket(server);

app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/message', MessageRouter);
app.use('/notification', NotificationRouter);

app.get('/', (req, res) => {
  console.log('Hello from the server');
  res.send('Hello from the server');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
