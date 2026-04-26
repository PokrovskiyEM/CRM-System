import { Navigate, Route, Routes } from "react-router"
import { ProfilePage } from "../../pages/ProfilePage/ProfilePage"
import { TodoListPage } from "../../pages/TodoListPage/TodoListPage"
import { MainLayout } from "../layouts/MainLayout"

export const AppRouter = () => {
  return (
    <Routes >
      <Route path="/" element={<Navigate to="/todos" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/todos" element={<TodoListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}