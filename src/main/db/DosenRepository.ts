import { Repository } from "./Repository";
import { Dosen } from "../models/Dosen";
import { Database as DB } from "better-sqlite3";

export class DosenRepository extends Repository<Dosen> {
  constructor(db: DB) {
    super(db, "dosen");
  }

  insert(data: Omit<Dosen, "id">): Dosen {
    const existing = this.findByNidn(data.nidn);

    if (existing) {
      throw new Error("NIDN sudah terdaftar.");
    }

    const stmt = this.db.prepare(`
      INSERT INTO dosen (nidn, nama, prodi)
      VALUES (@nidn, @nama, @prodi)
    `);

    const result = stmt.run(data);

    return {
      id: Number(result.lastInsertRowid),
      ...data,
    };
  }

  update(id: number, data: Partial<Dosen>): Dosen | undefined {
    const existing = this.findById(id);

    if (!existing) {
      return undefined;
    }

    if (data.nidn) {
      const dosenWithSameNidn = this.findByNidn(data.nidn);

      if (dosenWithSameNidn && dosenWithSameNidn.id !== id) {
        throw new Error("NIDN sudah digunakan oleh dosen lain.");
      }
    }

    const updated = {
      ...existing,
      ...data,
    };

    this.db
      .prepare(
        `
      UPDATE dosen
      SET nidn = @nidn,
          nama = @nama,
          prodi = @prodi
      WHERE id = @id
    `,
      )
      .run(updated);

    return updated;
  }

  findByNidn(nidn: string): Dosen | undefined {
    return this.db.prepare(`SELECT * FROM dosen WHERE nidn = ?`).get(nidn) as
      | Dosen
      | undefined;
  }

  search(keyword: string): Dosen[] {
    const searchKeyword = `%${keyword}%`;

    return this.db
      .prepare(
        `
        SELECT * FROM dosen
        WHERE nidn LIKE @keyword
           OR nama LIKE @keyword
        ORDER BY id DESC
      `,
      )
      .all({ keyword: searchKeyword }) as Dosen[];
  }
}
