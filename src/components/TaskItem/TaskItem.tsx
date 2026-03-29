import { memo, useState } from "react";
import { deleteTodo, updateTodos } from "../../api/todosApi";
import { validateInput } from "../../helpers/validateInput";
import type { Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTaskUpdated: () => Promise<void>
}

export const TaskItem = memo(({ todo, onTaskUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>(todo.title)
  const [editError, setEditError] = useState('')

  const toggleHandler = async () => {
    try {
      await updateTodos(todo.id, {
        isDone: !todo.isDone
      })
      await onTaskUpdated()

    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const deleteHandler = async () => {
    try {
      await deleteTodo(todo.id)
      await onTaskUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const saveEditing = async () => {
    const trimTitle = newTitle.trim()
    const error = validateInput(trimTitle)
    if (error) {
      setEditError(error)
      return
    }

    try {
      await updateTodos(todo.id, { title: trimTitle })
      await onTaskUpdated()
      setIsEdit(false)
      setEditError('')
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const startEditing = () => {
    setNewTitle(todo.title)
    setEditError('')
    setIsEdit(true)
  }

  const cancelEditing = () => {
    setIsEdit(false)
    setEditError('')
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
          <p className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>{todo.title}</p>
        )
        : (
          <>
            <input
              className={styles.input}
              type="text"
              value={newTitle}
              maxLength={65}
              autoFocus
              onChange={(e) => {
                setNewTitle(e.target.value)
                setEditError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing()
                if (e.key === 'Escape') cancelEditing()
              }}
            />
            {editError && (
              <span className={styles.error}>*{editError}</span>
            )}
          </>
        )
      }
      <div className={styles.controls}>
        {!isEdit
          ? (
            <>
              <button
                className={`${styles.controlButton} ${styles.edit}`}
                onClick={startEditing}
              ></button>
              <button
                className={`${styles.controlButton} ${styles.delete}`}
                onClick={deleteHandler}
              ></button>
            </>
          )
          : (
            <>
              <button
                className={`${styles.controlButton} ${styles.save}`}
                onClick={saveEditing}
              ></button>
              <button
                className={`${styles.controlButton} ${styles.cancel}`}
                onClick={cancelEditing}
              ></button>
            </>
          )
        }
      </div>
    </li>
  )
})