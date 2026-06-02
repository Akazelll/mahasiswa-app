export {};

declare global {
  interface Mahasiswa {
    id?: number;
    nim: string;
    nama: string;
    jurusan: string;
    angkatan: number;
  }

  interface Window {
    api: {
      getAll: () => Promise<Mahasiswa[]>;
      insert: (data: Omit<Mahasiswa, "id">) => Promise<Mahasiswa>;
      update: (
        id: number,
        data: Partial<Mahasiswa>,
      ) => Promise<Mahasiswa | undefined>;
      delete: (id: number) => Promise<boolean>;
    };
  }
}
