import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`bg-primary flex h-screen items-center justify-center ${className}`}>
      {children}
    </div>
  );
}
