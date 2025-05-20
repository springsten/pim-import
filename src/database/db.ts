import { connection } from './connection';

export async function initDb() {
  try {
    // const conn = await connection;
    // const [rows] = await conn.execute(
    //   `CREATE DATABASE IF NOT EXISTS pimgrupp2`
    // );
    initProducts();
    initCategory();
  } catch (error) {
    console.error('Fel vid skapande av tabellen Products:', error);
  }
}

async function initProducts() {
  const conn = await connection;
  const [rows] = await conn.execute(
    `CREATE TABLE IF NOT EXISTS Products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(50),
                price INT,
                stockLevel INT,
                categoryId VARCHAR(255),
                popularityFactor INT DEFAULT 0,
                pimId VARCHAR(255),
                active TINYINT(1),
                description TEXT           
                )`
  );
}

async function initCategory() {
  const conn = await connection;
  const [rows] = await conn.execute(`CREATE TABLE IF NOT EXISTS Category (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pimId VARCHAR(255),
                name VARCHAR(50),
                description VARCHAR(255),
                active TINYINT(1))`);
}
