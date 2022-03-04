import React from "react";
import { Link } from "react-router-dom";
import { Card, Avatar, Typography, Space } from "antd";

const { Title } = Typography;

const DashboardTile = ({ to, icon, backColor, title }) => {
  return (
    <Link to={to}>
      <Card className="card">
        <Space direction="vertical">
          <Avatar
            size={75}
            icon={icon}
            style={{
              backgroundColor: backColor,
            }}
          />
          <Title level={5}>{title}</Title>
        </Space>
      </Card>
    </Link>
  );
};

export default DashboardTile;
