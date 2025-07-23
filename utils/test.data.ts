export class TestData {
  static generateEmail(): string {
    return `user${Date.now()}@example.com`;
  }

  static generatePhone(): string {
    return `+1${Date.now().toString().slice(-10)}`;
  }

  static password = 'password124';
  static shortPassword = '123';
  static invalidEmail = 'invalidemail';
  static invalidPhone = 'abc123';

  static validDocument = 'valid_document.png';
  static invalidDocument = 'wrong_document.png';
}