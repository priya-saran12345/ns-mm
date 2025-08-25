import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import SingleFieldUser from '../../components/Dashboard/Master/Villagemaster';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <SingleFieldUser />
    </MainLayout>
  );
};

export default DashboardPage;