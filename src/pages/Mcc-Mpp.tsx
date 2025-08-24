import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import MCC_mpp from '../components/Dashboard/Utility/mcc-mpp';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <MCC_mpp />
    </MainLayout>
  );
};

export default DashboardPage;