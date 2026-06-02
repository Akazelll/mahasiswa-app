import BetterSqlite3, { Database as DB } from "better-sqlite3";
import path from "path";
import { app } from "electron";

export class Database {
  private static instance: DB;

  static getInstance(): DB {
    if (!Database.instance) {
      const dbPath = path.join(app.getPath("userData"), "mahasiswa.db");

      Database.instance = new BetterSqlite3(dbPath);
      Database.instance.pragma("journal_mode = WAL");

      Database.migrate(Database.instance);
    }

    return Database.instance;
  }

  private static migrate(db: DB): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS mahasiswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nim TEXT NOT NULL UNIQUE,
        nama TEXT NOT NULL,
        jurusan TEXT NOT NULL,
        angkatan INTEGER NOT NULL
      )
    `);
  }
}
