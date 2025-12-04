// Test setup and configuration
// This file runs before all tests

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(10000);
