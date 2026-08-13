export default function Viewport({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="relative h-screen w-screen overflow-hidden bg-red-800">
      {children}
    </div>
  );
}
