import { DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button } from "antd";
import styles from "./styles.module.css";

interface Props {
  isEdit: boolean
  onStartEdit: () => void
  onDelete: () => void
  onCancelEdit: () => void
}

export const TodoItemControls = ({
  isEdit,
  onStartEdit,
  onDelete,
  onCancelEdit,
}: Props) => {
  return (
    <div className={styles.controls}>
      {!isEdit ? (
        <>
          <Button
            size="large"
            type="primary"
            icon={<EditOutlined />}
            onClick={onStartEdit}
          />
          <Button
            size="large"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          />
        </>
      ) : (
        <>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<SaveOutlined />}
          />
          <Button
            variant="solid"
            color="magenta"
            danger
            size="large"
            htmlType="button"
            icon={<UndoOutlined />}
            onClick={onCancelEdit}
          />
        </>
      )}
    </div>
  )
}