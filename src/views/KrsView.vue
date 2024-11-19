<template>
  <div class="container mt-5 shadow-lg rounded p-4">
    <h1 class="text-center mb-4 fw-bold">Detail KRS Mahasiswa</h1>
    <button class="btn btn-danger btn-sm mb-4 p-2" @click="goToHome">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace" viewBox="0 0 16 16">
        <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
        <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
      </svg>
      Kembali
    </button>

    <div v-if="loading" class="text-center text-secondary">Memuat data KRS...</div>

    <div v-if="error" class="text-danger text-center">Terjadi kesalahan: {{ error }}</div>

    <div v-if="krsData && krsData.nim">
      <h3 class="text-success">Data Mahasiswa</h3>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>IPK</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ krsData.nim }}</td>
            <td>{{ krsData.nama }}</td>
            <td>{{ krsData.ipk }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabel untuk IPS Per Semester -->
      <h3 class="mt-4 text-success">IPS Per Semester</h3>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Semester</th>
            <th>IPS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ips, semester) in krsData.ips" :key="semester">
            <td>Semester {{ semester }}</td>
            <td>{{ ips.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabel untuk IPS dan Mata Kuliah -->
      <h3 class="mt-4 text-success">Mata Kuliah Per Semester</h3>
      <div v-for="(matakuliah, semester) in krsData.matakuliah" :key="semester">
        <h5>Semester {{ semester }} - IPS: {{ krsData.ips[semester].toFixed(2) }}</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nama Mata Kuliah</th>
              <th>SKS</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mk, index) in matakuliah" :key="index">
              <td>{{ mk.nama_matakuliah }}</td>
              <td>{{ mk.sks }}</td>
              <td>{{ mk.nilai }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!loading && !error && (!krsData || !krsData.nim)" class="text-center">Tidak ada data KRS ditemukan untuk NIM ini.</div>
  </div>
</template>

<script>
import axios from "axios";
//   import Swal from "sweetalert2"; // Pastikan Swal diimpor jika digunakan

export default {
  data() {
    return {
      nim: this.$route.params.nim, // Mendapatkan NIM dari URL
      krsData: null, // Data KRS mahasiswa
      loading: false, // Status pemuatan data
      error: "", // Pesan error
    };
  },
  methods: {
    goToHome() {
      this.$router.push(`/`);
    },
    // Fungsi untuk mengambil data KRS mahasiswa berdasarkan NIM
    async fetchKRS() {
      try {
        this.error = ""; // Menghapus pesan error
        this.loading = true; // Mengatur status loading menjadi true

        const response = await axios.get(`https://backend-ipk-485701353107.us-central1.run.app/ipk/${this.nim}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Mengambil data mahasiswa dan memformat IPK, IPS, dan mata kuliah
        this.krsData = {
          nim: this.nim,
          nama: response.data.nama, // Nama mahasiswa dari API
          ipk: response.data.ipk ? response.data.ipk.toFixed(2) : "0.00",
          ips: response.data.ips.ips, // Data IPS per semester
          matakuliah: response.data.ips.matakuiah, // Data mata kuliah per semester
        };

        //   console.log(this.krsData.matakuliah);

        // Menutup pop-up SweetAlert setelah selesai
        Swal.close();
      } catch (error) {
        this.krsData = null;
        this.error = error.response && error.response.status === 404 ? "Gagal mengambil data IPK. Pastikan NIM valid." : "Terjadi kesalahan dalam menghubungi API.";

        // Menampilkan pesan error dengan SweetAlert
        Swal.close();
        console.error("Error:", error);
      } finally {
        this.loading = false; // Mengatur status loading menjadi false setelah selesai
      }
    },
  },
  mounted() {
    this.fetchKRS(); // Memanggil API saat komponen dimuat
  },
};
</script>
