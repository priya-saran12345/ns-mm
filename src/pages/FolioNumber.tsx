import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import FolioNumber from '../components/Dashboard/Utility/FolioNumber';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <FolioNumber />
    </MainLayout>
  );
};

export default DashboardPage;