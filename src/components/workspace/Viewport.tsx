export default function Viewport({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="bg-bg relative h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
