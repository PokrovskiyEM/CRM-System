import { test, expect } from '@playwright/test';

function extractCount(text: string | null): number {
  const match = text?.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

test('addTodo', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Логин').fill('admin');
  await page.getByLabel('Пароль').fill('123456');
  await page.getByText('Войти').click()

  const allTab = page.getByText(/^Все/)
  const inWorkTab = page.getByText(/^В работе/)

  await expect(allTab).toBeVisible();
  await expect(inWorkTab).toBeVisible();

  const countAllBefore = extractCount(await allTab.textContent());
  const countInWorkBefore = extractCount(await inWorkTab.textContent());

  const title = `E2E ${Date.now()}`;

  await page.getByPlaceholder('Задача, которую необходимо выполнить...').fill(title)
  await page.getByText('Создать').click()

  await expect.poll(async () => {
    return extractCount(await allTab.textContent());
  }).toBe(countAllBefore + 1);

  await expect.poll(async () => {
    return extractCount(await inWorkTab.textContent());
  }).toBe(countInWorkBefore + 1);

  await expect(page.getByText(title)).toBeVisible();

  const todoItem = page.getByTestId('todo-item').filter({ hasText: title });

  await todoItem.getByTestId('edit-button').click()

  const editInput = page.getByTestId("edit-input");
  await expect(editInput).toBeVisible();

  const editedTitle = `Edited - ${Date.now()}`
  await editInput.fill(editedTitle);

  const saveButton = page.getByTestId('save-button');
  await expect(saveButton).toBeVisible();
  await saveButton.click()

  await expect(page.getByText(editedTitle)).toBeVisible();

  const editedTodo = page.getByTestId('todo-item').filter({ hasText: editedTitle })
  await editedTodo.getByTestId('delete-button').click()

  await expect(editedTodo).toHaveCount(0);

  await expect.poll(async () => {
    return extractCount(await allTab.textContent());
  }).toBe(countAllBefore);

  await expect.poll(async () => {
    return extractCount(await inWorkTab.textContent());
  }).toBe(countInWorkBefore);
});