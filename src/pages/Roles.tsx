import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Roles from '../components/Dashboard/Master/roles';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Roles />
    </MainLayout>
  );
};

export default DashboardPage;