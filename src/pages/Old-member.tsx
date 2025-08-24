import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Old_member from '../components/Dashboard/Utility/Old-member';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Old_member />
    </MainLayout>
  );
};

export default DashboardPage;