import { memo, useState, type SubmitEvent } from "react";
import { deleteTodo, updateTodos } from "../../api/todosApi";
import DeleteIcon from '../../assets/DeleteIcon.svg';
import EditIcon from '../../assets/EditIcon.svg';
import SaveIcon from '../../assets/save.svg';
import UndoIcon from '../../assets/undo.svg';
import { validateTodoTitleInput } from "../../helpers/validateTodoTitleInput";
import type { Todo } from "../../types/todo";
import { Checkbox } from "../../ui-kit/Checkbox/Checkbox";
import { IconButton } from "../../ui-kit/IconButton/IconButton";
import { TextInput } from "../../ui-kit/TextInput/TextInput";
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
      <Checkbox
        checked={todo.isDone}
        onChange={toggleHandler}
        variant="circle"
      />
      {!isEdit
        ? (
          <>
            <p className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>{todo.title}</p>
            <div className={styles.controls}>
              <IconButton
                icon={EditIcon} onClick={startEditHandler}
              />
              <IconButton
                variant="danger" icon={DeleteIcon} onClick={deleteHandler}
              />
            </div>
          </>

        )
        : (
          <form
            className={styles.editForm}
            onSubmit={submitHandler}
          >
            <TextInput
              border="all"
              autoFocus
              value={title}
              onChange={(e) => { setTitle(e.target.value) }}
            />
            {editError && (
              <span className={styles.error}>*{editError}</span>
            )}
            <div className={styles.controls}>
              <IconButton
                variant="primary" type="submit" icon={SaveIcon}
              />
              <IconButton
                variant="secondary" icon={UndoIcon} onClick={cancelEditHandler}
              />
            </div>
          </form>
        )
      }
    </li >
  )
})