export const validateInput = (min: number, max: number) => (_: unknown, title?: string) => {
  const trimTitle = title?.trim()

  if (!trimTitle) {
    return Promise.reject(new Error('Это поле не может быть пустым'))
  }

  if (trimTitle.length < min) {
    return Promise.reject(new Error(`Минимальная длина текста ${min} символа`))
  }

  if (trimTitle.length > max) {
    return Promise.reject(new Error(`Максимальная длина текста ${max} символа`))
  }

  return Promise.resolve()
}