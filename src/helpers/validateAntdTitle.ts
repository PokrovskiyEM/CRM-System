export const validateAntdTitle = (_: unknown, title?: string) => {
  const trimTitle = title?.trim()

  if (!trimTitle) {
    return Promise.reject(new Error('Это поле не может быть пустым'))
  }

  if (trimTitle.length < 2) {
    return Promise.reject(new Error('Минимальная длина текста 2 символа'))
  }

  if (trimTitle.length > 64) {
    return Promise.reject(new Error('Максимальная длина текста 64 символа'))
  }

  return Promise.resolve()
}