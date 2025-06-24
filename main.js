let webData = [];
let filteredData = [];
const webList = document.getElementById('web-list');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const toast = document.getElementById('toast');
const toggleMode = document.getElementById('toggleMode');
const body = document.getElementById('body');

// Load dark mode dari localStorage
if (localStorage.getItem('mode') === 'light') {
  setLightMode();
}

// Load data awal
function loadData() {
  const localData = localStorage.getItem('webData');
  if (localData) {
    webData = JSON.parse(localData);
    renderWeb(webData);
  } else {
    fetch('web.json')
      .then(response => response.json())
      .then(data => {
        webData = data.websites;
        localStorage.setItem('webData', JSON.stringify(webData));
        renderWeb(webData);
      });
  }
}

function renderWeb(data) {
  webList.innerHTML = '';
  if (data.length === 0) {
    webList.innerHTML = `<div class="text-center text-gray-400">Tidak ada website ditemukan.</div>`;
    return;
  }
  
  data.forEach(web => {
    const webCard = document.createElement('div');
    webCard.className = 'bg-gray-800 p-4 rounded-lg shadow hover:scale-105 transition transform';
    
    webCard.innerHTML = `
            <h2 class="text-xl font-semibold mb-2">${web.name}</h2>
            <p class="mb-2">${web.description}</p>
            <p class="mb-2 text-sm text-gray-400">Kategori: ${web.category}</p>
            <div class="flex gap-4">
                <a href="${web.url}" target="_blank" class="text-blue-400 hover:underline">Kunjungi Website</a>
                <button class="text-green-400 hover:underline copy-btn" data-url="${web.url}">Copy Link</button>
            </div>
        `;
    
    webList.appendChild(webCard);
  });
}

// Event Delegation untuk copy button
webList.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    navigator.clipboard.writeText(e.target.getAttribute('data-url'));
    showToast('Link berhasil disalin!');
  }
});

// Tampilkan toast dengan animasi smooth
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden', 'opacity-0');
  toast.classList.add('opacity-100', 'scale-100');
  
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'scale-100');
    toast.classList.add('opacity-0');
  }, 2000);
}

// Pencarian dan filter
searchInput.addEventListener('input', filterAndRender);
categoryFilter.addEventListener('change', filterAndRender);

function filterAndRender() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  
  filteredData = webData.filter(web => {
    const matchCategory = category === 'all' || web.category.toLowerCase() === category.toLowerCase();
    const matchName = web.name.toLowerCase().includes(keyword);
    return matchCategory && matchName;
  });
  
  renderWeb(filteredData);
}

// Tambah website baru
document.getElementById('addWeb').addEventListener('click', () => {
  const name = document.getElementById('newName').value.trim();
  const desc = document.getElementById('newDesc').value.trim();
  const url = document.getElementById('newUrl').value.trim();
  const category = document.getElementById('newCategory').value.trim();
  
  if (name && desc && url && category) {
    if (!isValidUrl(url)) {
      showToast('URL tidak valid!');
      return;
    }
    
    webData.push({ name, description: desc, url, category });
    localStorage.setItem('webData', JSON.stringify(webData));
    renderWeb(webData);
    showToast('Website berhasil ditambahkan!');
    
    clearInputs();
  } else {
    showToast('Mohon isi semua field!');
  }
});

// Validasi URL sederhana
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Reset input
function clearInputs() {
  document.getElementById('newName').value = '';
  document.getElementById('newDesc').value = '';
  document.getElementById('newUrl').value = '';
  document.getElementById('newCategory').value = '';
}

// Toggle Mode dengan Local Storage
toggleMode.addEventListener('click', () => {
  if (body.classList.contains('bg-gray-900')) {
    setLightMode();
    localStorage.setItem('mode', 'light');
  } else {
    setDarkMode();
    localStorage.setItem('mode', 'dark');
  }
});

function setLightMode() {
  body.classList.replace('bg-gray-900', 'bg-white');
  body.classList.replace('text-white', 'text-gray-900');
}

function setDarkMode() {
  body.classList.replace('bg-white', 'bg-gray-900');
  body.classList.replace('text-gray-900', 'text-white');
}

// Load data saat pertama
loadData();
