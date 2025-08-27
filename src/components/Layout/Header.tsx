import React from 'react';
import { Layout, Breadcrumb, Avatar, Dropdown, Space, Badge, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux.hooks';
import { toggleSidebar } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import type { MenuProps } from 'antd';
const { Header: AntHeader } = Layout;
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed, breadcrumbs } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white border-b border-neutral-200 shadow-sm px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => dispatch(toggleSidebar())}
          className="text-neutral-600 hover:text-primary-500 hover:bg-primary-50"
        />
        
        <Breadcrumb
          items={breadcrumbs.map(item => ({
            title: item.title,
            href: item.path,
          }))}
          className="text-neutral-600"
        />
      </div>

      <Space size="middle">

<Badge
  count={5}
  color="#2563EB"   // your primary blue
  style={{
    color: "#fff",   // text color inside badge
  }}
>
  <Button
    type="text"
    icon={<BellOutlined />}
    className="text-neutral-600 text-[20px] hover:text-primary-500 hover:bg-primary-50"
    size="large"
  />
</Badge>
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-50">
            <Avatar
              size={32}
              src={user?.avatar}
              icon={<UserOutlined />}
              className="bg-primary-500"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-neutral-800">{user?.name}</div>
              <div className="text-xs text-neutral-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;