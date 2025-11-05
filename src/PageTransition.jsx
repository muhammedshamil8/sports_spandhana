import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        // Your logic to run before a route change
        const handleRouteChange = () => {
            // Your logic to run before a route change
        };

        const handleRouteComplete = () => {
            // Your logic to run after a route change
        };

        return () => {
            // Cleanup logic (if needed)
        };
    }, [location]);

    return (
        // <AnimatePresence exitBeforeEnter>
            <motion.div
                key={location.pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                    pageInitial: { opacity: 0 , y:-250},
                    pageAnimate: { opacity: 1 , y: 0},
                    pageExit: { opacity: 0 , y: 150},
                }}
                transition={{ duration: 1 }}
                mode="wait"
            >
                {children}
            </motion.div>
            // </AnimatePresence>
    );
};

export default PageTransition;
