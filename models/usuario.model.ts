import { Schema, model, Document } from 'mongoose';

const UserSchema = new Schema(
    {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        rut: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        telefono: { type: String, required: false },
        fechaNacimiento: { type: Date, required: true },
        genero: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true },
    },
    {
        timestamps: true, // Automaticamente agrega createdAt y updatedAt
    }
);

export const UserModel = model('User', UserSchema);