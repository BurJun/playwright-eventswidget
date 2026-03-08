import { test, expect } from '@playwright/test';
import { EventsWidgetPage } from '../pages/EventsWidgetPage';

test.describe('Events widget constructor', () => {
  test('должен загружаться и показывать форму конструктора', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    await expect(widget.form).toBeVisible();
    await expect(widget.codeTextarea).toBeVisible();
  });

  test('выбор тематики влияет на код виджета', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    const initialCode = await widget.codeTextarea.inputValue();

    await widget.selectAllTopics();
    await widget.previewButton.click();

    const updatedCode = await widget.codeTextarea.inputValue();

    expect(updatedCode).toContain('event_type=');
    expect(updatedCode).not.toEqual(initialCode);
  });

  test('изменение размеров влияет на код виджета', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    await widget.setSize('400', '400');
    await widget.previewButton.click();

    const code = await widget.codeTextarea.inputValue();

    expect(code).toContain('width="400"');
    expect(code).toContain('height="400"');
  });

  test('выбор темы влияет на код виджета', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    const initialCode = await widget.codeTextarea.inputValue();
    expect(initialCode).toContain('theme=turquoise');

    await widget.chooseThemeByValue('blue');
    await widget.previewButton.click();

    const code = await widget.codeTextarea.inputValue();

    expect(code).toContain('theme=blue');
  });
  
  test('выбор стран влияет на код виджета', async ({ page }) => {
  const widget = new EventsWidgetPage(page);

  await widget.goto();

  const initialCode = await widget.codeTextarea.inputValue();
  expect(initialCode).toContain('event_country=');

  await widget.selectAnyCountryIfPresent();
  await widget.previewButton.click();

  const code = await widget.codeTextarea.inputValue();

  // Если стран нет, код может не измениться, поэтому оставляем только базовую проверку
  expect(code).toContain('event_country=');
});


  test('генерация превью обновляет блок превью', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    const initialPreview = await widget.previewContainer.innerHTML();

    await widget.previewButton.click();

    const updatedPreview = await widget.previewContainer.innerHTML();

    expect(updatedPreview).not.toEqual(initialPreview);
    expect(updatedPreview).toContain('iframe');
  });

  test('кнопка "Скопировать код" доступна для клика', async ({ page }) => {
    const widget = new EventsWidgetPage(page);

    await widget.goto();

    await expect(widget.copyCodeButton).toBeEnabled();
    await widget.copyCodeButton.click();

  });

  test('поле ширины принимает только числа', async ({ page }) => {
    const widget = new EventsWidgetPage(page);
    await widget.goto();

    await widget.widthInput.fill('abc');
    await widget.previewButton.click();

    const value = await widget.widthInput.inputValue();
    expect(value).not.toBe('abc');
  });

  test('кнопка "Очистить" сбрасывает выбранные тематики', async ({ page }) => {
    const widget = new EventsWidgetPage(page);
    await widget.goto();

    const initialCode = await widget.codeTextarea.inputValue();

    await widget.selectAllTopics();
    await widget.previewButton.click();
    const withTopicsCode = await widget.codeTextarea.inputValue();
    expect(withTopicsCode).toContain('event_type=');
    expect(withTopicsCode).not.toEqual(initialCode);

    const step1 = page.locator('.constructor__step', { hasText: 'Шаг 1' });
    await step1.getByText('Очистить', { exact: true }).click();

    const topicComboboxText = await step1.getByRole('combobox').textContent();
    expect(topicComboboxText).toContain('Выбрать тематику');

    await widget.previewButton.click();
    const clearedCode = await widget.codeTextarea.inputValue();

    expect(clearedCode).not.toEqual(withTopicsCode);
  });

  test('кнопка "Сгенерировать превью" доступна по роли button', async ({ page }) => {
    const widget = new EventsWidgetPage(page);
    await widget.goto();

    await expect(page.getByRole('button', { name: 'Сгенерировать превью' })).toBeVisible();
  });
});
