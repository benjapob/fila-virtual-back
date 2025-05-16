import Turno from "../models/turno.model";
import moment from 'moment';
import { DefaultEventsMap, Server } from "socket.io";

export const SocketClass = new (class SocketClass {    constructor() {}

    public escucharSocket(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        io.on("connection", (socket: {
            emit(arg0: string, arg1: string): unknown; id: any; on: (arg0: string, arg1: () => void) => void; 
        }) => {
            // console.log("Usuario conectado:", socket.id);
            

            socket.on("primeraConexion", async (payload=null) => {
                // console.log("Primera conexión:", payload);
                let inicioDia = moment().startOf('day').toDate();
                let finDia = moment().endOf('day').toDate();
                let pendientesArray:any = await Turno.find({estado:'En espera', createdAt:{$gt:inicioDia, $lt: finDia}});
                socket.emit('actualizacionFila', {
                    pendientesArray,
                    enProcesoArray:[
                        {
                          "id": "P001",
                          "nombre": "Juan Pérez",
                          "rut": "12345678-9",
                          "numeroTurno": "A007",
                          "motivo": "Consulta general",
                          "prioridad": "Media",
                          "horaRegistro": "2025-04-28T08:00:00",
                          "estado": "En espera",
                          "consultorio": "Consultorio 1",
                          "medico": "Dr. García",
                          "tiempoEsperaEstimado": "30 minutos",
                          "posicionFila": 1
                        },
                        {
                          "id": "P002",
                          "nombre": "María López",
                          "rut": "98765432-1",
                          "numeroTurno": "A006",
                          "motivo": "Control crónico",
                          "prioridad": "Alta",
                          "horaRegistro": "2025-04-28T08:05:00",
                          "estado": "En espera",
                          "consultorio": "Consultorio 2",
                          "medico": "Dra. Fernández",
                          "tiempoEsperaEstimado": "15 minutos",
                          "posicionFila": 2
                        },
                        {
                          "id": "P003",
                          "nombre": "Carlos Gómez",
                          "rut": "45678912-3",
                          "numeroTurno": "A009",
                          "motivo": "Urgencia",
                          "prioridad": "Alta",
                          "horaRegistro": "2025-04-28T08:10:00",
                          "estado": "Llamado",
                          "consultorio": "Consultorio 1",
                          "medico": "Dr. García",
                          "tiempoEsperaEstimado": "0 minutos",
                          "posicionFila": 0
                        }
                      ]
                } as any);
            });

            socket.on("disconnect", () => {
                // console.log("A user disconnected:", socket.id);
            });
        });
    }
});