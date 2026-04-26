import { message } from "antd"

export const handleError = (error: unknown) => {
  message.error(`Ошибка - ${error}`)
}