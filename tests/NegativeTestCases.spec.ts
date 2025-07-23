import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { APP_CONSTANTS } from '../utils/app.constants';
import { TestData } from '../utils/test.data';


test.describe('User Registration Form - Field Validations', () => {
  test('Validate error messages for empty required fields', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();

    await registrationPage.submitForm();
    const emailMsg = await registrationPage.getEmailValidationMsg();
    expect(emailMsg).toBe('Please fill out this field.');

    await registrationPage.fillRegistrationForm(TestData.generateEmail(), '', '');
    await registrationPage.submitForm();
    const passwordMsg = await registrationPage.getPasswordValidationMsg();
    expect(passwordMsg).toBe('Please fill out this field.');

    await registrationPage.fillRegistrationForm(TestData.generateEmail(), TestData.password, '');
    await registrationPage.submitForm();
    const phoneMsg = await registrationPage.getPhoneValidationMsg();
    expect(phoneMsg).toBe('Please fill out this field.');
  });

  test('Validate error message for invalid email format', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();

    await registrationPage.fillRegistrationForm(TestData.invalidEmail, TestData.password, TestData.generatePhone());
    await registrationPage.submitForm();

    const emailValidationMsg = await registrationPage.getEmailValidationMsg();
    expect(emailValidationMsg).toContain('@');
  });

  test('Validate error message for short password', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();

    await registrationPage.fillRegistrationForm(TestData.generateEmail(), TestData.shortPassword, TestData.generatePhone());
    await registrationPage.submitForm();

    const passwordMsg = await registrationPage.getPasswordValidationMsg();
    expect(passwordMsg.toLowerCase()).toContain('lengthen');
  });

  test('Validate custom error message for invalid phone number format', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();

    await registrationPage.fillRegistrationForm(TestData.generateEmail(), TestData.password, TestData.invalidPhone);
    await registrationPage.submitForm();

    const error = registrationPage.getErrorAlert();
    await expect(error).toHaveText(APP_CONSTANTS.messages.invalidPhone);
    await expect(await registrationPage.getCurrentUrl()).toBe(APP_CONSTANTS.baseURL);
  });
});