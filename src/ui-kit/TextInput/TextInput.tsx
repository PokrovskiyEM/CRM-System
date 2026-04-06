import { type InputHTMLAttributes } from "react";
import styles from './styles.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  border?: 'top' | 'bottom' | 'right' | 'left' | 'all'
}

export const TextInput = ({ border, className = "", ...props }: Props) => {

  return (
    <input
      type="text"
      className={`${styles.input} ${styles[`border-${border}`]} ${className}`}
      {...props}
    />
  )
}