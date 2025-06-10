import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the loading spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional text to display below the spinner
   */
  text?: string;
}

export const LoadingAnimation = React.forwardRef<HTMLDivElement, LoadingAnimationProps>(
  ({ size = 'md', text, className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-3',
      lg: 'w-12 h-12 border-4'
    } as const;

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        <div
          className={cn(
            sizeClasses[size],
            'animate-spin rounded-full border-current border-t-transparent text-primary'
          )}
          role="status"
          aria-label={text || 'Loading'}
        />
        {text && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }
);

LoadingAnimation.displayName = 'LoadingAnimation';

export default LoadingAnimation;
