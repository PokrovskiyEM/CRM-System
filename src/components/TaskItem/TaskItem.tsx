import { useState } from "react";
import { todosApi } from "../../api/todosApi";
import { validateInput } from "../../helpers/validateInput";
import type { Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  task: Todo
  onTaskUpdated: () => Promise<void>
}

export const TaskItem = ({ task, onTaskUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>(task.title)
  const [editError, setEditError] = useState('')

  const toggleHandler = async () => {
    try {
      await todosApi.updateTask(task.id, {
        isDone: !task.isDone
      })
      await onTaskUpdated()

    } catch (error) {
      console.log(`Ошибка - ${error}`);
    }
  }

  const deleteHandler = async () => {
    try {
      await todosApi.deleteTask(task.id)
      await onTaskUpdated()
    } catch (error) {
      console.log(`Ошибка - ${error}`);
    }
  }

  const saveEditing = async () => {
    const error = validateInput(newTitle)
    if (error) {
      setEditError(error)
      return
    }

    try {
      const trimTitle = newTitle.trim()
      await todosApi.updateTask(task.id, { title: trimTitle })
      await onTaskUpdated()
      setIsEdit(false)
      setEditError('')
    } catch (error) {
      console.log(`Ошибка - ${error}`);
    }
  }

  const startEditing = () => {
    setNewTitle(task.title)
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
        checked={task.isDone}
        onChange={toggleHandler}
      />

      {!isEdit
        ? (
          <p className={`${styles.title} ${task.isDone ? styles.checkedTitle : ''}`}>{task.title}</p>
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
}