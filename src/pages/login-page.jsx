import React, { useState } from "react";
import Joi from "joi-browser";
import { Row, Col, Typography, Divider, Form, Button } from "antd";
import { useToggle, useLocation } from "react-use";
import authService from "../services/auth-service";
import {
  handleError,
  hasFormError,
  validateForm,
  trimRecord,
} from "./../tools/form-manager";
import { getFormItemLayout, centerTextCol } from "./../tools/general";
import InputItem from "../components/form-controls/input-item";
import {
  UserOutlined as UserIcon,
  LockOutlined as LockIcon,
} from "@ant-design/icons";
import Words from "./../resources/words";
import Colors from "./../resources/colors";
import logo from "./../assets/images/logo.png";
import fbc_background from "./../assets/images/fbc-login-bg.png";

const { Title, Text } = Typography;

const schema = {
  username: Joi.string()
    .min(8)
    .max(32)
    .required()
    .label(Words.username)
    .regex(/^[a-zA-Z0-9-._]{7,31}$/),
  password: Joi.string()
    .min(8)
    .max(32)
    .required()
    .label(Words.password)
    .regex(/^[a-zA-Z0-9-._!@#$%^&*]{7,31}$/),
};

const LoginPage = () => {
  const [record, setRecord] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const [inProgress, toggleProgress] = useToggle(false);

  const pageLocation = useLocation();

  const formItemLayout = getFormItemLayout(5);

  //------

  const handleSubmit = async () => {
    if (!hasFormError(errors)) {
      toggleProgress(true);

      try {
        const rec = trimRecord(record);
        const { username, password } = rec;

        await authService.login(username, password);

        const { state } = pageLocation.state || {};
        window.location = state ? state.from.pathname : "/";
      } catch (ex) {
        handleError(ex);
      } finally {
        toggleProgress(false);
      }
    }
  };

  const renderLoginBox = () => {
    return (
      <div style={{ maxWidth: 400, marginLeft: 25, marginRight: 25 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} style={centerTextCol}>
            <img src={logo} alt={Words.app_company} />
          </Col>
          <Col xs={24} style={centerTextCol}>
            <Title level={1} style={{ color: Colors.blue[7] }}>
              {Words.app_name}
            </Title>
          </Col>
          <Col xs={24} style={centerTextCol}>
            <Divider plain>
              <Text type="secondary">{Words.login_to_app}</Text>
            </Divider>
          </Col>
          <Col xs={24}>
            <Form name="dataForm" {...formItemLayout}>
              <Row gutter={[1, 3]}>
                <Col xs={24}>
                  <InputItem
                    prefix={<UserIcon />}
                    title={Words.username}
                    fieldName="username"
                    required
                    allowClear
                    maxLength={32}
                    formConfig={formConfig}
                  />
                </Col>
                <Col xs={24}>
                  <InputItem
                    prefix={<LockIcon />}
                    title={Words.password}
                    fieldName="password"
                    required
                    allowClear
                    password
                    maxLength={32}
                    formConfig={formConfig}
                  />
                </Col>
                <Col xs={24}>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                    loading={inProgress}
                    disabled={validateForm(formConfig) && true}
                  >
                    {Words.login_to_app}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  const renderInfoBox = () => {
    // return <Text>FBC</Text>;
    return <></>;
  };

  return (
    <Row>
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          // backgroundColor: Colors.blue[1],
        }}
      >
        {renderLoginBox()}
      </Col>
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: Colors.blue[6],
          backgroundImage: `url(${fbc_background})`,
          backgroundPosition: "center",
        }}
      >
        {renderInfoBox()}
      </Col>
    </Row>
  );
};

export default LoginPage;
