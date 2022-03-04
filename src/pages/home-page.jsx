import React from "react";
import {
  Layout,
  Typography,
  Drawer,
  Row,
  Col,
  Popover,
  Space,
  Button,
} from "antd";
import {
  MenuOutlined as MenuIcon,
  UserOutlined as UserIcon,
  CaretDownOutlined as DownIcon,
  LeftOutlined as LeftIcon,
} from "@ant-design/icons";
import { AiOutlinePoweroff as LogoutIcon } from "react-icons/ai";
import PageRoutes from "../routes/page-routes";
import MenuRoutes from "../routes/menu-routes";
import { useToggle } from "react-use";
import Words from "../resources/words";
import Colors from "../resources/colors";
import useWindowWidthBreakpoints from "use-window-width-breakpoints";
import { isMobileView } from "../tools/general";
import { Link, useLocation } from "react-router-dom";
import BreadcrumbMap from "../components/common/breadcrumb-map";
// import logo from "../assets/images/mazust-white.png";
import authService from "../services/auth-service";

const { Title, Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const menu_width = 280;

const PopoverContent = ({ history }) => {
  return (
    <Space className="logoutBtn">
      <LogoutIcon style={{ fontSize: "20px", marginTop: "7px" }} />

      <Text
        level={5}
        style={{ fontWeight: "normal", cursor: "pointer" }}
        onClick={() => history.push("/logout")}
      >
        {Words.logout_from_account}
      </Text>
    </Space>
  );
};

const MainHeader = ({ mobileView, trigger, history }) => {
  const { FirstName, LastName } = authService.getCurrentUser();

  return (
    <Header
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "fixed",
        zIndex: 100,
        width: "100%",
        paddingRight: 15,
        backgroundColor: "purple",
      }}
    >
      {!mobileView ? (
        <>
          {/* <img
            src={logo}
            alt={Words.app_name}
            style={{ width: 35, marginLeft: 10 }}
          /> */}
        </>
      ) : (
        <MenuIcon
          style={{
            color: Colors.white,
            fontSize: 20,
            marginLeft: 10,
            marginRight: 5,
          }}
          onClick={trigger}
        />
      )}

      <div
        style={{
          display: "flex",
          flexGrow: 1,
        }}
      >
        <Title
          level={!mobileView ? 4 : 5}
          style={{
            color: Colors.silver,
            // marginTop: 15,
          }}
        >
          {Words.app_name}
        </Title>
      </div>

      <Popover
        title={
          <Space direction="vertical">
            <Text style={{ fontSize: 13 }}>{`${FirstName}  ${LastName}`}</Text>

            <Text style={{ fontSize: 13 }}>
              <Link
                to={`/home/profile`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Space>
                  {Words.visit_profile}
                  <LeftIcon style={{ fontSize: 10 }} />
                </Space>
              </Link>
            </Text>
          </Space>
        }
        content={<PopoverContent history={history} />}
        placement="bottomLeft"
      >
        <Button type="link" className="userAccountBtn">
          <Space style={{ color: Colors.white }}>
            <UserIcon style={{ fontSize: 20 }} />
            <DownIcon style={{ fontSize: 10 }} />
          </Space>
        </Button>
      </Popover>
    </Header>
  );
};

const MainFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <Text className="captionText">{Words.copyright}</Text>
    </Footer>
  );
};

const PageSidebar = ({ path, mobileView, drawer, trigger }) => {
  return (
    <>
      {mobileView && drawer && (
        <Drawer
          title={Words.main_menu}
          placement="right"
          closable={true}
          onClose={trigger}
          visible={drawer}
          bodyStyle={{ padding: 0 }}
          width={menu_width}
        >
          <div className="scrollbar-normal">
            <MenuRoutes path={path} />
          </div>
        </Drawer>
      )}

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={menu_width}
        style={{
          overflow: "auto",
          height: "calc(100vh - 64px)",
          position: "fixed",
          right: 0,
          marginTop: 64,
          backgroundColor: Colors.white,
        }}
        className="scrollbar-normal"
      >
        <MenuRoutes path={path} />
      </Sider>
    </>
  );
};

const HomePage = (props) => {
  const [drawer, setDrawer] = useToggle(false);

  const mobileView = isMobileView(useWindowWidthBreakpoints);

  const location = useLocation();

  //------

  return (
    <Layout>
      <MainHeader
        mobileView={mobileView}
        trigger={setDrawer}
        history={props.history}
      />

      <Content>
        <Row>
          <Col xs={24}>
            <PageSidebar
              mobileView={mobileView}
              drawer={drawer}
              trigger={setDrawer}
              path={props.match.path}
            />

            <Layout
              style={{
                marginRight: !mobileView ? menu_width : 0,
                marginTop: 63,
              }}
            >
              <Space direction="vertical">
                <BreadcrumbMap location={location} />

                <Content
                  style={
                    !mobileView
                      ? {
                          // marginTop: 16,
                          marginLeft: 16,
                          marginRight: 16,
                          overflow: "initial",
                        }
                      : {
                          overflow: "initial",
                        }
                  }
                >
                  <div
                    id="app-container"
                    className="site-layout-background"
                    style={{ padding: 24, minHeight: 350 }}
                  >
                    <PageRoutes path={props.match.path} />
                  </div>
                </Content>
              </Space>

              <MainFooter />
            </Layout>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
