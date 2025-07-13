import { useEffect } from 'react';
import AppRoutes from './routes';
import { useAppSelector } from './store/hooks';
import { selectTheme } from './store/slices/themeSlice';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

function App() {
  const tailwindTheme = useAppSelector(selectTheme);
  const algorithm = tailwindTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  const themeConfig: ThemeConfig = {
    algorithm,
    components: {
    }
  };
 
  useEffect(() => {
    if (tailwindTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tailwindTheme]);

  return (
    <ConfigProvider theme={themeConfig}  >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
