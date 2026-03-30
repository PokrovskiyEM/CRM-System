import { type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from './styles.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  isActive?: boolean
}

export const Tab = ({ children, isActive = false, className = "", ...props }: Props) => {

  return (
    <button
      className={`${styles.tab} ${isActive ? styles.active : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}