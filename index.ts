import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import moment from 'moment';
import socketIO from 'socket.io';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SocketClass } from './classes/socket.class';
import mongoose from 'mongoose';
import Turno from './models/turno.model';

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno
const PORT = parseInt(process.env.PORT || '3003', 10);
const ENV = process.env.ENV || 'DEV';
const MONGO_URI = process.env.MONGO_URI || '';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || []; // ej., "https://frontend.com,https://another.com" en .env

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
    this.configureDB();
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
    // Aquí puedes agregar tus rutas
    this.app.get('/getTurnos', (req: Request, res: Response) => {
      Turno.find({estado:{$ne:'Cancelado'}}).then((turnos) => {
        res.json({ ok: true, turnos });
      }).catch((err) => {
        console.error(err);
        res.json({ ok: false, error: 'Error al obtener los turnos' });
      });
    });

    
    this.app.post('/createTurno', (req: Request, res: Response) => {
      try {
        let inicioDia = moment().startOf('day').toDate();
        let finDia = moment().endOf('day').toDate();
        let numeroTurno:string = '1';
        Turno.find({createdAt:{$gt:inicioDia, $lt: finDia}}).sort({createdAt:1}).then((turnos) => {
          if (turnos.length > 0) {
            
            const ultimoTurno = turnos[turnos.length - 1];
            const nuevoNumeroTurno = parseInt(ultimoTurno.numeroTurno) + 1;
            numeroTurno = nuevoNumeroTurno.toString();
          } 

          Turno.create({
            numeroTurno,
            motivo: req.body.motivo,
            prioridad: req.body.prioridad,
            horaRegistro: new Date(),
            consultorio: req.body.consultorio,
            medico: req.body.medico,
            paciente: req.body.paciente
          }).then((turno) => {
            SocketClass.updateFilaVirtual(this.io);
            res.json({ ok: true, turno });
          }).catch((err) => {
            console.error(err);
            res.json({ ok: false, error: 'Error al crear el turno' });
          });
        });
      } catch (error) {
        console.error(error);        
      }
    });
    
    this.app.post('/deleteTurno', (req: Request, res: Response) => {
      try {
        Turno.findOneAndUpdate({_id:req.body.id}, {$set:{estado:'Cancelado'}}, {new:true}).then((turno) => {
          if (turno) {
            res.json({ ok: true, turno});
            SocketClass.updateFilaVirtual(this.io);
          } else {
            res.json({ ok: false, error: 'Error al actualizar turno' });
          }
        }).catch((err) => {
          console.error(err);
          res.json({ ok: false, error: 'Error al actualizar turno' });
        });
        
      } catch (error) {
          console.error(error);
          res.json({ ok: false, error: 'Error al actualizar turno' });
      }
    });

    this.app.post('/updateTurno', (req: Request, res: Response) => {
      try {
        let estado:string;
        switch (req.body.estado) {
          case 'espera':
            estado = 'En espera'
            break;
          case 'atencion':
            estado = 'En atención'
            
            break;
          case 'finalizado':
            estado = 'Finalizado'
            
            break;
          default:
            estado = 'En espera'
            break;
        }
        Turno.findOneAndUpdate({_id:req.body.id}, {$set:{estado:estado}}, {new:true}).then((turno) => {
          if (turno) {
            res.json({ ok: true, turno});
            SocketClass.updateFilaVirtual(this.io);
          } else {
            res.json({ ok: false, error: 'Error al actualizar turno' });
          }
        }).catch((err) => {
          console.error(err);
          res.json({ ok: false, error: 'Error al actualizar turno' });
        });
        
      } catch (error) {
          console.error(error);
          res.json({ ok: false, error: 'Error al actualizar turno' });
      }
    });
  }

  private configureDB() {
    // Aquí puedes configurar tu conexión a la base de datos, por ejemplo, MongoDB
    mongoose.connect(MONGO_URI)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.error('MongoDB connection error:', err));    
  }

  private configureErrorHandling() {
    // Manejo de errores
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send('Error en el sistema');
    });

    this.io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  }

  public start() {
    // Iniciar el servidor
    this.httpServer.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
    this.httpServer.setTimeout(20 * 60 * 1000); // 20 minutes
  }
}

const server = new Server();
server.start();