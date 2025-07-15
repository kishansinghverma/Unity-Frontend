import { useEffect } from 'react';
import AppRoutes from './routes';
import { useAppSelector } from './store/hooks';
import { selectTheme } from './store/slices/themeSlice';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, theme as antdTheme, notification } from 'antd';
import type { ThemeConfig } from 'antd';
import { setNotificationApi } from './engine/services/notificationService';

function App() {
  const tailwindTheme = useAppSelector(selectTheme);
  const [api, contextHolder] = notification.useNotification();

  const themeConfig: ThemeConfig = {
    algorithm: tailwindTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    components: {}
  };

  useEffect(() => {
    if (tailwindTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tailwindTheme]);

  useEffect(() => setNotificationApi(api), [api]);

  return (
    <ConfigProvider theme={themeConfig}  >
      <AuthProvider>
        {contextHolder}
        <AppRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
