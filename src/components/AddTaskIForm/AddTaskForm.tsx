import { useState, type SubmitEvent } from "react";
import { addTask } from "../../api/todosApi";
import { validateInput } from "../../helpers/validateInput";
import styles from "./styles.module.css";

interface Props {
  onTaskCreated: () => Promise<void>
}

export const AddTaskForm = ({ onTaskCreated }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [validError, setValidError] = useState<string>('')

  const submitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validateError = validateInput(title)
    if (validateError) {
      setValidError(validateError)
      return
    }

    try {
      const trimTitle = title.trim()
      await addTask({ title: trimTitle })

      setTitle('')
      setValidError('')

      await onTaskCreated()
    } catch (error) {
      console.log(`Ошибка - ${error}`);
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
          maxLength={65}
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
}