import bcrypt from 'bcrypt';

// Hash hiện tại trong database
const hashInDB = '$2b$10$mdWMgkITR4uJ9MHPnu0Wnuc7Kd5xbKgRxCfYDyYaO7V6VhottJyMe';
const password = 'password123';

console.log('Testing password:', password);
console.log('Hash in DB:', hashInDB);

// Kiểm tra
try {
  const result = await bcrypt.compare(password, hashInDB);
  console.log('Password match:', result);
  
  // Tạo hash mới để so sánh
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash:', newHash);
  
  // So sánh với hash mới
  const matchWithNew = await bcrypt.compare(password, newHash);
  console.log('Match with new hash:', matchWithNew);
} catch (error) {
  console.error('Error:', error);
}
