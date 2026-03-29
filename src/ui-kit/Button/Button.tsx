import { type ButtonHTMLAttributes, type ReactNode } from "react";
import type { Variant } from '../types';
import styles from './styles.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: Variant
}

export const Button = ({ children, type = 'button', variant = 'primary', className = "", ...props }: Props) => {

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}