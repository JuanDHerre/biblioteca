import { ObjectId } from "mongodb";
import { Author, AuthorsDTO } from "./author.model";
import { AuthorRepository } from "./author.repository";
import { BadRequestError, NotFoundError } from "../../../shared/errors/AppError";

export class AuthorService {

    private readonly authorRepository = new AuthorRepository();

    async create(data: AuthorsDTO): Promise<Author> {
        const name = this.requireString(data?.name, "name");
        const nationality = this.requireString(data?.nationality, "nationality");

        const now = new Date();
        return this.authorRepository.create({
            name,
            nationality,
            birthYear: data.birthYear,
            description: data.description,
            isDone: typeof data.isDone === "boolean" ? data.isDone : false,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Author[]> {
        return this.authorRepository.findAll();
    }

    async findById(id: string): Promise<Author> {
        const author = await this.authorRepository.findById(this.toObjectId(id));
        if (!author) {
            throw new NotFoundError("Autor no encontrado");
        }
        return author;
    }

    async update(id: string, data: AuthorsDTO): Promise<Author> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Author> = {};

        if (data.name !== undefined) changes.name = this.requireString(data.name, "name");
        if (data.nationality !== undefined) changes.nationality = this.requireString(data.nationality, "nationality");
        if (data.birthYear !== undefined) changes.birthYear = data.birthYear;
        if (data.description !== undefined) changes.description = this.requireString(data.description, "description");
        if (data.isDone !== undefined) {
            if (typeof data.isDone !== "boolean") {
                throw new BadRequestError("El campo 'isDone' debe ser booleano");
            }
            changes.isDone = data.isDone;
        }

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.authorRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Autor no encontrado");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.authorRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Autor no encontrado");
        }
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== "string" || value.trim() === "") {
            throw new BadRequestError(`El campo '${field}' es obligatorio y debe ser un texto no vacío`);
        }
        return value.trim();
    }

    private toObjectId(id: string): ObjectId {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError(`Identificador inválido: ${id}`);
        }
        return new ObjectId(id);
    }
}
