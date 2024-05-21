import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from ".././entity/User";
import { FavouritePlace } from ".././entity/FavouritePlace";
import mysql from "mysql2/promise";

async function createDataBase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS explore_nearby");
  await connection.end();
}

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123",
  database: "explore_nearby",
  entities: [User, FavouritePlace],
  synchronize: true,
  logging: false,
});

async function main() {
  try {
    await createDataBase();
    await AppDataSource.initialize();

    console.log("Data Source has been initialized");

    const user = new User();
    user.username = "Albert";
    user.password = "albert";
    await AppDataSource.manager.save(user);
    console.log("Saved a new user id = ", user.id);

    const users = await AppDataSource.manager.find(User);
    console.log("Found users: ", users);
  } catch (error) {
    console.error("Error during Data Source initialized: ", error);
  } finally {
    AppDataSource.destroy();
  }
}

main();
