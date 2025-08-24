import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Facilitator from '../components/Dashboard/Utility/Facilitator';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Facilitator />
    </MainLayout>
  );
};

export default DashboardPage;