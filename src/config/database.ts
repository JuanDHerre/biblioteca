import { MongoClient, Db } from "mongodb";
import { env } from "./env";
import dns from "dns";

let client: MongoClient;
let db: Db;

export const connectDB = async (): Promise<void> => {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  client = new MongoClient(env.mongoUri);
  await client.connect();
  db = client.db(env.mongoDBName);
  console.log(`Conectado a MongoDB (db: ${env.mongoDBName})`);
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("La base de datos no ha sido inicializada");
  }
  return db;
};
