export const validateInput = (text: string): string | null => {
  const trimTitle = text.trim()
  if (trimTitle.length === 0) return 'Это поле не может быть пустым'
  if (trimTitle.length < 2) return 'Минимальная длина текста 2 символа'
  if (trimTitle.length > 64) return 'Максимальная длина текста 64 символа'
  return null
}