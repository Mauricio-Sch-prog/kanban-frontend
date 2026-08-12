type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`}
    />
  );
}