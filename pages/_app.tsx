import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion'; // Import Framer Motion
import { AppProps } from 'next/app';
import 'primeicons/primeicons.css'; // PrimeIcons
import 'primereact/resources/primereact.min.css'; // PrimeReact core styles
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // PrimeReact theme
import { Suspense } from 'react';
import './app.css'; // Custom CSS file

const MyApp = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })

  return (
    <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      {/* <Navbar /> Navbar will stay static on all pages */}
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
    </QueryClientProvider>
  );
};

export default MyApp;
