import { RowDataPacket } from 'mysql2';
import { connection } from './connection';

export interface ProductId extends RowDataPacket {
  id: number;
}

export interface CategoryId extends RowDataPacket {
  id: number;
}

export async function getCategoryIdFromDatabase(
  pimid: string
): Promise<CategoryId | undefined> {
  const conn = await connection;

  const [rows] = await conn.query<CategoryId[]>(
    'SELECT id from category where pimid=?',
    [pimid]
  );
  if (rows.length == 0) {
    return undefined;
  }
  return rows[0];
}
