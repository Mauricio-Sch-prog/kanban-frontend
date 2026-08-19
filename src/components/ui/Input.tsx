type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`focus:border-accent focus:ring-accent bg-bg border-accent w-full rounded-lg border-none px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:outline-none ${props.className}`}
    />
  );
}
