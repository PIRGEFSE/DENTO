import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6',
        hover && 'cursor-pointer hover:border-gray-600 transition-colors',
        className
      )}
      style={{ background: '#141414', borderColor: '#1e1e1e' }}
      {...props}
    />
  );
}

