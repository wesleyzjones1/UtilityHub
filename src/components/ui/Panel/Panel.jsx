import styles from './Panel.module.css';

export default function Panel({
  as: Tag = 'div',
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) {
  const cls = [
    styles.panel,
    styles[variant],
    styles[`pad-${padding}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}
