import React from 'react'
import { DBRightSection, DBleftSection } from '../components';

const Dashboard = () => {
  return (
    <div className='w-screen h-screen flex items-center bg-primary'>
      <DBleftSection />
      <DBRightSection />
    </div>
  );
};

export default Dashboard;