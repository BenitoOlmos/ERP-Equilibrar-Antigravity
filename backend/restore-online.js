const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const filePath = path.join(__dirname, 'Respaldo_ERP_Global_2026-03-31 (1).json');

console.log('Intentando restaurar base de datos online con archivo:', filePath);

if (!fs.existsSync(filePath)) {
    console.error('El archivo no existe en la ruta.');
    process.exit(1);
}

const form = new FormData();
form.append('database', fs.createReadStream(filePath));

axios.post('https://login.clinicaequilibrar.cl/api/db/import', form, {
    headers: {
        ...form.getHeaders()
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
}).then(res => {
    console.log('Exito:', res.data);
}).catch(err => {
    console.error('Error:', err.response ? err.response.data : err.message);
});
