type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={`border-accent hover:bg-accent rounded border px-3 py-2 transition-colors outline-none ${props.className}`}
    />
  );
}
