// ----- Static
// const navTitle = (document.getElementById("nav-title").innerText =
//   "Content GIS - Dummy Data");
// const menuTitle = document
//   .getElementById("navDummy")
//   .classList.add("text-white");

// ----- Dynamic
// Alur Ganti warna pada menu nav untuk menjadikan dynamic
// 1. Membaca path
// 2. Jika pathnya sama maka akan menampilkan title yang sesuai
// 3. Logika dyncmic warna
// -- Jika pathnya sama maka akan berwarna merah
// -- Jika pathnya berbeda maka akan berwarna putih

let currenPage = window.location.pathname; // Digunakan untuk mendapatkan path
// Jika mencarinya di google masukan kata kunci "Cara mengambil pathname menggunakan js"

// Membuat Percabangan / Kondisi
if (currenPage === "/index.html") {
  // Jika path sama dengan "/index.html"
  // Maka akan menjalankan kondisi ini
  document.getElementById("nav-title").innerText = "Content GIS - Dummy Data"; // Mengganti text HTML

  // Jika Memakai CSS murni
  // bisa menggunakan .style.(style apa yang akan di ubah)
  // Jika memakai tailwind
  // harus mengubah dari class pada tag html
  // classList = Fungsi untuk manipulasi class di HTML
  document.getElementById("navDummy").classList.add("text-red-500"); // menambahkan class HTML
  document.getElementById("navFetch").classList.add("text-white"); // menambahkan class HTML
  // Berhenti disini
} else if (currenPage === "/fetch.html") {
  // Jika path sama dengan "/fetch.html"
  // Maka akan menjalankan kondisi ini
  document.getElementById("nav-title").innerText = "Content GIS - API Data"; // Mengganti text HTML

  // Jika Memakai CSS murni
  // bisa menggunakan .style.(style apa yang akan di ubah)
  // Jika memakai tailwind
  // harus mengubah dari class pada tag html
  // classList = Fungsi untuk manipulasi class di HTML
  document.getElementById("navDummy").classList.add("text-white"); // menambahkan class HTML
  document.getElementById("navFetch").classList.add("text-red-500"); // menambahkan class HTML
  // Berhenti disini
}
