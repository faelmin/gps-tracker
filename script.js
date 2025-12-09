document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('getLocationBtn');
    const status = document.getElementById('statusMessage');

    // Nomor tujuan (diubah format internasional)
    // 085176700272 -> 6285176700272
    const TARGET_PHONE = '6285176700272';

    btn.addEventListener('click', () => {
        // Cek ketersediaan Geolocation API
        if (!navigator.geolocation) {
            showError('Browser Anda tidak mendukung Geolocation.');
            return;
        }

        // Update UI saat proses dimulai
        btn.disabled = true;
        status.textContent = 'Meminta izin lokasi...';
        status.className = 'status';

        navigator.geolocation.getCurrentPosition(
            // Callback Sukses
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                status.textContent = 'Mengirim data...';
                
                // Format pesan sesuai permintaan
                const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
                const message = `Lokasi terkini: ${mapsLink}`;
                
                // Buat URL WhatsApp
                const waUrl = `https://wa.me/${TARGET_PHONE}?text=${encodeURIComponent(message)}`;
                
                // Update UI
                status.textContent = 'Lokasi berhasil dikirim.';
                status.className = 'status success';
                btn.disabled = false;
                btn.textContent = 'Kirim Lagi';

                // Buka WhatsApp
                // Menggunakan location.href agar mobile langsung membuka aplikasi WA jika terinstall
                window.location.href = waUrl;
            },
            // Callback Error
            (error) => {
                btn.disabled = false;
                let errorMsg = 'Gagal mengambil lokasi.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Izin lokasi ditolak. Mohon aktifkan GPS.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Informasi lokasi tidak tersedia.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Waktu permintaan habis.';
                        break;
                }
                
                showError(errorMsg);
            },
            // Opsi Geolocation
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });

    function showError(msg) {
        status.textContent = msg;
        status.className = 'status error';
    }
});