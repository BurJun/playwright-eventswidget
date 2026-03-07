import { expect, Locator, Page } from '@playwright/test';

export class EventsWidgetPage {
  readonly page: Page;
  readonly form: Locator;
  readonly topicSelect: Locator;
  readonly topicPopup: Locator;
  readonly countrySelect: Locator;
  readonly countryPopup: Locator;
  readonly widthInput: Locator;
  readonly heightInput: Locator;
  readonly previewButton: Locator;
  readonly codeTextarea: Locator;
  readonly previewContainer: Locator;
  readonly copyCodeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.form = page.locator('form.constructor__form');

    const step1 = page.locator('.constructor__step', { hasText: 'Шаг 1' });
    this.topicSelect = step1.locator('.checkselect');
    this.topicPopup = this.topicSelect.locator('.checkselect-popup');

    const step2 = page.locator('.constructor__step', { hasText: 'Шаг 2' });
    this.countrySelect = step2.locator('.checkselect');
    this.countryPopup = this.countrySelect.locator('.checkselect-popup');

    this.widthInput = page.locator('input[name="width"]');
    this.heightInput = page.locator('input[name="height"]');

    this.previewButton = page.locator('.constructor__preview button.button');
    this.codeTextarea = page.locator('#code');

    this.previewContainer = page.locator('#preview');
this.copyCodeButton = page.locator('#code-copy-button');
  }

  async goto() {
    await this.page.goto('https://dev.3snet.info/eventswidget/');
    await expect(this.form).toBeVisible();
  }

  async selectAllTopics() {
    await this.topicSelect.click();
    await expect(this.topicPopup).toBeVisible();
    await this.topicPopup.getByText('Выбрать все', { exact: true }).click();
  }

  async selectCountryByName(name: string) {
    await this.countrySelect.click();
    await expect(this.countryPopup).toBeVisible();
    await this.countryPopup.getByText(name, { exact: true }).click();
  }

  async setSize(width: string, height: string) {
    await this.widthInput.fill(width);
    await this.heightInput.fill(height);
  }

  async chooseThemeByValue(value: string) {
    const themeLabel = this.page
      .locator('.theme-line')
      .locator('label.radio')
      .filter({ has: this.page.locator(`input[name="theme"][value="${value}"]`) });

    await themeLabel.click();
  }
}
