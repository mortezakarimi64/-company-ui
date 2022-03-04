import React from "react";
import { Typography, Space } from "antd";

const { Text } = Typography;

const TabTitle = ({ title, icon, color }) => {
  const TabIcon = icon;

  return (
    <Space>
      {icon && <TabIcon style={{ color, marginTop: "10px" }} size={20} />}

      <Text style={{ color }}>{title}</Text>
    </Space>
  );
};

export default TabTitle;
