<template>
  <div class="container mt-5 shadow-lg rounded p-4">
    <h1 class="text-center mb-4 fw-bold">Daftar Mahasiswa</h1>

    <!-- Pencarian -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <input type="text" class="form-control shadow me-3" v-model="searchQuery" placeholder="Cari berdasarkan nama atau NIM" />
      <button class="btn btn-primary px-4" @click="searchStudents">Search</button>
    </div>

    <!-- Tabel Mahasiswa -->
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>Nama</th>
          <th>NIM</th>
          <th>IPK</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in paginatedStudents" :key="student.nim">
          <td>{{ student.nim }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.ipk !== undefined ? student.ipk.toFixed(2) : "-" }}</td>
          <td class="dp-flex">
            <button class="btn btn-success btn-sm me-2" @click="generateIPK(student)">Generate IPK</button>
            <button class="btn btn-primary btn-sm" @click="goToKRSPage(student.nim)">Table KRS</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3" v-if="filteredStudents.length > 0">
      <!-- <span> Menampilkan {{ paginatedStudents.length }} dari {{ filteredStudents.length }} mahasiswa </span> -->
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Pesan Error -->
    <p v-if="loading" class="text-center text-secondary">Memuat data...</p>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      students: [], // Data mahasiswa
      loading: false, // Status pemuatan data
      error: "", // Pesan error
      searchQuery: "", // Kata kunci pencarian
      currentPage: 1, // Halaman saat ini
      itemsPerPage: 5, // Jumlah data per halaman
    };
  },
  computed: {
    // Filter data mahasiswa berdasarkan nama atau NIM
    filteredStudents() {
      const query = this.searchQuery.toLowerCase();
      if (!query) return this.students; // Jika pencarian kosong, tampilkan semua
      return this.students.filter((student) => student.name.toLowerCase().includes(query) || student.nim.toLowerCase().includes(query));
    },
    // Data mahasiswa pada halaman saat ini
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStudents.slice(start, end);
    },
    // Total halaman
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    },
  },
  methods: {
    // Reset ke halaman pertama setelah pencarian
    searchStudents() {
      this.currentPage = 1;
    },
    // Ganti halaman
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // Fetch data mahasiswa
    fetchStudents() {
      this.loading = true;
      this.error = "";
      axios
        .get("https://backend-ipk-485701353107.us-central1.run.app/mahasiswa")
        .then((response) => {
          this.students = response.data;
        })
        .catch((err) => {
          this.error = "Gagal memuat data mahasiswa.";
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // Generate IPK mahasiswa
    generateIPK(student) {
      // Menampilkan SweetAlert dengan status loading
      Swal.fire({
        title: "Memuat IPK...",
        text: "Proses pengambilan data IPK sedang berlangsung",
        icon: "info",
        allowOutsideClick: false, // Menonaktifkan klik di luar swal
        didOpen: () => {
          Swal.showLoading(); // Menampilkan animasi loading
        },
      });

      axios
        .get(`https://backend-ipk-485701353107.us-central1.run.app/ipk/${student.nim}`)
        .then((response) => {
          student.ipk = parseFloat(response.data.ipk);
          Swal.close();
        })
        .catch((err) => {
          console.error("Gagal mendapatkan IPK:", err);
          Swal.close(); // Menutup SweetAlert jika gagal
          alert("Gagal mendapatkan IPK mahasiswa.");
        });
    },
    // Navigasi ke halaman KRS mahasiswa
    goToKRSPage(nim) {
      this.$router.push(`/krs/${nim}`);
    },
  },
  mounted() {
    this.fetchStudents(); // Memuat data saat komponen di-mount
  },
};
</script>
