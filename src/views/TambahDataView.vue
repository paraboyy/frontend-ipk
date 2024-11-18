<template>
    <div class="container mt-5">
      <div class="p-4 rounded shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Tambah Data KRS Mahasiswa</h1>
  
          <!-- Form Input Data KRS -->
          <div v-if="mahasiswa && matakuliah">
            
            <!-- Nama Mahasiswa -->
            <div class="form-group">
              <label for="mahasiswa">Nama Mahasiswa:</label>
              <select v-model="krsData.mahasiswa_id" id="mahasiswa" class="form-control" @change="getMahasiswaData">
                <option value="" disabled selected>Pilih Nama Mahasiswa</option>
                <option v-for="mahasiswa in mahasiswa" :key="mahasiswa.id" :value="mahasiswa.id">
                  {{ mahasiswa.name }} - {{ mahasiswa.nim }}
                </option>
              </select>
            </div>
  
            <!-- Semester -->
            <div class="form-group">
              <label for="semester">Semester:</label>
              <input v-model="krsData.semester" id="semester" type="number" class="form-control" placeholder="Masukkan Semester" required />
            </div>
  
            <!-- Mata Kuliah -->
            <div class="form-group">
              <label for="matakuliah">Mata Kuliah:</label>
              <select v-model="krsData.matakuliah_id" id="matakuliah" class="form-control">
                <option value="" disabled selected>Pilih Matakuliah</option>
                <option v-for="mk in matakuliah" :key="mk.id" :value="mk.id">
                  {{ mk.code }} - {{ mk.name }}
                </option>
              </select>
            </div>
  
            <!-- Nilai -->
            <div class="form-group">
              <label for="nilai">Nilai:</label>
              <input v-model="krsData.nilai" id="nilai" type="number" class="form-control" placeholder="Masukkan Nilai" required />
            </div>
  
            <!-- Huruf -->
            <div class="form-group">
              <label for="huruf">Huruf:</label>
              <select v-model="krsData.huruf" id="huruf" class="form-control">
                <option value="" disabled selected>Masukan Index Nilai</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
  
            <!-- Submit Button -->
            <div class="form-group text-center">
              <button @click="submitKRS" class="btn btn-primary w-100 mt-3">Simpan KRS</button>
            </div>
          </div>
  
          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger mt-4 text-center">
            {{ errorMessage }}
          </div>
  
          <!-- Success Message -->
          <div v-if="successMessage" class="alert alert-success mt-4 text-center">
            {{ successMessage }}
          </div>
  
        </div>
      </div>
    </div>
</template>
  
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        mahasiswa: [], // Daftar mahasiswa dari API
        matakuliah: [], // Daftar matakuliah dari API
        krsData: {
          mahasiswa_id: "", // ID mahasiswa
          matakuliah_id: "", // ID mata kuliah
          nilai: "", // Nilai yang dimasukkan
          huruf: "", // Huruf nilai
          semester: "", // Semester yang dimasukkan
        },
        errorMessage: "", // Pesan error
        successMessage: "", // Pesan sukses
      };
    },
    created() {
      this.fetchMahasiswa(); // Mengambil data mahasiswa saat komponen dimuat
      this.fetchMatakuliah(); // Mengambil data matakuliah saat komponen dimuat
    },
    methods: {
      // Ambil data mahasiswa dari API
      async fetchMahasiswa() {
        try {
          const response = await axios.get("https://backend-ipk-485701353107.us-central1.run.app/mahasiswa");
          this.mahasiswa = response.data;
        } catch (error) {
          console.error("Error fetching mahasiswa:", error);
        }
      },
  
      // Ambil data matakuliah dari API
      async fetchMatakuliah() {
        try {
          const response = await axios.get("https://backend-ipk-485701353107.us-central1.run.app/matakuliah");
          this.matakuliah = response.data;
        } catch (error) {
          console.error("Error fetching matakuliah:", error);
        }
      },
  
      // Mengirim data KRS ke API
      async submitKRS() {
        if (!this.krsData.mahasiswa_id || !this.krsData.matakuliah_id || !this.krsData.nilai || !this.krsData.huruf || !this.krsData.semester) {
          this.errorMessage = "Semua data harus diisi!";
          return;
        }
  
        try {
          const response = await axios.post("https://backend-ipk-485701353107.us-central1.run.app/krs", this.krsData);
          this.successMessage = "Data KRS berhasil disimpan!";
          this.errorMessage = "";
        } catch (error) {
          console.error("Error saving KRS:", error);
          this.errorMessage = "Terjadi kesalahan saat menyimpan data KRS.";
          this.successMessage = "";
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
  