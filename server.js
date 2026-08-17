const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'usuarios.xlsx');
const APK_PATH = path.join(__dirname, 'public', 'downloads', 'food-shooping.apk');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    require('./scripts/init-db.js');
  }
}

function readUsers() {
  ensureDatabase();
  const workbook = XLSX.readFile(DB_PATH);
  const sheet = workbook.Sheets['Usuarios'];
  return XLSX.utils.sheet_to_json(sheet);
}

function writeUsers(users) {
  ensureDatabase();
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(users);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Usuarios');
  XLSX.writeFile(workbook, DB_PATH);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/login', (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Ingresa un correo válido' });
  }

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  let isNew = false;

  if (!user) {
    isNew = true;
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user = {
      id: nextId,
      email: normalizedEmail,
      nombre: normalizedEmail.split('@')[0],
      fecha_registro: new Date().toISOString()
    };
    users.push(user);
    writeUsers(users);
  }

  res.json({
    success: true,
    message: isNew ? '¡Cuenta creada y sesión iniciada!' : '¡Bienvenido de nuevo!',
    user: { id: user.id, email: user.email, nombre: user.nombre },
    isNew
  });
});

app.get('/api/users', (_req, res) => {
  const users = readUsers().map(({ id, email, nombre, fecha_registro }) => ({
    id, email, nombre, fecha_registro
  }));
  res.json({ success: true, users });
});

app.get('/api/download/apk', (_req, res) => {
  if (fs.existsSync(APK_PATH)) {
    res.download(APK_PATH, 'food-shooping.apk');
  } else {
    res.status(404).json({
      success: false,
      message: 'APK no disponible aún. Ejecuta npm run build:apk para generarlo.'
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureDatabase();
app.listen(PORT, () => {
  console.log(`🍔 Food Shooping corriendo en http://localhost:${PORT}`);
});
