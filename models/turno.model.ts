import { Schema, model, Types } from 'mongoose';

// Define el schema para el modelo Turno
const TurnoSchema = new Schema({
    numeroTurno: {
        type: String,
        required: true,
    },
    motivo: {
        type: String,
        required: true,
    },
    prioridad: {
        type: String,
        enum: ['Alta', 'Media', 'Baja'],
        required: true,
    },
    horaRegistro: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        enum: ['En espera', 'En atención', 'Finalizado', 'Cancelado'],
        required: true,
        default: 'En espera'
    },
    consultorio: {
        type: String,
        required: true,
    },
    medico: {
        type: String,
        required: true,
    },
    paciente: {
        type: String,
        required: true,
    },
});

// Agrega timestamps para createdAt y updatedAt
TurnoSchema.set('timestamps', true);    

const Turno = model('Turno', TurnoSchema);

export default Turno;