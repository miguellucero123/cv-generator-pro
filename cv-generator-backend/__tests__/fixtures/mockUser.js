/**
 * Mock data for User tests
 */

const mockUserId = '507f1f77bcf86cd799439011';

const mockUserData = {
  name: 'Juan Pérez García',
  email: 'juan.perez@example.com',
  password: 'hashedPassword123', // Pre-hashed en DB
};

const mockUser = {
  _id: mockUserId,
  ...mockUserData,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  generateAuthToken: jest.fn().mockReturnValue('mock_jwt_token_12345'),
  comparePassword: jest.fn().mockResolvedValue(true),
  toJSON: jest.fn().mockReturnValue({
    _id: mockUserId,
    name: mockUserData.name,
    email: mockUserData.email,
  }),
};

const mockUserWithBadPassword = {
  ...mockUser,
  comparePassword: jest.fn().mockResolvedValue(false),
};

const mockUserRegister = {
  name: 'Nueva Persona',
  email: 'nueva@example.com',
  password: 'SecurePass123!',
};

const mockUserUpdate = {
  name: 'Juan Pérez Actualizado',
  phone: '+34 123 456 789',
  profilePicture: 'https://example.com/photo.jpg',
};

const mockUserPasswordChange = {
  currentPassword: 'hashedPassword123',
  newPassword: 'NewSecurePass456!',
  confirmPassword: 'NewSecurePass456!',
};

module.exports = {
  mockUserId,
  mockUserData,
  mockUser,
  mockUserWithBadPassword,
  mockUserRegister,
  mockUserUpdate,
  mockUserPasswordChange,
};
