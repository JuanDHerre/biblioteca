import { ObjectId } from "mongodb";
import { Loan, LoansDTO } from "./loan.model";
import { LoanRepository } from "./loan.repository";
import { BadRequestError, NotFoundError } from "../../../shared/errors/AppError";

export class LoanService {

    private readonly loanRepository = new LoanRepository();

    async create(data: LoansDTO): Promise<Loan> {
        const name = this.requireString(data?.name, "name");
        const bookId = this.toObjectId(String(data?.bookId), "bookId");

        const now = new Date();
        return this.loanRepository.create({
            name,
            bookId,
            loanDate: data.loanDate,
            returnDate: data.returnDate,
            returned: typeof data.returned === "boolean" ? data.returned : false,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Loan[]> {
        return this.loanRepository.findAll();
    }

    async findById(id: string): Promise<Loan> {
        const loan = await this.loanRepository.findById(this.toObjectId(id));
        if (!loan) {
            throw new NotFoundError("Préstamo no encontrado");
        }
        return loan;
    }

    async update(id: string, data: LoansDTO): Promise<Loan> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Loan> = {};

        if (data.name !== undefined) changes.name = this.requireString(data.name, "name");
        if (data.bookId !== undefined) changes.bookId = this.toObjectId(String(data.bookId), "bookId");
        if (data.loanDate !== undefined) changes.loanDate = data.loanDate;
        if (data.returnDate !== undefined) changes.returnDate = data.returnDate;
        if (data.returned !== undefined) {
            if (typeof data.returned !== "boolean") {
                throw new BadRequestError("El campo 'returned' debe ser booleano");
            }
            changes.returned = data.returned;
        }

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.loanRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Préstamo no encontrado");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.loanRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Préstamo no encontrado");
        }
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== "string" || value.trim() === "") {
            throw new BadRequestError(`El campo '${field}' es obligatorio y debe ser un texto no vacío`);
        }
        return value.trim();
    }

    private toObjectId(id: string, field: string = "id"): ObjectId {
        if (typeof id !== "string" || !ObjectId.isValid(id)) {
            throw new BadRequestError(`Identificador inválido: ${field}`);
        }
        return new ObjectId(id);
    }
}
