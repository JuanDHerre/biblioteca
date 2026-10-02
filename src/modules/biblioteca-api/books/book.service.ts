import { ObjectId } from "mongodb";
import { Book, BooksDTO } from "./book.model";
import { BookRepository } from "./book.repository";
import { BadRequestError, NotFoundError } from "../../../shared/errors/AppError";

export class BookService {

    private readonly bookRepository = new BookRepository();

    async create(data: BooksDTO): Promise<Book> {
        const name = this.requireString(data?.name, "name");
        const author = this.toObjectId(String(data?.author), "author");

        const now = new Date();
        return this.bookRepository.create({
            name,
            author,
            publicationDate: data.publicationDate,
            description: data.description,
            isDone: typeof data.isDone === "boolean" ? data.isDone : false,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async findById(id: string): Promise<Book> {
        const book = await this.bookRepository.findById(this.toObjectId(id));
        if (!book) {
            throw new NotFoundError("Libro no encontrado");
        }
        return book;
    }

    async update(id: string, data: BooksDTO): Promise<Book> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Book> = {};

        if (data.name !== undefined) changes.name = this.requireString(data.name, "name");
        if (data.author !== undefined) changes.author = this.toObjectId(String(data.author), "author");
        if (data.publicationDate !== undefined) changes.publicationDate = data.publicationDate;
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

        const updated = await this.bookRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Libro no encontrado");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.bookRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Libro no encontrado");
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
