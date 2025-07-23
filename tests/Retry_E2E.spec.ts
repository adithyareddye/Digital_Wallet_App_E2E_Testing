import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { KYCVerificationPage } from '../pages/KYCVerificationPage';
import { APP_CONSTANTS } from '../utils/app.constants';
import { TestData } from '../utils/test.data';

test('Retry Mechanism: Upload wrong document and retry with a valid one', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const kycPage = new KYCVerificationPage(page);

  const email = TestData.generateEmail();
  const password = TestData.password;
  const phone = TestData.generatePhone();
  const validFile = TestData.validDocument;
  const invalidFile = TestData.invalidDocument;

  await registrationPage.navigate();

  await test.step('Register new user', async () => {
    await registrationPage.fillRegistrationForm(email, password, phone);
    await registrationPage.submitForm();

    // Fix: Await first, then assert without .resolves
    const title = await registrationPage.getPageTitle();
    expect(title).toBe(APP_CONSTANTS.pageTitle);
  });

  await test.step('Verify initial state: no documents uploaded', async () => {
    await expect(kycPage.getStatusWaiting()).toHaveText(APP_CONSTANTS.messages.noDocs);
  });

  await test.step('Upload invalid document', async () => {
    await kycPage.uploadDocument(invalidFile);
  });

  await test.step('Check for failed verification', async () => {
    await expect(kycPage.getStatus()).toHaveText(APP_CONSTANTS.messages.underVerification, { timeout: 10000 });
    await expect(kycPage.getStatusInvalid()).toHaveText(APP_CONSTANTS.messages.failed, { timeout: 25000 });
  });

  await test.step('Retry with valid document', async () => {
    await kycPage.uploadDocument(validFile);
  });

  await test.step('Check for successful verification after retry', async () => {
    await expect(kycPage.getStatus()).toHaveText(APP_CONSTANTS.messages.underVerification, { timeout: 10000 });
    await expect(kycPage.getStatus()).toHaveText(APP_CONSTANTS.messages.verified, { timeout: 30000 });
  });

  await test.step('Check KYC completion and uploaded files list', async () => {
    //await expect(kycPage.getAlertSuccess()).toContainText(APP_CONSTANTS.messages.kycSuccess);
    await expect(kycPage.getAlertSuccess().first()).toContainText(APP_CONSTANTS.messages.kycSuccess);
    await expect(kycPage.getAlertInfo().first()).toContainText(invalidFile);
    await expect(kycPage.getAlertInfo().last()).toContainText(validFile);
    await expect(kycPage.getSendPaymentButton()).toBeVisible();
  });
});
