import { ObjectId } from "mongodb";
import { Categories, CategoriesDTO } from "./categories.model";
import { CategoriesRepository } from "./categories.repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";

export class CategoriesService {

    private readonly categoriesRepository = new CategoriesRepository();

    async create(data: CategoriesDTO): Promise<Categories> {
        const title = this.requireString(data?.title, "title");
        const description = this.requireString(data?.description, "description");

        const now = new Date();
        return this.categoriesRepository.create({
            title,
            description,
            isDone: typeof data.isDone === "boolean" ? data.isDone : false,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Categories[]> {
        return this.categoriesRepository.findAll();
    }

    async findById(id: string): Promise<Categories> {
        const category = await this.categoriesRepository.findById(this.toObjectId(id));
        if (!category) {
            throw new NotFoundError("Categoría no encontrada");
        }
        return category;
    }

    async update(id: string, data: Categories): Promise<Categories> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Categories> = {};

        if (data.title !== undefined) changes.title = this.requireString(data.title, "title");
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

        const updated = await this.categoriesRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Categoría no encontrada");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.categoriesRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Categoría no encontrada");
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
