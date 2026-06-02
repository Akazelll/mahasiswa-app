import { contextBridge, ipcRenderer } from "electron";
import type { Mahasiswa } from "../main/models/Mahasiswa";
import type { Dosen } from "../main/models/Dosen";

contextBridge.exposeInMainWorld("api", {
  mahasiswa: {
    getAll: (): Promise<Mahasiswa[]> => {
      return ipcRenderer.invoke("mahasiswa:getAll");
    },

    search: (keyword: string): Promise<Mahasiswa[]> => {
      return ipcRenderer.invoke("mahasiswa:search", keyword);
    },

    insert: (data: Omit<Mahasiswa, "id">): Promise<Mahasiswa> => {
      return ipcRenderer.invoke("mahasiswa:insert", data);
    },

    update: (
      id: number,
      data: Partial<Mahasiswa>,
    ): Promise<Mahasiswa | undefined> => {
      return ipcRenderer.invoke("mahasiswa:update", id, data);
    },

    delete: (id: number): Promise<boolean> => {
      return ipcRenderer.invoke("mahasiswa:delete", id);
    },
  },

  dosen: {
    getAll: (): Promise<Dosen[]> => {
      return ipcRenderer.invoke("dosen:getAll");
    },

    search: (keyword: string): Promise<Dosen[]> => {
      return ipcRenderer.invoke("dosen:search", keyword);
    },

    insert: (data: Omit<Dosen, "id">): Promise<Dosen> => {
      return ipcRenderer.invoke("dosen:insert", data);
    },

    update: (id: number, data: Partial<Dosen>): Promise<Dosen | undefined> => {
      return ipcRenderer.invoke("dosen:update", id, data);
    },

    delete: (id: number): Promise<boolean> => {
      return ipcRenderer.invoke("dosen:delete", id);
    },
  },
});
