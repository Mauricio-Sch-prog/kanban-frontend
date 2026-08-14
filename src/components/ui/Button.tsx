type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`}
    />
  );
}
