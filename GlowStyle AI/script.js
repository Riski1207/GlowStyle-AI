const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultArea = document.getElementById('resultArea');

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Ambil sampel warna di tengah gambar (asumsi area wajah)
            const pixelData = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
            const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            
            analyzeColor(pixelData[0], pixelData[1], pixelData[2], hex);
            resultArea.classList.remove('hidden');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function analyzeColor(r, g, b, hex) {
    const skinCircle = document.getElementById('skinToneCircle');
    const toneName = document.getElementById('toneName');
    const palette = document.getElementById('colorPalette');
    
    skinCircle.style.backgroundColor = hex;
    palette.innerHTML = '';

    // Logika Sederhana: Warm vs Cool berdasarkan nilai Red dan Blue
    let type = "";
    let colors = [];

    if (r > b + 20) {
        type = "Warm Undertone (Kuning/Sawo Matang)";
        colors = ['#E64A19', '#FFB300', '#556B2F', '#8B4513']; // Terracotta, Mustard, Olive, Brown
    } else {
        type = "Cool Undertone (Putih/Cerah)";
        colors = ['#1E88E5', '#8E24AA', '#D81B60', '#C0C0C0']; // Royal Blue, Purple, Magenta, Silver
    }

    toneName.innerText = type;
    
    colors.forEach(color => {
        const div = document.createElement('div');
        div.className = "w-10 h-10 rounded-lg border shadow-sm";
        div.style.backgroundColor = color;
        palette.appendChild(div);
    });
}