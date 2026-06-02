import { Database as DB } from "better-sqlite3";

export abstract class Repository<T> {
  protected db: DB;
  protected table: string;

  constructor(db: DB, table: string) {
    this.db = db;
    this.table = table;
  }

  findAll(): T[] {
    return this.db.prepare(`SELECT * FROM ${this.table}`).all() as T[];
  }

  findById(id: number): T | undefined {
    return this.db
      .prepare(`SELECT * FROM ${this.table} WHERE id = ?`)
      .get(id) as T | undefined;
  }

  delete(id: number): boolean {
    const result = this.db
      .prepare(`DELETE FROM ${this.table} WHERE id = ?`)
      .run(id);

    return result.changes > 0;
  }

  abstract insert(data: Omit<T, "id">): T;
  abstract update(id: number, data: Partial<T>): T | undefined;
}
