import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import AnimalType from '../components/Dashboard/Master/AnimalType';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <AnimalType />
    </MainLayout>
  );
};

export default DashboardPage;