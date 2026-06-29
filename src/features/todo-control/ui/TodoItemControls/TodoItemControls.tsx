import { DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button } from "antd";
import styles from "./styles.module.css";

interface Props {
  isEditing: boolean
  onStartEdit: () => void
  onDelete: () => void
  onCancelEdit: () => void
}

export const TodoItemControls = ({
  isEditing,
  onStartEdit,
  onDelete,
  onCancelEdit,
}: Props) => {
  return (
    <div className={styles.controls}>
      {!isEditing ? (
        <>
          <Button
            size="large"
            type="primary"
            icon={<EditOutlined />}
            onClick={onStartEdit}
            data-testid="edit-button"
          />
          <Button
            size="large"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            data-testid="delete-button"
          />
        </>
      ) : (
        <>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<SaveOutlined />}
            data-testid="save-button"
          />
          <Button
            variant="solid"
            color="magenta"
            danger
            size="large"
            htmlType="button"
            icon={<UndoOutlined />}
            onClick={onCancelEdit}
            data-testid="cancel-button"
          />
        </>
      )}
    </div>
  )
}