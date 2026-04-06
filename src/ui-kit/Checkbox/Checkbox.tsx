import { type InputHTMLAttributes } from "react";
import styles from './styles.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'square' | 'circle'
}

export const Checkbox = ({ variant = 'square', className = "", ...props }: Props) => {

  return (
    <input
      type="checkbox"
      className={`${styles.checkbox} ${styles[variant]} ${className}`}
      {...props}
    />
  )
}