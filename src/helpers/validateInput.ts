export const validateInput = (title: string): string | null => {
  if (title.length === 0) return 'Это поле не может быть пустым'
  if (title.length < 2) return 'Минимальная длина текста 2 символа'
  if (title.length > 64) return 'Максимальная длина текста 64 символа'
  return null
}