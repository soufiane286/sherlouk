import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from './Button';

const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      <div className="space-y-2">
        {breadcrumbs && (
          <nav className="flex text-sm text-muted-foreground">
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {crumb?.href ? (
                  <a 
                    href={crumb?.href} 
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb?.label}
                  </a>
                ) : (
                  <span className={index === breadcrumbs?.length - 1 ? 'text-foreground' : ''}>
                    {crumb?.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-base max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <motion.div
          className="flex items-center gap-3 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {actions?.map((action, index) => (
            <Button
              key={index}
              {...action}
              className={cn(
                "hover:shadow-md transition-all duration-200",
                action?.variant === 'default' && "bg-gradient-to-r from-primary to-primary/90",
                action?.className
              )}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;