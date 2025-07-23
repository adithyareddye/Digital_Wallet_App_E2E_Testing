import { Page, Locator } from '@playwright/test';
import path from 'path';

export class KYCVerificationPage {
  private uploadInput: Locator;
  private status: Locator;
  private statusWaiting: Locator;
  private statusInvalid: Locator;
  private alertSuccess: Locator;
  private alertInfo: Locator;
  private sendPaymentBtn: Locator;

  constructor(private page: Page) {
    this.uploadInput = page.locator('input[type="file"]');
    this.status = page.locator('.status');
    this.statusWaiting = page.locator('.status.waiting');
    this.statusInvalid = page.locator('.status.invalid');
    this.alertSuccess = page.locator('.alert-success');
    this.alertInfo = page.locator('.alert-info');
    this.sendPaymentBtn = page.getByRole('button', { name: 'Send Payment' });
  }

  async uploadDocument(fileName: string) {
    //const filePath = path.resolve(__dirname, `..\../testdata/${fileName}`);
    const filePath = path.resolve(process.cwd(), 'testdata', fileName);
    await this.uploadInput.setInputFiles(filePath);
  }

  getStatus() {
    return this.status;
  }

  getStatusWaiting() {
    return this.statusWaiting;
  }

  getStatusInvalid() {
    return this.statusInvalid;
  }

  getAlertSuccess() {
    return this.alertSuccess;
  }

  getAlertInfo() {
    return this.alertInfo;
  }

  getSendPaymentButton() {
    return this.sendPaymentBtn;
  }
}