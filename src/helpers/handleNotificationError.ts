import { notification } from "antd"

export const handleNotificationError = (error: unknown) => {
  notification.error({
    title: `Ошибка - ${error}`
  })
}