import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { useAppSelector } from './store/hooks';
import { selectTheme } from './store/slices/themeSlice';
import { AuthProvider } from './context/AuthContext';

function App() {
  const theme = useAppSelector(selectTheme);
  
  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
