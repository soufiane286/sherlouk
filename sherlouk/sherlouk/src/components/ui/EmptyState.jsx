import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  iconSize = 48,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "text-center py-16 px-6",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {icon && (
        <motion.div
          className="mx-auto w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Icon name={icon} size={iconSize} className="text-muted-foreground" />
        </motion.div>
      )}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {title && (
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
      {action && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            {...action}
            className={cn(
              "hover:shadow-md transition-all duration-200",
              action?.className
            )}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;