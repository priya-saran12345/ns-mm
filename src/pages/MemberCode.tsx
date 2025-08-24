import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import MemberCode from '../components/Dashboard/Utility/MemberCode';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <MemberCode />
    </MainLayout>
  );
};

export default DashboardPage;