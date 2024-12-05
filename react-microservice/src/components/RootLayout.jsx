import { Outlet, useNavigate } from "react-router-dom";
import { Affix, Avatar, Breadcrumb, Col, Layout, Menu, Row, theme, } from 'antd';
import { FacebookOutlined, YoutubeOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

const RootLayout = () => {

  const navigate = useNavigate()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  
  const items = [
    {
      key: "",
      label: "HOME"
    },
    {
      key: "/about",
      label: "ABOUT",
    },
    {
        key: "/contact",
        label: "CONTACT",
    },
  ]
  
  const topItems = [
    {
      key: "/facebook",
      icon: <FacebookOutlined />,
      label: "Facebook"
    },
    {
      key: "/youtube",
      icon: <YoutubeOutlined />,
      label: "YouTube"
    },
  ]
  
  return (
    <Layout>

      <Header
        style={{
          zIndex: 1,
          width: '100%',
          backgroundColor: "#321414",
          alignItems: 'center',
          height: 54,
        }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={18}>

          </Col>
          <Col span={6}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['0']}
              items={topItems}
              style={{ flex: 1, minWidth: 0, backgroundColor: "#321414", height: 54, alignItems: "center" }}
            />
          </Col>
        </Row>
      </Header>

      <Affix offsetTop={0} onChange={(affixed) => console.log(affixed)}>
        <Header
          style={{
            backgroundColor: '#f8f8ff ',
            width: '100%',
            alignItems: 'center',
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            height: 84,
          }}
        >
          <Row>
            <Col span={14} style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: -20,
            }}>
              <Avatar
                size={45}
                src={"https://cdn.pixabay.com/photo/2020/09/16/18/39/icon-5577198_1280.png"}

              />
              &nbsp;
              <h3 style={{ color: "red" }}>COOL Group</h3>
            </Col>
            <Col span={10}>
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                onClick={handleMenuClick}
                style={{ flex: 1, minWidth: 0, backgroundColor: '#f8f8ff', height: 84 }}
              />
            </Col>
          </Row>
        </Header>
      </Affix>

      <Content style={{ padding: '0 48px', }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>App1</Breadcrumb.Item>
          <Breadcrumb.Item>App2</Breadcrumb.Item>
          <Breadcrumb.Item>App3</Breadcrumb.Item>
        </Breadcrumb>

        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {<Outlet />}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default RootLayout;
