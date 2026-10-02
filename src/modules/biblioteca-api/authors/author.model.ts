import { ObjectId } from "mongodb";

export interface Author {
    _id?: ObjectId;
    name: string;
    nationality: string;
    birthYear?: number;
    description?: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre una tarea.
 * Todos los campos son opcionales; el servicio valida qué es
 * obligatorio según la operación (crear vs. actualizar).
 */
export interface AuthorsDTO {
    name: string;
    nationality: string;
    birthYear?: number;
    description?: string;
    isDone?: boolean;
}
