import React from "react";
import { Space, Typography } from "antd";

const { Text } = Typography;

const TitleValueText = ({ title, value, titleColor, valueColor }) => {
  return (
    <Space>
      <Text style={titleColor && { color: titleColor }}>{`${title}:`}</Text>
      <Text style={valueColor && { color: valueColor }}>{value}</Text>
    </Space>
  );
};

export default TitleValueText;
