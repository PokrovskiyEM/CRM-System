import { memo, useState, type SubmitEvent } from "react";
import { deleteTodo, updateTodos } from "../../api/todosApi";
import { validateTodoTitleInput } from "../../helpers/validateTodoTitleInput";
import type { Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTasksUpdated: () => Promise<void>
}

export const TaskItem = memo(({ todo, onTasksUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(todo.title)
  const [editError, setEditError] = useState('')

  const toggleHandler = async () => {
    try {
      await updateTodos(todo.id, {
        isDone: !todo.isDone
      })
      await onTasksUpdated()

    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const deleteHandler = async () => {
    try {
      await deleteTodo(todo.id)
      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const saveEditHandler = async () => {
    const trimTitle = title.trim()
    const error = validateTodoTitleInput(trimTitle)
    if (error) {
      setEditError(error)
      return
    }

    try {
      await updateTodos(todo.id, { title: trimTitle })

      setEditError('')
      setIsEdit(false)

      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const startEditHandler = () => {
    setTitle(todo.title)
    setEditError('')
    setIsEdit(true)
  }

  const cancelEditHandler = () => {
    setEditError('')
    setIsEdit(false)
  }

  const submitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    await saveEditHandler()
  }

  return (
    <li className={styles.item}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={todo.isDone}
        onChange={toggleHandler}
      />
      {!isEdit
        ? (
          <>
            <p className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>{todo.title}</p>
            <div className={styles.controls}>
              <button
                className={`${styles.controlButton} ${styles.edit}`}
                type="button"
                onClick={startEditHandler}
              />
              <button
                className={`${styles.controlButton} ${styles.delete}`}
                type="button"
                onClick={deleteHandler}
              />
            </div>
          </>

        )
        : (
          <form
            className={styles.editForm}
            onSubmit={submitHandler}
          >
            <input
              className={styles.input}
              type="text"
              value={title}
              autoFocus
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
            {editError && (
              <span className={styles.error}>*{editError}</span>
            )}
            <div className={styles.controls}>
              <button
                className={`${styles.controlButton} ${styles.save}`}
                type="submit"
              />
              <button
                className={`${styles.controlButton} ${styles.cancel}`}
                type="button"
                onClick={cancelEditHandler}
              />
            </div>
          </form>
        )
      }
    </li >
  )
})