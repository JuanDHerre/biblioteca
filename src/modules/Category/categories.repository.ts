import { getDb } from "../../config/database";
import { Categories } from "./categories.model";
import { Collection, ObjectId } from "mongodb";

export class CategoriesRepository {

    private collection(): Collection<Categories> {
        return getDb().collection<Categories>("categories");
    }

    async create(data: Omit<Categories, "_id">): Promise<Categories> {
        const result = await this.collection().insertOne(data as Categories);
        return { _id: result.insertedId, ...data };
    }

    async findAll(): Promise<Categories[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<Categories | null> {
        return this.collection().findOne({ _id: id });
    }

    async update(id: ObjectId, changes: Partial<Categories>): Promise<Categories | null> {
        const result = await this.collection().findOneAndUpdate(
            { _id: id },
            { $set: changes },
            { returnDocument: "after" }
        );
        return result ?? null;
    }

    async delete(id: ObjectId): Promise<boolean> {
        const result = await this.collection().deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
