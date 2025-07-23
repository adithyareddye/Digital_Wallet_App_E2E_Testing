import { Page, Locator } from '@playwright/test';
import { APP_CONSTANTS } from '../utils/app.constants'

export class RegistrationPage {
  private emailField: Locator;
  private passwordField: Locator;
  private phoneField: Locator;
  private createAccountButton: Locator;

  constructor(private page: Page) {
    this.emailField = page.getByPlaceholder('Enter your email');
    this.passwordField = page.getByPlaceholder('Enter your password (min 6 characters)');
    this.phoneField = page.getByPlaceholder('Enter your phone number');
    this.createAccountButton = page.getByRole('button', { name: /create account/i });
  }

  async navigate() {
    await this.page.goto(APP_CONSTANTS.baseURL);
  }

  async fillRegistrationForm(email: string, password: string, phone: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.phoneField.fill(phone);
  }

  async submitForm() {
    await this.createAccountButton.click();
  }

  getEmailValidationMsg() {
    return this.emailField.evaluate(el => (el as HTMLInputElement).validationMessage);
  }

  getPasswordValidationMsg() {
    return this.passwordField.evaluate(el => (el as HTMLInputElement).validationMessage);
  }

  getPhoneValidationMsg() {
    return this.phoneField.evaluate(el => (el as HTMLInputElement).validationMessage);
  }

  getPageTitle() {
    return this.page.title();
  }

  getErrorAlert() {
    return this.page.locator('.alert.alert-error');
  }

  getCurrentUrl() {
    return this.page.url();
  }
}