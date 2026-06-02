const mahasiswaApi = window.api.mahasiswa;
const dosenApi = window.api.dosen;

const mahasiswaForm = document.getElementById(
  "form-mahasiswa",
) as HTMLFormElement;
const mahasiswaTableBody = document.getElementById(
  "mahasiswa-table-body",
) as HTMLTableSectionElement;
const mahasiswaEditId = document.getElementById(
  "mahasiswa-edit-id",
) as HTMLInputElement;
const inputNim = document.getElementById("nim") as HTMLInputElement;
const inputMahasiswaNama = document.getElementById(
  "mahasiswa-nama",
) as HTMLInputElement;
const inputJurusan = document.getElementById("jurusan") as HTMLInputElement;
const inputAngkatan = document.getElementById("angkatan") as HTMLInputElement;
const inputIpk = document.getElementById("ipk") as HTMLInputElement;
const mahasiswaClearButton = document.getElementById(
  "mahasiswa-clear",
) as HTMLButtonElement;
const mahasiswaSearchInput = document.getElementById(
  "mahasiswa-search",
) as HTMLInputElement;
const mahasiswaSearchButton = document.getElementById(
  "mahasiswa-search-button",
) as HTMLButtonElement;
const mahasiswaResetSearchButton = document.getElementById(
  "mahasiswa-reset-search",
) as HTMLButtonElement;
const mahasiswaMessage = document.getElementById(
  "mahasiswa-message",
) as HTMLDivElement;

const dosenForm = document.getElementById("form-dosen") as HTMLFormElement;
const dosenTableBody = document.getElementById(
  "dosen-table-body",
) as HTMLTableSectionElement;
const dosenEditId = document.getElementById(
  "dosen-edit-id",
) as HTMLInputElement;
const inputNidn = document.getElementById("nidn") as HTMLInputElement;
const inputDosenNama = document.getElementById(
  "dosen-nama",
) as HTMLInputElement;
const inputProdi = document.getElementById("prodi") as HTMLInputElement;
const dosenClearButton = document.getElementById(
  "dosen-clear",
) as HTMLButtonElement;
const dosenSearchInput = document.getElementById(
  "dosen-search",
) as HTMLInputElement;
const dosenSearchButton = document.getElementById(
  "dosen-search-button",
) as HTMLButtonElement;
const dosenResetSearchButton = document.getElementById(
  "dosen-reset-search",
) as HTMLButtonElement;
const dosenMessage = document.getElementById("dosen-message") as HTMLDivElement;

function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showMessage(
  element: HTMLDivElement,
  type: "success" | "error",
  message: string,
): void {
  element.className = `message ${type}`;
  element.textContent = message;

  setTimeout(() => {
    element.className = "message";
    element.textContent = "";
  }, 3000);
}

async function loadMahasiswaTable(): Promise<void> {
  const data = await mahasiswaApi.getAll();
  renderMahasiswaTable(data);
}

function renderMahasiswaTable(data: Mahasiswa[]): void {
  mahasiswaTableBody.innerHTML = "";

  for (const mahasiswa of data) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(mahasiswa.nim)}</td>
      <td>${escapeHtml(mahasiswa.nama)}</td>
      <td>${escapeHtml(mahasiswa.jurusan)}</td>
      <td>${escapeHtml(mahasiswa.angkatan)}</td>
      <td>${escapeHtml(mahasiswa.ipk.toFixed(2))}</td>
      <td>
        <button class="btn-edit" type="button">Edit</button>
        <button class="btn-delete" type="button">Hapus</button>
      </td>
    `;

    const editButton = row.querySelector(".btn-edit") as HTMLButtonElement;
    const deleteButton = row.querySelector(".btn-delete") as HTMLButtonElement;

    editButton.addEventListener("click", () => {
      editMahasiswa(mahasiswa);
    });

    deleteButton.addEventListener("click", () => {
      deleteMahasiswa(mahasiswa.id);
    });

    mahasiswaTableBody.appendChild(row);
  }
}

mahasiswaForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nim: inputNim.value.trim(),
    nama: inputMahasiswaNama.value.trim(),
    jurusan: inputJurusan.value.trim(),
    angkatan: Number(inputAngkatan.value),
    ipk: Number(inputIpk.value),
  };

  if (!payload.nim || !payload.nama || !payload.jurusan) {
    showMessage(
      mahasiswaMessage,
      "error",
      "NIM, nama, dan jurusan wajib diisi.",
    );
    return;
  }

  if (!Number.isInteger(payload.angkatan) || payload.angkatan < 2000) {
    showMessage(
      mahasiswaMessage,
      "error",
      "Angkatan harus berupa angka tahun yang valid.",
    );
    return;
  }

  if (Number.isNaN(payload.ipk) || payload.ipk < 0 || payload.ipk > 4) {
    showMessage(
      mahasiswaMessage,
      "error",
      "IPK harus berada di antara 0.00 sampai 4.00.",
    );
    return;
  }

  try {
    if (mahasiswaEditId.value) {
      await mahasiswaApi.update(Number(mahasiswaEditId.value), payload);
      showMessage(
        mahasiswaMessage,
        "success",
        "Data mahasiswa berhasil diperbarui.",
      );
    } else {
      await mahasiswaApi.insert(payload);
      showMessage(
        mahasiswaMessage,
        "success",
        "Data mahasiswa berhasil ditambahkan.",
      );
    }

    resetMahasiswaForm();
    await loadMahasiswaTable();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan data mahasiswa.";
    showMessage(mahasiswaMessage, "error", message);
  }
});

function editMahasiswa(mahasiswa: Mahasiswa): void {
  if (!mahasiswa.id) {
    return;
  }

  mahasiswaEditId.value = String(mahasiswa.id);
  inputNim.value = mahasiswa.nim;
  inputMahasiswaNama.value = mahasiswa.nama;
  inputJurusan.value = mahasiswa.jurusan;
  inputAngkatan.value = String(mahasiswa.angkatan);
  inputIpk.value = String(mahasiswa.ipk);
}

async function deleteMahasiswa(id: number | undefined): Promise<void> {
  if (!id) {
    return;
  }

  if (confirm("Yakin hapus data mahasiswa ini?")) {
    try {
      await mahasiswaApi.delete(id);
      showMessage(
        mahasiswaMessage,
        "success",
        "Data mahasiswa berhasil dihapus.",
      );
      await loadMahasiswaTable();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menghapus data mahasiswa.";
      showMessage(mahasiswaMessage, "error", message);
    }
  }
}

function resetMahasiswaForm(): void {
  mahasiswaForm.reset();
  mahasiswaEditId.value = "";
}

mahasiswaClearButton.addEventListener("click", resetMahasiswaForm);

mahasiswaSearchButton.addEventListener("click", async () => {
  const keyword = mahasiswaSearchInput.value.trim();

  if (!keyword) {
    await loadMahasiswaTable();
    return;
  }

  const result = await mahasiswaApi.search(keyword);
  renderMahasiswaTable(result);
});

mahasiswaResetSearchButton.addEventListener("click", async () => {
  mahasiswaSearchInput.value = "";
  await loadMahasiswaTable();
});

async function loadDosenTable(): Promise<void> {
  const data = await dosenApi.getAll();
  renderDosenTable(data);
}

function renderDosenTable(data: Dosen[]): void {
  dosenTableBody.innerHTML = "";

  for (const dosen of data) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(dosen.nidn)}</td>
      <td>${escapeHtml(dosen.nama)}</td>
      <td>${escapeHtml(dosen.prodi)}</td>
      <td>
        <button class="btn-edit" type="button">Edit</button>
        <button class="btn-delete" type="button">Hapus</button>
      </td>
    `;

    const editButton = row.querySelector(".btn-edit") as HTMLButtonElement;
    const deleteButton = row.querySelector(".btn-delete") as HTMLButtonElement;

    editButton.addEventListener("click", () => {
      editDosen(dosen);
    });

    deleteButton.addEventListener("click", () => {
      deleteDosen(dosen.id);
    });

    dosenTableBody.appendChild(row);
  }
}

dosenForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nidn: inputNidn.value.trim(),
    nama: inputDosenNama.value.trim(),
    prodi: inputProdi.value.trim(),
  };

  if (!payload.nidn || !payload.nama || !payload.prodi) {
    showMessage(
      dosenMessage,
      "error",
      "NIDN, nama dosen, dan program studi wajib diisi.",
    );
    return;
  }

  try {
    if (dosenEditId.value) {
      await dosenApi.update(Number(dosenEditId.value), payload);
      showMessage(dosenMessage, "success", "Data dosen berhasil diperbarui.");
    } else {
      await dosenApi.insert(payload);
      showMessage(dosenMessage, "success", "Data dosen berhasil ditambahkan.");
    }

    resetDosenForm();
    await loadDosenTable();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan data dosen.";
    showMessage(dosenMessage, "error", message);
  }
});

function editDosen(dosen: Dosen): void {
  if (!dosen.id) {
    return;
  }

  dosenEditId.value = String(dosen.id);
  inputNidn.value = dosen.nidn;
  inputDosenNama.value = dosen.nama;
  inputProdi.value = dosen.prodi;
}

async function deleteDosen(id: number | undefined): Promise<void> {
  if (!id) {
    return;
  }

  if (confirm("Yakin hapus data dosen ini?")) {
    try {
      await dosenApi.delete(id);
      showMessage(dosenMessage, "success", "Data dosen berhasil dihapus.");
      await loadDosenTable();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data dosen.";
      showMessage(dosenMessage, "error", message);
    }
  }
}

function resetDosenForm(): void {
  dosenForm.reset();
  dosenEditId.value = "";
}

dosenClearButton.addEventListener("click", resetDosenForm);

dosenSearchButton.addEventListener("click", async () => {
  const keyword = dosenSearchInput.value.trim();

  if (!keyword) {
    await loadDosenTable();
    return;
  }

  const result = await dosenApi.search(keyword);
  renderDosenTable(result);
});

dosenResetSearchButton.addEventListener("click", async () => {
  dosenSearchInput.value = "";
  await loadDosenTable();
});

loadMahasiswaTable();
loadDosenTable();
