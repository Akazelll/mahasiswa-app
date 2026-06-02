export {};

declare global {
  interface Mahasiswa {
    id?: number;
    nim: string;
    nama: string;
    jurusan: string;
    angkatan: number;
    ipk: number;
  }

  interface Dosen {
    id?: number;
    nidn: string;
    nama: string;
    prodi: string;
  }

  interface Window {
    api: {
      mahasiswa: {
        getAll: () => Promise<Mahasiswa[]>;
        search: (keyword: string) => Promise<Mahasiswa[]>;
        insert: (data: Omit<Mahasiswa, "id">) => Promise<Mahasiswa>;
        update: (
          id: number,
          data: Partial<Mahasiswa>,
        ) => Promise<Mahasiswa | undefined>;
        delete: (id: number) => Promise<boolean>;
      };

      dosen: {
        getAll: () => Promise<Dosen[]>;
        search: (keyword: string) => Promise<Dosen[]>;
        insert: (data: Omit<Dosen, "id">) => Promise<Dosen>;
        update: (
          id: number,
          data: Partial<Dosen>,
        ) => Promise<Dosen | undefined>;
        delete: (id: number) => Promise<boolean>;
      };
    };
  }
}
