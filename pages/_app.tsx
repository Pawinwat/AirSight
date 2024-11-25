import 'primereact/resources/themes/viva-dark/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core styles
import 'primeicons/primeicons.css'; // PrimeIcons
import './app.css'; // Custom CSS file
import { AppProps } from 'next/app';
import { motion } from 'framer-motion'; // Import Framer Motion
import Navbar from 'src/components/layout/Navbar'; // Your Navbar component
import { Suspense } from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar /> {/* Navbar will stay static on all pages */}
      <motion.div
        key={pageProps.key} // Key to trigger the page transition on route change
        initial={{ opacity: 0 }} // Initial state of the page (invisible)
        animate={{ opacity: 1 }} // End state (visible)
        exit={{ opacity: 0 }} // Exit state (fade out)
        transition={{ duration: 0.5 }} // Duration of the transition
      >
        <Component {...pageProps} />
      </motion.div>
    </Suspense>
  );
};

export default MyApp;
