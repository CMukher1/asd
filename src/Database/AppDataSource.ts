/**
 * Creates and exports a TypeORM DataSource instance to connect to the database.
 * Uses the database configuration from the environment-specific Config module.
 * Configures MySQL database connection options and entity class locations.
 */
import { DataSource } from "typeorm";
import path from "path";
import config from "@/libs/Config";
const dbConfig = config[`${process.env.enviorment}`];

const AppDataSource: DataSource = new DataSource({
  type: "mysql",
  host: dbConfig.host,
  port: parseInt(dbConfig.port),
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: true,
  logging: true,
  entities: [path.join(__dirname, "../") + "**/*.entitie.{ts,js}"],
});

export default AppDataSource;
