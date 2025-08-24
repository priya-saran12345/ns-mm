import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import FormData from '../components/Dashboard/Master/FormData';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <FormData />
    </MainLayout>
  );
};

export default DashboardPage;