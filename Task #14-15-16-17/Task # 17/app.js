// app.js
const basemapStreet = 'https://basemap.mapid.io/styles/street-2d-building/style.json?key=69a8edeffdb1d3dbc8b3022c';
const basemapDark = 'https://basemap.mapid.io/styles/dark/style.json?key=69a8edeffdb1d3dbc8b3022c';
const basemapSatellite = 'https://basemap.mapid.io/styles/satellite/style.json?key=69a8edeffdb1d3dbc8b3022c';

// Inisialisasi peta dengan gaya street dan koordinat awal di Bandung
const map = new maplibregl.Map({
    container:'map', // ID elemen HTML tempat peta akan ditampilkan
    style: basemapStreet, // Gaya peta yang digunakan
    center: [107.605743, -6.916823], // Koordinat pusat peta (longitude, latitude)
    zoom: 12 // Tingkat zoom awal peta
})

// URL basemap API data
const url_apartemen = 'https://geoserver.mapid.io/layers_new/get_layer?api_key=7b8019aa264248e89e3fd5b27253132f&layer_id=69ace1b8643f7636a769ce7c&project_id=69ab9fb96c69e6252868efaf'
const url_adminisitrasi = 'https://geoserver.mapid.io/layers_new/get_layer?api_key=7b8019aa264248e89e3fd5b27253132f&layer_id=69ace7646c69e62528aa09c5&project_id=69ab9fb96c69e6252868efaf'
const url_drainase = 'https://geodata.bandung.go.id/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3ADrainase_2022&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326'

let apartemenDataResult;

async function loadData(){
    // Mengambil data apartemen dari API
    const apartemenResponse = await fetch(url_apartemen);
    // Mengonversi respons menjadi format JSON
    const apartemenData = await apartemenResponse.json();
    apartemenDataResult = apartemenData;

    // Menampilkan data apartemen di konsol untuk verifikasi
    console.log(apartemenResponse);
    console.log(apartemenData);

    // Menambahkan data apartemen ke peta
    map.addSource('apartemen', {
        type: 'geojson',
        data: apartemenData,
    });
    map.addSource('apartemen-cluster', {
        type: 'geojson',
        data: apartemenData,
        cluster: true, // Aktifkan clustering untuk data apartemen
        clusterMaxZoom: 14, // Maksimal zoom untuk clustering
        clusterRadius: 50 // Radius cluster dalam pixel
    });

    // Menambahkan layer untuk menampilkan apartemen
    map.addLayer({
        id: 'apartemen-layer',
        source: 'apartemen',
        type: 'circle',
        paint:{
            'circle-color': '#F227F5',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000000'
        },
        layout:{
            'visibility': 'visible'
        }
    })

    // Menambahkan layer untuk menampilkan apartemen dalam bentuk heatmap
    map.addLayer({
          id: "layer-heatmap",
          type: "heatmap",
          source: "apartemen",
          maxzoom: 15,
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "value"],
              0,
              0,
              10,
              1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.6,
              15,
              2,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,0,255,0)",
              0.1,
              "blue",
              0.3,
              "cyan",
              0.5,
              "lime",
              0.7,
              "yellow",
              1,
              "red",
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
              15,
              60,
            ],
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              8,
              1,
              14,
              0.3,
            ],
          },
    });

    // Menambahkan layer untuk menampilkan apartemen dalam bentuk cluster
    map.addLayer({
            id: 'layer-cluster',
            type: 'circle',
            source: 'apartemen-cluster',
            filter: ['has', 'point_count'], // HANYA menampilkan fitur yang punya point_count
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51d698ff', // Warna jika di bawah 10 titik
                    10,
                    '#f2f244ff', // Warna jika antara 10 - 20 titik
                    20,
                    '#f35415ff'  // Warna jika di atas 20 titik
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    10,  // Radius default
                    100, 30, // Jika titik > 100, radius jadi 30
                    750, 40  // Jika titik > 750, radius jadi 40
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
    });

    // 3. Layer untuk Angka di dalam Cluster
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'apartemen-cluster',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}', // Menampilkan angka (misal: 1.2k)
            'text-size': 12
        }
    });

    // 4. Layer untuk Titik Tunggal (yang tidak berkerumun)
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'apartemen-cluster',
        filter: ['!', ['has', 'point_count']], // HANYA menampilkan yang BUKAN cluster
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });


    // DATA ADMINISTRASI
    // Mengambil data apartemen dari API
    const administrasiResponse = await fetch(url_adminisitrasi);
    // Mengonversi respons menjadi format JSON
    const administrasiData = await administrasiResponse.json();

    // Menambahkan data administrasi ke peta
    map.addSource('administrasi', {
        type: 'geojson',
        data: administrasiData
    });

    // Menambahkan layer untuk menampilkan administrasi
    map.addLayer({
        id: 'administrasi-layer',
        source: 'administrasi',
        type: 'fill',
        paint:{
            'fill-color': '#27B4F5',
            'fill-opacity': 0.5
        },
                    layout:{
            'visibility': 'visible'
        }
    }, 'apartemen-layer') // Menambahkan layer administrasi di bawah layer apartemen

    // DATA DRAINASE
    // Mengambil data apartemen dari API
    const drainaseResponse = await fetch(url_drainase);
    // Mengonversi respons menjadi format JSON
    const drainaseData = await drainaseResponse.json();

    // Menambahkan data administrasi ke peta
    map.addSource('drainase', {
        type: 'geojson',
        data: drainaseData
    });

    // Menambahkan layer untuk menampilkan drainase
    map.addLayer({
        id: 'drainase-layer',
        source: 'drainase',
        type: 'line',
        paint:{
            'line-color': '#2749F5',
            'line-width': 2
        },
        layout:{
            'visibility': 'visible'
        }
    }, 'apartemen-layer') // Menambahkan layer administrasi di bawah layer apartemen
}
map.on('load', () =>{
    loadData();
})

// Menambahkan event listener untuk menangani klik pada layer apartemen
map.on('click', 'apartemen-layer', (event)=>{

    // Mendapatkan koordinat klik dan properti fitur yang diklik
    const coordinates = event.lngLat;
    const features = event.features[0].properties;

    // Menampilkan informasi fitur yang diklik di konsol untuk verifikasi
    console.log('FEATURES', features);
    console.log('COORDINATES', coordinates);
    console.log('HASIL EVEN CLICK', event);

    // Membuat konten HTML untuk popup berdasarkan properti fitur
    const html = `
        <div>
            <h1> Informasi Apartemen </h1>
            <p> Nama Apartemen : ${features.NAMA}</p>
            <p> Alamat : ${features.ALAMAT}</p>
        </div>
    `

    new maplibregl.Popup() // Membuat popup baru
    .setHTML(html) // Mengatur konten HTML untuk popup
    .setLngLat(coordinates) // Mengatur posisi popup berdasarkan koordinat klik
    .addTo(map); // Menambahkan popup ke peta
});

// Menambahkan event listener untuk menangani klik pada layer administrasi
map.on('click', 'administrasi-layer', (event)=>{

    // Mendapatkan koordinat klik dan properti fitur yang diklik
    const coordinates = event.lngLat;
    const features = event.features[0].properties;

    // Menampilkan informasi fitur yang diklik di konsol untuk verifikasi
    console.log('FEATURES', features);


    // Membuat konten HTML untuk popup berdasarkan properti fitur
    const html = `
        <div>
            <h1> Informasi Administrasi </h1>
            <p> Kabupaten/Kota : ${features['KABUPATEN/KOTA']}</p>
            <p> Provinsi : ${features.PROVINSI}</p>
        </div>
    `

    new maplibregl.Popup() // Membuat popup baru
    .setHTML(html) // Mengatur konten HTML untuk popup
    .setLngLat(coordinates) // Mengatur posisi popup berdasarkan koordinat klik
    .addTo(map); // Menambahkan popup ke peta
});

// Menambahkan event listener untuk menangani klik pada layer drainase
map.on('click', 'drainase-layer', (event)=>{

    // Mendapatkan koordinat klik dan properti fitur yang diklik
    const coordinates = event.lngLat;
    const features = event.features[0].properties;

    // Menampilkan informasi fitur yang diklik di konsol untuk verifikasi
    console.log('FEATURES', features);


    // Membuat konten HTML untuk popup berdasarkan properti fitur
    const html = `
        <div>
            <h1> Informasi Drainase </h1>
            <p> Nama Drainase : ${features['NAMA_JALAN']}</p>
            <p> Jenis Drainase : ${features['JENIS']}</p>
            <p> Pembangun : ${features['PEMBANGUN']}</p>
        </div>
    `

    new maplibregl.Popup() // Membuat popup baru
    .setHTML(html) // Mengatur konten HTML untuk popup
    .setLngLat(coordinates) // Mengatur posisi popup berdasarkan koordinat klik
    .addTo(map); // Menambahkan popup ke peta
});

// Fungsi untuk mengubah gaya peta ke gaya satelit
window.updateStyleToSatellite = ()=>{
    map.setStyle(basemapSatellite);
    loadData(); // Memanggil fungsi loadData untuk memuat ulang data setelah mengubah gaya peta
}
// Fungsi untuk mengubah gaya peta ke gaya dark
window.updateStyleToDark = ()=>{
    map.setStyle(basemapDark)
    loadData(); // Memanggil fungsi loadData untuk memuat ulang data setelah mengubah gaya peta

}
// Fungsi untuk mengubah gaya peta ke gaya street
window.updateStyleToStreet = ()=>{
    map.setStyle(basemapStreet)
    loadData(); // Memanggil fungsi loadData untuk memuat ulang data setelah mengubah gaya peta

}

// Fungsi toggle layer apartemen
window.toggleLayerApartemen = () => {
    const btn = document.getElementById("toggle-apartemen-layer");

    const visibility = map.getLayoutProperty('apartemen-layer', 'visibility');
    const isVisible = visibility === 'visible';

    const newState = isVisible ? 'none' : 'visible';
    map.setLayoutProperty('apartemen-layer', 'visibility', newState);

    // 🔥 update UI
    if (newState === 'visible') {
        btn.classList.add("toggle-active");
        btn.classList.remove("toggle-inactive");
    } else {
        btn.classList.add("toggle-inactive");
        btn.classList.remove("toggle-active");
    }
};

// Fungsi toggle layer administrasi
window.toggleLayerAdministrasi = () => {
    const btn = document.getElementById("toggle-administrasi-layer");

    const visibility = map.getLayoutProperty('administrasi-layer', 'visibility');
    const isVisible = visibility === 'visible';

    const newState = isVisible ? 'none' : 'visible';
    map.setLayoutProperty('administrasi-layer', 'visibility', newState);

    if (newState === 'visible') {
        btn.classList.add("toggle-active");
        btn.classList.remove("toggle-inactive");
    } else {
        btn.classList.add("toggle-inactive");
        btn.classList.remove("toggle-active");
    }
};

// Fungsi toggle layer drainase
window.toggleLayerDrainase = () => {
    const btn = document.getElementById("toggle-drainase-layer");

    const visibility = map.getLayoutProperty('drainase-layer', 'visibility');
    const isVisible = visibility === 'visible';

    const newState = isVisible ? 'none' : 'visible';
    map.setLayoutProperty('drainase-layer', 'visibility', newState);

    if (newState === 'visible') {
        btn.classList.add("toggle-active");
        btn.classList.remove("toggle-inactive");
    } else {
        btn.classList.add("toggle-inactive");
        btn.classList.remove("toggle-active");
    }
};


/**
 * applyFilter: Memfilter data pada apartemen-layer.
 * Menggunakan operator '==' pada properti 'KECAMATAN' atau atribut lainnya.
 */
window.applyFilter = (key, val) => {
    if (val === 'all') map.setFilter('apartemen-layer', null); // Tampilkan semua jika val 'all'
    else map.setFilter('apartemen-layer', ['==', ['get', key], val]);
};

/**
 * setPaint: Mengubah properti visual (paint property) secara real-time.
 * Digunakan untuk mengganti warna atau opacity via slider/color picker.
 */
window.setPaint = (layerId, prop, val) => {
    map.setPaintProperty(layerId, prop, val);
};


/**
 * BUFFER ANALYSIS
 * */
/**
 * BUFFER ANALYSIS
 * */
    map.on("load", function () {
    const triggerButton = document.getElementById("button-run");
    
    // 1. TAMBAHAN BARU: Variabel untuk menyimpan titik klik
    let userClickedLng = null;
    let userClickedLat = null;
    let centerMarker = null; // Marker untuk menandai titik pusat
    
    // 2. TAMBAHAN BARU: Event ketika peta diklik
    map.on('click', (e) => {
        // Ambil koordinat dari lokasi yang diklik
        userClickedLng = e.lngLat.lng;
        userClickedLat = e.lngLat.lat;
        
        // Jika sudah ada marker sebelumnya, hapus dulu agar tidak bertumpuk
        if (centerMarker) {
            centerMarker.remove();
        }

        setTimeout(() => {
            const popups = document.querySelectorAll('.maplibregl-popup');
            popups.forEach(popup => popup.remove());
        }, 10);
        
        // Pasang marker baru di titik yang diklik (Warna hitam)
        centerMarker = new maplibregl.Marker({ color: "#1e293b" })
            .setLngLat([userClickedLng, userClickedLat])
            .addTo(map);
    });

    triggerButton.addEventListener("click", () => execute());

    async function execute() {
        // 3. CEK KLIK: Pastikan pengguna sudah mengklik peta
        if (userClickedLng === null || userClickedLat === null) {
            alert("Silakan klik di mana saja pada peta terlebih dahulu untuk menentukan titik pusat Buffer!");
            return; // Hentikan fungsi jika belum ada titik
        }

        const radiusInput = document.getElementById("radius").value;
        const radius = parseFloat(radiusInput);
        const loading = document.getElementById("loading");

        loading.style.display = "flex";
        triggerButton.style.display = "none";

        // 4. GUNAKAN TITIK KLIK: Menggunakan koordinat klik pengguna, BUKAN titik mati
        const centerPoint = turf.point([userClickedLng, userClickedLat]);

        // Buat polygon Buffer menggunakan Turf.js
        const bufferedPolygon = turf.buffer(centerPoint, radius, { units: 'kilometers' });

        // Tampilkan polygon Buffer ke Peta
        if (map.getSource("buffer-source")) {
            map.removeLayer("buffer-layer");
            map.removeSource("buffer-source");
        }
        
        map.addSource("buffer-source", {
            type: "geojson",
            data: bufferedPolygon,
        });
        
        map.addLayer({
            id: "buffer-layer",
            type: "fill",
            source: "buffer-source",
            paint: {
                "fill-color": "#10b981", 
                "fill-opacity": 0.4,
                "fill-outline-color": "#047857"
            },
        });

        // Analisis Titik dalam Polygon
        let resultHTML = "";

        if (apartemenDataResult && apartemenDataResult.features) {
            apartemenDataResult.features.forEach((apt) => {
                const lng = apt.geometry.coordinates[0];
                const lat = apt.geometry.coordinates[1];
                const pt = turf.point([lng, lat]);

                if (turf.booleanPointInPolygon(pt, bufferedPolygon)) {
                    resultHTML += `
                        <li onclick="zoomToApartemen(${lng}, ${lat})"
                            style="cursor:pointer">
                            Apartemen ${apt.properties.NAMA}
                        </li>
                    `;
                }
            });
        }

        if(resultHTML === "") {
            document.getElementById("result").innerHTML = '<li class="text-[11px] text-slate-400 italic">Tidak ada apartemen di area ini...</li>';
        } else {
            document.getElementById("result").innerHTML = resultHTML;
        }
    
        loading.style.display = "none";
        triggerButton.style.display = "flex";
    }
});
        let activeMarker;

        window.zoomToApartemen = (lng, lat) => {

            // hapus marker lama
            if (activeMarker) activeMarker.remove();

            // buat marker baru
            activeMarker = new maplibregl.Marker({ color: "red" })
                .setLngLat([lng, lat])
                .addTo(map);

            map.flyTo({
                center: [lng, lat],
                zoom: 16,
                speed: 1.2
            });
        };