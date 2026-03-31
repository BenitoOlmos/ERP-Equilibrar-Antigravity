const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Respaldo_ERP_Global_2026-03-31 (1).json');

console.log('Intentando restaurar base de datos online con archivo:', filePath);

if (!fs.existsSync(filePath)) {
    console.error('El archivo no existe en la ruta.');
    process.exit(1);
}

// Custom simple multipart encoder for Node fetch since native FormData from file stream in Node can be tricky
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const fileContent = fs.readFileSync(filePath);
let prePayload = `--${boundary}\r\n`;
prePayload += `Content-Disposition: form-data; name="database"; filename="RespaldoDB.json"\r\n`;
prePayload += `Content-Type: application/json\r\n\r\n`;
const postPayload = `\r\n--${boundary}--\r\n`;

const payload = Buffer.concat([
    Buffer.from(prePayload, 'utf-8'),
    fileContent,
    Buffer.from(postPayload, 'utf-8')
]);

fetch('https://login.clinicaequilibrar.cl/api/data/backup/import', {
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: payload
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(({ status, text }) => {
    if (status >= 400) console.error('Error (' + status + '):', text);
    else console.log('Exito:', text);
})
.catch(err => {
    console.error('Caught error:', err);
});
