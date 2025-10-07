import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  text,
  ...props 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    white: 'text-white'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className="flex items-center gap-3">
        <motion.div
          className={cn(
            "border-2 border-current border-t-transparent rounded-full",
            sizeClasses?.[size],
            colorClasses?.[color]
          )}
          variants={spinnerVariants}
          animate="animate"
        />
        {text && (
          <motion.span
            className={cn("text-sm font-medium", colorClasses?.[color])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.span>
        )}
      </div>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ 
  isLoading, 
  text = "Loading...",
  className 
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card border border-border rounded-xl p-8 shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;