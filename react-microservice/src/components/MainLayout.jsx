import { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  SmileOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  DownOutlined,
  MailOutlined,
  BellFilled,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Dropdown, Switch, Space, Badge } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for theme mode
  const { token: { colorBgContainer, borderRadiusLG, colorTextBase } } = theme.useToken();
  const navigate = useNavigate();
  const backgroundColor = '#071952';
  const isLogin = localStorage.getItem("login") === "1";
  const customer = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    if (!isLogin || !customer || !(customer.role === 'ADMIN' || customer.role === 'AUTHS')) {
      navigate("/dashboard/login");
    }
  }, [isLogin, customer, navigate]);

  if (!isLogin || !customer || !(customer.role === 'ADMIN' || customer.role === 'AUTHS')) {
    return null;
  }

  const handleOnClickLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("customer");
    navigate("/dashboard/login");
  };

  const handleClickMenu = (items) => {
    navigate(items.key);
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <UploadOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "/dashboard/pos",
      icon: <UploadOutlined />,
      label: "POS",
    },
    {
      key: "/dashboard/order",
      icon: <UploadOutlined />,
      label: "Order",
    },
    {
      key: "/dashboard/order-item",
      icon: <UploadOutlined />,
      label: "Order Item",
    },
    {
      key: "/dashboard/product",
      icon: <UploadOutlined />,
      label: "Product",
    },
  ];

  const items = [
    {
      key: '1',
      label: (
        <a>
          Logout
        </a>
      ),
      icon: <LogoutOutlined />,
      onClick: handleOnClickLogout,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
    }
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };


  const dynamicStyle = {
    header: {
      background: darkMode ? '#333' : colorBgContainer,
      color: darkMode ? '#fff' : colorTextBase,
    },
    content: {
      background: darkMode ? '#333' : colorBgContainer,
      color: darkMode ? '#fff' : colorTextBase,
    },
  };

  return (
    <Layout style={{ height: '100vh', display: 'flex' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: backgroundColor,
        }}
      >
        <h3 style={{ display: "flex", justifyContent: "center", color: "white" }}>FoodDaily Co.ltd</h3>
        <Menu
          style={{ background: backgroundColor }}
          theme={"dark"}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onClick={handleClickMenu}
        />
      </Sider>

      <Layout style={{ height: '100%' }}>
        <Header style={{ padding: 0, ...dynamicStyle.header, display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "50px" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px', color: darkMode ? '#fff' : '#000' }}
          />

          <h3 style={{ color: darkMode ? '#fff' : '#000' }}>Dashboard</h3>
          <Space>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              checked={darkMode}
              onChange={toggleTheme}
            />

            <Badge count={1} dot>
              <MailOutlined style={{fontSize:"16px", color: darkMode ? '#fff' : '#000' }}/>
            </Badge>
            <Badge count={2}>
              <BellFilled style={{fontSize:"16px", color: darkMode ? '#fff' : '#000' }}/>
            </Badge>

            <Dropdown
              style={{ width: 150 }}
              menu={{ items: items }}
              placement="bottomLeft">
              <Button type="link" className={"iconProfile"} style={{ color: darkMode ? '#fff' : '#000' }}>
                <UserOutlined />
                {customer.name}
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 3,
            padding: 5,
            minHeight: 'calc(100vh - 60px)',
            ...dynamicStyle.content,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

