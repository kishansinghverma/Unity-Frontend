import { notification } from 'antd';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { setNotificationApi } from './engine/services/notificationService';
import AppRoutes from './routes';

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
