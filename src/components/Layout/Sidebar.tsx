import React from 'react';
import { Layout, Menu, Avatar, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  WalletOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux.hooks';
import { toggleSidebar } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import { SidebarItem } from '../../types/ui.types';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const sidebarItems: SidebarItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      path: '/dashboard',
    },
    {
      key: 'users',
      label: 'Users',
      icon: <TeamOutlined />,
      path: '/users',
      roles: ['admin', 'manager'],
    },
    {
      key: 'products',
      label: 'Products',
      icon: <ShoppingCartOutlined />,
      path: '/products',
    },
    {
      key: 'orders',
      label: 'Orders',
      icon: <FileTextOutlined />,
      path: '/orders',
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <BarChartOutlined />,
      path: '/analytics',
      roles: ['admin', 'manager'],
    },
    {
      key: 'finance',
      label: 'Finance',
      icon: <WalletOutlined />,
      path: '/finance',
      roles: ['admin'],
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      path: '/profile',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      path: '/settings',
      roles: ['admin'],
    },
  ];

  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || 'user')
  );

  const menuItems = filteredItems.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={() => dispatch(toggleSidebar())}
      trigger={null}
      width={280}
      className="bg-white border-r border-neutral-200 shadow-sm animate-slide-in"
    >
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Text className="text-white font-bold text-sm">ERP</Text>
                </div>
                <Text className="font-bold text-lg text-neutral-800">Admin Panel</Text>
              </div>
            )}
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => dispatch(toggleSidebar())}
              className="text-neutral-600 hover:text-primary-500 hover:bg-primary-50"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <Avatar
              size={sidebarCollapsed ? 32 : 48}
              src={user?.avatar}
              icon={<UserOutlined />}
              className="bg-primary-500"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <Text className="font-semibold text-neutral-800 block truncate">
                  {user?.name}
                </Text>
                <Text className="text-xs text-neutral-500 block truncate capitalize">
                  {user?.role}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-hidden">
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
            className="border-r-0 bg-transparent"
            style={{
              fontSize: '14px',
            }}
          />
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-neutral-200">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="w-full justify-start text-error-500 hover:text-error-600 hover:bg-error-50"
            size="large"
          >
            {!sidebarCollapsed && 'Logout'}
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;