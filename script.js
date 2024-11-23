document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phoneNumber');
    const messageInput = document.getElementById('message');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadSVGBtn = document.getElementById('downloadSVG');
    const downloadPNGBtn = document.getElementById('downloadPNG');
    const newLinkBtn = document.getElementById('newLinkBtn');
    const themeToggle = document.getElementById('themeToggle');
    const inputScreen = document.getElementById('inputScreen');
    const resultScreen = document.getElementById('resultScreen');
    const generatedLinkInput = document.getElementById('generatedLink');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        updateQRCode();
    });

    // Phone number formatting
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                if (value.length > 10) {
                    value = `${value.slice(0, 10)}-${value.slice(10)}`;
                }
            }
            e.target.value = value;
        }
    });

    // Generate WhatsApp link
    function generateWhatsAppLink() {
        const phone = phoneInput.value.replace(/\D/g, '');
        const message = encodeURIComponent(messageInput.value);
        return `https://wa.me/55${phone}${message ? '?text=' + message : ''}`;
    }

    // Generate and update QR code
    function updateQRCode() {
        const link = generateWhatsAppLink();
        const qr = qrcode(0, 'L');
        qr.addData(link);
        qr.make();
        
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = qr.createSvgTag({
            scalable: true,
            margin: 4,
            cellSize: 8
        });
        
        generatedLinkInput.value = link;
    }

    // Generate link button click
    generateBtn.addEventListener('click', () => {
        const phone = phoneInput.value.replace(/\D/g, '');
        if (phone.length !== 11) {
            alert('Por favor, insira um número de telefone válido com 11 dígitos');
            return;
        }
        
        inputScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        updateQRCode();
    });

    // Copy link button click
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(generatedLinkInput.value);
            copyBtn.classList.add('copied');
            setTimeout(() => copyBtn.classList.remove('copied'), 2000);
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
        }
    });

    // Download QR code functions
    function downloadQR(format) {
        const svg = document.querySelector('#qrcode svg');
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        
        if (format === 'svg') {
            const blob = new Blob([svgStr], { type: 'image/svg+xml' });
            downloadBlob(blob, 'whatsapp-qr.svg');
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    downloadBlob(blob, 'whatsapp-qr.png');
                });
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgStr);
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadSVGBtn.addEventListener('click', () => downloadQR('svg'));
    downloadPNGBtn.addEventListener('click', () => downloadQR('png'));

    // Generate new link button click
    newLinkBtn.addEventListener('click', () => {
        phoneInput.value = '';
        messageInput.value = '';
        resultScreen.classList.add('hidden');
        inputScreen.classList.remove('hidden');
    });
});
