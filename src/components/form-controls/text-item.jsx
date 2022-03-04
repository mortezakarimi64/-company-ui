import React from "react";
import { Form } from "antd";
import TitleValueText from "./../common/title-value-text";

const TextItem = ({ ...rest }) => {
  return (
    <Form.Item>
      <TitleValueText {...rest} />
    </Form.Item>
  );
};

export default TextItem;
