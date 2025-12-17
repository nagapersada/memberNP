// Variabel global untuk menyimpan data sementara anggota baru
let newVipAlerts = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};

function countVipStats(a){
    let b={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    
    // Reset List
    vipLists = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
    newVipAlerts = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};

    // Ambil data lama dari LocalStorage untuk dibandingkan
    let storedVips = JSON.parse(localStorage.getItem('storedVipData') || '{}');

    a.forEach(member=>{
        let c=getRankLevel(member.uid);
        if(c>=1&&c<=9){
            b[c]++;
            vipLists[c].push(member);

            // LOGIKA CEK NEW MEMBER
            // Jika di level ini belum ada data tersimpan, atau UID ini belum ada di data tersimpan
            if (!storedVips[c] || !storedVips[c].includes(member.uid)) {
                newVipAlerts[c].push(member.uid);
            }
        }
    });

    for(let level=1; level<=9; level++){
        // Update Angka
        const countEl = document.getElementById(`cVIP${level}`);
        if(countEl) countEl.innerText = b[level];

        // Update Notifikasi Titik Merah di Tombol
        const btnEl = document.querySelector(`.vip-item[onclick="openVipModal(${level})"]`);
        if (btnEl) {
            // Hapus badge lama jika ada
            const oldBadge = btnEl.querySelector('.notif-badge');
            if(oldBadge) oldBadge.remove();

            // Jika ada anggota baru, tambahkan badge merah
            if (newVipAlerts[level].length > 0) {
                const badge = document.createElement('div');
                badge.className = 'notif-badge';
                badge.style.display = 'block';
                btnEl.appendChild(badge);
            }
        }
    }
}

// UPDATE FUNGSI MODAL UNTUK MENAMPILKAN KEDIP MERAH & SIMPAN DATA
window.openVipModal = function(level) {
    const modal = document.getElementById('vipModal');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');
    title.innerText = `DAFTAR V.I.P ${level}`;
    body.innerHTML = ''; 
    
    const list = vipLists[level];
    const newUids = newVipAlerts[level]; // Daftar UID baru di level ini

    if (list && list.length > 0) {
        list.forEach(m => {
            // Cek apakah member ini 'Baru'
            let isNew = newUids.includes(m.uid);
            let rowClass = isNew ? 'v-item is-new-vip' : 'v-item';
            let labelBaru = isNew ? ' (BARU!)' : '';

            body.innerHTML += `<div class="${rowClass}"><span class="v-n">${m.name}${labelBaru}</span><span class="v-u">${m.uid}</span></div>`;
        });

        // SETELAH DIBUKA, SIMPAN DATA KE STORAGE AGAR TIDAK BERKEDIP LAGI NANTI
        updateStoredVips(level, list);
        
        // Hilangkan titik merah pada tombol dashboard secara langsung
        const btnEl = document.querySelector(`.vip-item[onclick="openVipModal(${level})"] .notif-badge`);
        if(btnEl) btnEl.style.display = 'none';

    } else {
        body.innerHTML = '<div class="v-empty">Belum ada anggota.</div>';
    }
    modal.style.display = 'flex';
}

// Fungsi Bantuan untuk Menyimpan Data ke LocalStorage
function updateStoredVips(level, currentList) {
    let storedVips = JSON.parse(localStorage.getItem('storedVipData') || '{}');
    
    // Simpan hanya UID nya saja
    storedVips[level] = currentList.map(m => m.uid);
    
    localStorage.setItem('storedVipData', JSON.stringify(storedVips));
    
    // Kosongkan alert untuk level ini di memori sementara
    newVipAlerts[level] = [];
}

window.closeVipModal = function() {
    document.getElementById('vipModal').style.display = 'none';
}
