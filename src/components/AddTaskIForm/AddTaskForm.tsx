import { memo, useState, type SubmitEvent } from "react";
import { addTodo } from "../../api/todosApi";
import { validateTodoTitleInput } from "../../helpers/validateTodoTitleInput";
import styles from "./styles.module.css";

interface Props {
  onTasksUpdated: () => Promise<void>
}

export const AddTaskForm = memo(({ onTasksUpdated }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [validError, setValidError] = useState<string>('')

  const submitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimTitle = title.trim()

    const validateError = validateTodoTitleInput(trimTitle)
    if (validateError) {
      setValidError(validateError)
      return
    }

    try {
      await addTodo({ title: trimTitle })

      setTitle('')
      setValidError('')

      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  return (
    <section>
      <form
        className={styles.form}
        onSubmit={submitHandler}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          type="text"
          placeholder="Task To Be Done..."
        />
        {validError &&
          <span className={styles.error}>
            *{validError}
          </span>
        }
        <button
          type="submit"
          className={styles.addButton}
        >
          Add
        </button>
      </form>
    </section>
  )
})