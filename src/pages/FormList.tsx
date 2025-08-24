import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import FormList from '../components/Dashboard/Utility/FormList';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <FormList />
    </MainLayout>
  );
};

export default DashboardPage;