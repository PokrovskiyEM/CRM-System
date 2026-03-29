import { type ButtonHTMLAttributes } from "react";
import type { Variant } from '../types';
import styles from './styles.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon: string
}

export const IconButton = ({ type = 'button', variant = 'primary', icon, className = "", ...props }: Props) => {

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      type={type}
      {...props}
    >
      <img src={icon} />
    </button >
  )
}