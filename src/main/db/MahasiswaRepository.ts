import { Repository } from "./Repository";
import { Mahasiswa } from "../models/Mahasiswa";
import { Database as DB } from "better-sqlite3";

export class MahasiswaRepository extends Repository<Mahasiswa> {
  constructor(db: DB) {
    super(db, "mahasiswa");
  }

  insert(data: Omit<Mahasiswa, "id">): Mahasiswa {
    const existing = this.findByNim(data.nim);

    if (existing) {
      throw new Error("NIM sudah terdaftar.");
    }

    const stmt = this.db.prepare(`
      INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, ipk)
      VALUES (@nim, @nama, @jurusan, @angkatan, @ipk)
    `);

    const result = stmt.run(data);

    return {
      id: Number(result.lastInsertRowid),
      ...data,
    };
  }

  update(id: number, data: Partial<Mahasiswa>): Mahasiswa | undefined {
    const existing = this.findById(id);

    if (!existing) {
      return undefined;
    }

    if (data.nim) {
      const mahasiswaWithSameNim = this.findByNim(data.nim);

      if (mahasiswaWithSameNim && mahasiswaWithSameNim.id !== id) {
        throw new Error("NIM sudah digunakan oleh mahasiswa lain.");
      }
    }

    const updated = {
      ...existing,
      ...data,
    };

    this.db
      .prepare(
        `
      UPDATE mahasiswa
      SET nim = @nim,
          nama = @nama,
          jurusan = @jurusan,
          angkatan = @angkatan,
          ipk = @ipk
      WHERE id = @id
    `,
      )
      .run(updated);

    return updated;
  }

  findByNim(nim: string): Mahasiswa | undefined {
    return this.db.prepare(`SELECT * FROM mahasiswa WHERE nim = ?`).get(nim) as
      | Mahasiswa
      | undefined;
  }

  findByJurusan(jurusan: string): Mahasiswa[] {
    return this.db
      .prepare(`SELECT * FROM mahasiswa WHERE jurusan = ?`)
      .all(jurusan) as Mahasiswa[];
  }

  search(keyword: string): Mahasiswa[] {
    const searchKeyword = `%${keyword}%`;

    return this.db
      .prepare(
        `
        SELECT * FROM mahasiswa
        WHERE nim LIKE @keyword
           OR nama LIKE @keyword
        ORDER BY id DESC
      `,
      )
      .all({ keyword: searchKeyword }) as Mahasiswa[];
  }
}
