// Script de inicialización de MongoDB
// Crea la base de datos y un usuario de demostración

// Conectar a la base de datos cv-generator
db = db.getSiblingDB('cv-generator');

// Crear usuario de demo con password hasheado (bcrypt hash de "demo123")
// El hash corresponde a la contraseña: demo123
db.users.insertOne({
  name: "Demo User",
  email: "demo@metgo3d.com",
  // Hash bcrypt de "demo123" (10 rounds)
  password: "$2a$10$qGX0nhG.5PiebMe8rczOAu0QERC5uvdNximQnEXPNT5yCBvQhQIv2",
  role: "user",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Crear usuario admin
db.users.insertOne({
  name: "Admin",
  email: "admin@metgo3d.com",
  // Hash bcrypt de "admin123" (10 rounds)
  password: "$2a$10$Lg2d6EZnDdlE96Z9BlysD.FnyTD1Mpv9YTzAuDDQYMBY1/mIBNjW2",
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Base de datos cv-generator inicializada');
print('📧 Usuario demo: demo@metgo3d.com / demo123');
print('📧 Usuario admin: admin@metgo3d.com / admin123');
