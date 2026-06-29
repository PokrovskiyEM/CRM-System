import { beforeEach, describe, expect, test, vi } from "vitest";
import { render } from 'vitest-browser-react'
import { AddTodoForm } from '../AddTodoForm'

vi.mock("@/entities/todo/api/todos-public-api", () => ({
  addTodo: vi.fn(),
}));

import { addTodo } from "@/entities/todo/api/todos-public-api";

const mockedAddTodo = vi.mocked(addTodo);

describe('AddTodoForm', () => {
  const onTodosUpdated = vi.fn().mockResolvedValue(undefined);

  let screen: Awaited<ReturnType<typeof render>>;
  let input: ReturnType<typeof screen.getByPlaceholder>;
  let button: ReturnType<typeof screen.getByText>;

  beforeEach(async () => {
    vi.clearAllMocks();
    screen = await render(<AddTodoForm onTodosUpdated={onTodosUpdated} />)
    input = screen.getByPlaceholder('Задача, которую необходимо выполнить...')
    button = screen.getByText('Создать')
  })

  test('Рендер input и button', async () => {
    await expect.element(input).toBeInTheDocument()
    await expect.element(button).toBeInTheDocument()
  })

  describe('Проверка валидации input', () => {
    test('отображение ошибки при пустом поле', async () => {
      await button.click()
      await expect.element(screen.getByText('Это поле не может быть пустым')).toBeInTheDocument()
    })
    test('отображение ошибки при одном символе', async () => {
      await input.fill('a')
      await button.click()
      await expect.element(screen.getByText('Минимальная длина текста 2 символа')).toBeInTheDocument()
    })
    test('отображение ошибки при 65 символах', async () => {
      await input.fill('Эта строка содержит в себе ровно шестьдесят пять знаков с точкой.')
      await button.click()
      await expect.element(screen.getByText('Максимальная длина текста 64 символа')).toBeInTheDocument()
    })
    test('отображение ошибки при попытке обойти trim()', async () => {
      await input.fill('  a')
      await button.click()
      await expect.element(screen.getByText('Минимальная длина текста 2 символа')).toBeInTheDocument()
    })
  })

  describe('Проверка успешного вызова функции addTodo', () => {
    test('Успешный вызов', async () => {
      mockedAddTodo.mockResolvedValue({
        id: 1,
        title: 'Купить молоко',
        created: '2026-06-29T12:12:51.520886Z',
        isDone: false
      })
      await input.fill('Купить молоко')
      await button.click()

      expect(mockedAddTodo).toHaveBeenCalledWith({
        title: 'Купить молоко'
      })

      expect(mockedAddTodo).toHaveBeenCalledTimes(1);
      expect(onTodosUpdated).toHaveBeenCalledTimes(1)

      await expect.element(input).toHaveValue('')
    })

    test('Вызов с ошибкой', async () => {
      const error = new Error('999')
      mockedAddTodo.mockRejectedValue(error)

      await input.fill('Купить молоко')
      await button.click()

      expect(mockedAddTodo).toHaveBeenCalledTimes(1);

      await expect.element(screen.getByText(/Ошибка/i)).toBeInTheDocument();

      expect(onTodosUpdated).not.toHaveBeenCalled();
    })
  })
})