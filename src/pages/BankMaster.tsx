import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import BankMasterData from '../components/Dashboard/Master/BankMaster';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <BankMasterData />
    </MainLayout>
  );
};

export default DashboardPage;