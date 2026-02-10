import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { HomeOutlined, DashboardOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/analytics', icon: <DashboardOutlined />, label: 'Analytics' },
    { key: '/settings', icon: <UserOutlined />, label: 'Settings' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <div style={{ padding: '16px', color: 'white', fontWeight: 'bold' }}>STREAM STUDIO</div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ background: '#f0f2f5' }}>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Live Studio</Title>
          <Button type="text" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>Logout</Button>
        </Header>

        <Content style={{ margin: '24px' }}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;