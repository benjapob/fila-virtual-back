import Turno from "../models/turno.model";
import moment from 'moment';
import { DefaultEventsMap, Server } from "socket.io";

export const SocketClass = new (class SocketClass {    constructor() {}

    public escucharSocket(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        io.on("connection", (socket: {
            emit(arg0: string, arg1: string): unknown; id: any; on: (arg0: string, arg1: () => void) => void; 
        }) => {
            // console.log("Usuario conectado:", socket.id);
            this.updateFilaVirtual(io);
        });
    }

    public async updateFilaVirtual(io:any) {
      let inicioDia = moment().startOf('day').toDate();
      let finDia = moment().endOf('day').toDate();
      let pendientesArray:any = await Turno.find({estado:'En espera', createdAt:{$gt:inicioDia, $lt: finDia}});
      let enProcesoArray:any = await Turno.find({estado:'En atención', createdAt:{$gt:inicioDia, $lt: finDia}});
      io.emit('actualizacionFila', {
          pendientesArray,
          enProcesoArray
      } as any);
    }
});