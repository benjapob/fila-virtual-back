import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import socketIO from 'socket.io';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SocketClass } from './classes/socket.class';

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno
const PORT = parseInt(process.env.PORT || '3003', 10);
const ENV = process.env.ENV || 'DEV';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || []; // e.g., "https://frontend.com,https://another.com" in .env

class Server {
  public app: express.Application;
  private httpServer: http.Server;
  public io: socketIO.Server;
  private port: number;

  constructor() {
    this.app = express();
    this.port = PORT;
    this.httpServer = new http.Server(this.app);
    this.io = require('socket.io')(this.httpServer, {
      cors: {
        origin: ENV === 'DEV' ? '*' : ALLOWED_ORIGINS,
        credentials: true,
      },
    });
    SocketClass.escucharSocket(this.io); //Inicializar el socket

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware() {
    // Headers de seguridad
    this.app.use(helmet());

    // Limitación de peticiones
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
      })
    );

    // CORS
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (ENV === 'DEV') {
            callback(null, true);
          } else if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, origin);
          } else {
            callback(new Error('CORS blocked'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'app-token', 'x-token', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Cache-Control', 'Connection'],
        credentials: true,
      })
    );

    // JSON parsing
    this.app.use(express.json());
  }

  private configureRoutes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });
  }

  /* private configureSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('Socket conectado:', socket.id);
      socket.on('disconnect', () => {
        console.log('Socket desconectado:', socket.id);
      });
    });
  } */

  private configureErrorHandling() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send('Error en el sistema');
    });

    this.io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
    this.httpServer.setTimeout(20 * 60 * 1000); // 20 minutes
  }
}

// Start the server
const server = new Server();
server.start();