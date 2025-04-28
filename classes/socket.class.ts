import { DefaultEventsMap, Server } from "socket.io";

export const SocketClass = new (class SocketClass {    constructor() {}

    public escucharSocket(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        io.on("connection", (socket: {
            emit(arg0: string, arg1: string): unknown; id: any; on: (arg0: string, arg1: () => void) => void; 
        }) => {
            // console.log("Usuario conectado:", socket.id);
            

            socket.on("primeraConexion", (payload=null) => {
                // console.log("Primera conexión:", payload);
                socket.emit('actualizacionFila', {} as any);
            });

            socket.on("disconnect", () => {
                // console.log("A user disconnected:", socket.id);
            });
        });
    }
})();