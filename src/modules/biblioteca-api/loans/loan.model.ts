import { ObjectId } from "mongodb";

export interface Loan {
    _id?: ObjectId;
    name: string;
    bookId: ObjectId;
    loanDate: number;
    returnDate?: number;
    returned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre una tarea.
 * Todos los campos son opcionales; el servicio valida qué es
 * obligatorio según la operación (crear vs. actualizar).
 */
export interface LoansDTO {
    name: string;
    bookId: ObjectId;
    loanDate: number;
    returnDate?: number;
    returned: boolean;
}
