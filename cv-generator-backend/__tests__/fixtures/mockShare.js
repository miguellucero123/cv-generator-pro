/**
 * Mock data for Share tests
 */

const mockShareId = '507f1f77bcf86cd799439015';
const mockCVId = '507f1f77bcf86cd799439012';
const mockUserId = '507f1f77bcf86cd799439011';

const mockShareData = {
  cvId: mockCVId,
  userId: mockUserId,
  token: 'share_token_abc123xyz789',
  isPublic: true,
  password: null, // Sin protección
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
  views: 12,
  downloads: 3,
};

const mockShare = {
  _id: mockShareId,
  ...mockShareData,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

const mockShareWithPassword = {
  ...mockShare,
  password: 'hashedPassword123SecureShare',
};

const mockShareExpired = {
  ...mockShare,
  expiresAt: new Date(Date.now() - 1000), // Expirado
};

const mockShareStats = {
  shareId: mockShareId,
  cvId: mockCVId,
  totalViews: 12,
  totalDownloads: 3,
  lastViewed: new Date(),
  viewsByDay: [
    { date: '2024-01-15', views: 5 },
    { date: '2024-01-14', views: 3 },
    { date: '2024-01-13', views: 2 },
    { date: '2024-01-12', views: 2 },
  ],
};

const mockShareRequest = {
  expiresIn: '7d',
  password: null,
};

const mockShareRequestWithPassword = {
  expiresIn: '14d',
  password: 'SecurePassword123',
};

const mockShareAccessRequest = {
  shareId: mockShareId,
  password: null, // Sin contraseña
};

const mockShareAccessRequestWithPassword = {
  shareId: mockShareId,
  password: 'SecurePassword123',
};

module.exports = {
  mockShareId,
  mockCVId,
  mockUserId,
  mockShareData,
  mockShare,
  mockShareWithPassword,
  mockShareExpired,
  mockShareStats,
  mockShareRequest,
  mockShareRequestWithPassword,
  mockShareAccessRequest,
  mockShareAccessRequestWithPassword,
};
