import { RowDataPacket } from 'mysql2';
import { connection } from './connection';

export interface ProductId extends RowDataPacket {
  id: number;
}

export interface CategoryId extends RowDataPacket {
  id: number;
}

export async function getCategoryIdFromDatabase(
  pimId: string
): Promise<CategoryId | undefined> {
  const conn = await connection;

  const [rows] = await conn.query<CategoryId[]>(
    'SELECT id from Category where pimId=?',
    [pimId]
  );
  if (rows.length == 0) {
    return undefined;
  }
  return rows[0];
}

// sätt in kategori i databas:
export async function insertCategory(
  title: string,
  description: string,
  pimId: string,
  active: boolean
) {
  // vi hjar ju skapat en koklumn i Products spom heter description2
  // också en som heter color2
  const conn = await connection;
  await conn.execute(
    'INSERT INTO Category(description,name,pimId,active) VALUES(?,?,?,?)',
    [description, title, pimId, active]
  );
}

// uppdatera kategori i databas:
export async function updateCategory(
  id: number,
  title: string,
  description: string,
  active: boolean
) {
  // vi hjar ju skapat en koklumn i Products spom heter description2
  // också en som heter color2
  const conn = await connection;
  await conn.execute(
    'UPDATE Category SET description=?, name=?, active=? WHERE id=?',
    [description ?? null, title, active ?? null, id]
  );
}

export async function getProductIdFromDatabase(
  pimId: string
): Promise<ProductId | undefined> {
  const conn = await connection;

  const [rows] = await conn.query<ProductId[]>(
    'SELECT id from Products where pimId=?',
    [pimId]
  );
  if (rows.length == 0) {
    return undefined;
  }
  return rows[0];
}

export async function insertProduct(
  title: string,
  price: number,
  stockLevel: number,
  categoryId: string,
  popularityFactor: number,
  pimId: string,
  active: boolean,
  description: string
) {
  const conn = await connection;

  console.log('PF', popularityFactor);
  await conn.execute(
    'INSERT INTO Products(title, price, stockLevel, categoryId, popularityFactor, pimId, active, description) VALUES(?,?,?,?,?,?,?,?)',
    [
      title,
      price,
      stockLevel,
      categoryId,
      popularityFactor,
      pimId,
      active,
      description,
    ]
  );
}

export async function updateProduct(
  title: string,
  price: number,
  stockLevel: number,
  categoryId: string,
  popularityFactor: number,
  id: number,
  active: boolean,
  description: string
) {
  const conn = await connection;
  await conn.execute(
    'UPDATE Products SET title=?, price=?, stockLevel=?, categoryId=?, popularityFactor=?, id=?, active=?, description=?',
    [
      title,
      price,
      stockLevel,
      categoryId,
      popularityFactor,
      id,
      active,
      description,
    ]
  );
}
