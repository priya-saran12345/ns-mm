import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import FieldAgentTable from '../components/Dashboard/dashboard/FieldAgentTable';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <FieldAgentTable />
    </MainLayout>
  );
};

export default DashboardPage;