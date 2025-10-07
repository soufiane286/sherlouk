import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="text-center max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon name="FileQuestion" size={64} className="text-primary" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          <h1 className="text-6xl font-bold text-foreground tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button
            onClick={() => navigate('/')}
            iconName="Home"
            iconPosition="left"
            iconSize={18}
            className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200"
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={18}
            className="hover:shadow-md transition-all duration-200"
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t border-border"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{' '}
            <button
              onClick={() => navigate('/documentation')}
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              documentation
            </button>{' '}
            or contact support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;