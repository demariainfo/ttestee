import { hashPassword, isValidPassword } from './password';

// Mock password
const password = 'test';
let hashedPassword: string;

describe('Password', () => {
  it('should hash a password', () => {
    hashedPassword = hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
  });

  it('should validate a password', () => {
    const isValid = isValidPassword(hashedPassword, password);
    expect(isValid).toBeTruthy();
  });
});
