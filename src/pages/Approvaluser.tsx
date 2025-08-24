import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Approvaluser from '../components/Dashboard/Utility/Approvaluser';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Approvaluser />
    </MainLayout>
  );
};

export default DashboardPage;