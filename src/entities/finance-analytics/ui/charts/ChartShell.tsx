import type { ReactNode } from 'react';
import styles from './styles.module.css';

interface Props {
  title: string;
  children: ReactNode;
}

export function ChartShell({ title, children }: Props) {
  return (
    <section className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      {children}
    </section>
  );
}

export function ChartEmptyState({ message = 'Нет данных для отображения' }: { message?: string }) {
  return <div className={styles.emptyChart}>{message}</div>;
}
