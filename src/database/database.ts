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
  pimid: string,
  active: boolean
) {
  // vi hjar ju skapat en koklumn i Products spom heter description2
  // också en som heter color2
  const conn = await connection;
  await conn.execute(
    'INSERT INTO Category(description,name,pimId,active) VALUES(?,?,?,?)',
    [description, title, pimid, active]
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
    [description, title, active, id]
  );
}
