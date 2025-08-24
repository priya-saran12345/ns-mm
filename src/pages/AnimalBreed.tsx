import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import AnimalBreed from '../components/Dashboard/Master/AnimalBreed';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <AnimalBreed />
    </MainLayout>
  );
};

export default DashboardPage;