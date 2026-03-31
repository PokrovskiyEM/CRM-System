import { Navigate, Route, Routes } from "react-router"
import { ProfilePage } from "../../pages/ProfilePage/TodoListPage"
import { TodoListPage } from "../../pages/TodoListPage/TodoListPage"

export const AppRouter = () => {
  return (
    <Routes >
      <Route path="/" element={<Navigate to="/todos" replace />} />
      <Route path="/todos" element={<TodoListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}