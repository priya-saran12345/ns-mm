import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useAppDispatch } from '../../hooks/redux.hooks';
import { setBreadcrumbs } from '../../store/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set default breadcrumbs
    dispatch(setBreadcrumbs([{ title: 'Dashboard', path: '/dashboard' }]));
  }, [dispatch]);

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header />
        <Content className="bg-neutral-50 p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;