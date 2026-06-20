import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { AppRouter } from './router/AppRouter';

export const App = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <AppRouter />
    </ConfigProvider>
  );
};
