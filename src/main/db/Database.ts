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
        angkatan INTEGER NOT NULL,
        ipk REAL NOT NULL DEFAULT 0
      )
    `);

    const mahasiswaColumns = db
      .prepare(`PRAGMA table_info(mahasiswa)`)
      .all() as Array<{ name: string }>;

    const hasIpkColumn = mahasiswaColumns.some(
      (column) => column.name === "ipk",
    );

    if (!hasIpkColumn) {
      db.exec(`ALTER TABLE mahasiswa ADD COLUMN ipk REAL NOT NULL DEFAULT 0`);
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS dosen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nidn TEXT NOT NULL UNIQUE,
        nama TEXT NOT NULL,
        prodi TEXT NOT NULL
      )
    `);
  }
}
