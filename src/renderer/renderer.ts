const api = window.api;

const form = document.getElementById("form-mahasiswa") as HTMLFormElement;
const tbody = document.getElementById("table-body") as HTMLTableSectionElement;
const editId = document.getElementById("edit-id") as HTMLInputElement;

const inputNim = document.getElementById("nim") as HTMLInputElement;
const inputNama = document.getElementById("nama") as HTMLInputElement;
const inputJurusan = document.getElementById("jurusan") as HTMLInputElement;
const inputAngkatan = document.getElementById("angkatan") as HTMLInputElement;

const clearButton = document.getElementById("btn-clear") as HTMLButtonElement;

function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadTable(): Promise<void> {
  const data = await api.getAll();

  tbody.innerHTML = "";

  for (const mahasiswa of data) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(mahasiswa.nim)}</td>
      <td>${escapeHtml(mahasiswa.nama)}</td>
      <td>${escapeHtml(mahasiswa.jurusan)}</td>
      <td>${escapeHtml(mahasiswa.angkatan)}</td>
      <td>
        <button class="btn-edit" type="button">Edit</button>
        <button class="btn-delete" type="button">Hapus</button>
      </td>
    `;

    const editButton = row.querySelector(".btn-edit") as HTMLButtonElement;
    const deleteButton = row.querySelector(".btn-delete") as HTMLButtonElement;

    editButton.addEventListener("click", () => {
      editRow(
        mahasiswa.id,
        mahasiswa.nim,
        mahasiswa.nama,
        mahasiswa.jurusan,
        mahasiswa.angkatan,
      );
    });

    deleteButton.addEventListener("click", () => {
      deleteRow(mahasiswa.id);
    });

    tbody.appendChild(row);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nim: inputNim.value.trim(),
    nama: inputNama.value.trim(),
    jurusan: inputJurusan.value.trim(),
    angkatan: Number(inputAngkatan.value),
  };

  if (!payload.nim || !payload.nama || !payload.jurusan || !payload.angkatan) {
    alert("Semua field wajib diisi.");
    return;
  }

  try {
    if (editId.value) {
      await api.update(Number(editId.value), payload);
    } else {
      await api.insert(payload);
    }

    resetForm();
    await loadTable();
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data. Pastikan NIM tidak duplikat.");
  }
});

function editRow(
  id: number | undefined,
  nim: string,
  nama: string,
  jurusan: string,
  angkatan: number,
): void {
  if (!id) {
    return;
  }

  editId.value = String(id);
  inputNim.value = nim;
  inputNama.value = nama;
  inputJurusan.value = jurusan;
  inputAngkatan.value = String(angkatan);
}

async function deleteRow(id: number | undefined): Promise<void> {
  if (!id) {
    return;
  }

  const isConfirmed = confirm("Yakin hapus data ini?");

  if (isConfirmed) {
    await api.delete(id);
    await loadTable();
  }
}

function resetForm(): void {
  form.reset();
  editId.value = "";
}

clearButton.addEventListener("click", resetForm);

loadTable();
