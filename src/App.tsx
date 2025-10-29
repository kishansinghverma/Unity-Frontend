import { useEffect } from 'react';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { notification } from 'antd';
import { setNotificationApi } from './engine/services/notificationService';

function App() {
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => setNotificationApi(api), [api]);

  return (
    <AuthProvider>
      {contextHolder}
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
