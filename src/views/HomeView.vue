<template>
  <div id="app" class="container shadow rounded mt-5">
    <h1 class="text-center mb-4">Perhitungan IPK Mahasiswa</h1>

    <div class="form-group">
      <label for="nim">NIM :</label>
      <input v-model="nim" id="nim" type="text" class="form-control" placeholder="Masukkan NIM" />
    </div>
    
    <div class="">
      <button @click="getIPK" class="btn btn-primary btn-block mt-3">Hitung IPK</button>
      <button class="btn btn-warning btn-block mt-3 mx-2">
        <a href="/tambahdata">Tambah Data</a>
      </button>
    </div>

    <div v-if="errorMessage" class="mt-4">
      <h4 class="text-light text-center bg-danger rounded p-2">{{ errorMessage }}</h4>
    </div>

    <div v-if="studentData" class="mt-4">
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
            <td>{{ studentData.nim }}</td>
            <td>{{ studentData.nama }}</td>
            <td>{{ studentData.ipk }}</td>
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
          <tr v-for="(ips, semester) in studentData.ips" :key="semester">
            <td>Semester {{ semester }}</td>
            <td>{{ ips.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabel untuk IPS dan Mata Kuliah -->
      <h3 class="mt-4 text-success">Mata Kuliah Per Semester</h3>
      <div v-for="(matakuliah, semester) in studentData.matakuliah" :key="semester">
        <h5>Semester {{ semester }} - IPS: {{ studentData.ips[semester].toFixed(2) }}</h5>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      nim: "", // Input NIM mahasiswa
      studentData: null, // Data mahasiswa (NIM, nama, IPK, IPS, matakuliah)
      errorMessage: "", // Pesan error jika terjadi kesalahan
    };
  },
  methods: {
    async getIPK() {
      if (!this.nim) {
        this.errorMessage = "NIM tidak boleh kosong!";
        this.studentData = null;
        return;
      }

      // Menampilkan pop-up SweetAlert sebelum proses dimulai
      Swal.fire({
        title: 'Menghitung IPK...',
        text: 'Mohon tunggu sebentar',
        icon: 'info',
        allowOutsideClick: false, // Mencegah pop-up ditutup selama proses
        showConfirmButton: false, // Menyembunyikan tombol konfirmasi
        didOpen: () => {
          Swal.showLoading(); // Menampilkan loading indicator
        }
      });

      try {
        this.errorMessage = ""; // Menghapus pesan error
        const response = await axios.get(`https://backend-ipk-485701353107.us-central1.run.app/ipk/${this.nim}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Mengambil data mahasiswa dan memformat IPK, IPS, dan mata kuliah
        this.studentData = {
          nim: this.nim,
          nama: response.data.nama, // Nama mahasiswa dari API
          ipk: response.data.ipk ? response.data.ipk.toFixed(2) : "0.00", 
          ips: response.data.ips.ips, // Data IPS per semester
          matakuliah: response.data.ips.matakuiah, // Data mata kuliah per semester
        };

        // Menutup pop-up SweetAlert setelah selesai
        Swal.close(); // Menutup SweetAlert setelah selesai

      } catch (error) {
        this.studentData = null;
        // Menampilkan pesan error dengan SweetAlert
        Swal.close(); // Menutup SweetAlert
        if (error.response && error.response.status === 404) {
          this.errorMessage = "Gagal mengambil data IPK. Pastikan NIM valid.";
        } else {
          this.errorMessage = "Terjadi kesalahan dalam menghubungi API.";
        }
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Custom styling */
#app {
  max-width: 800px;
  margin: 0 auto;
}
</style>
