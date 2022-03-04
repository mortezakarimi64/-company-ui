import React from "react";
import { Form, Space } from "antd";
import { SwatchesPicker } from "react-color";
import { MdColorLens as ColorIcon } from "react-icons/md";

const ColorItem = ({
  title,
  fieldName,
  required,
  noLabel,
  //   horizontal,
  //   labelCol,
  formConfig,
}) => {
  const { errors, record, setRecord } = formConfig;

  const handleColorChange = (color /* , event */) => {
    const rec = { ...record };
    rec[fieldName] = color.hex;
    setRecord(rec);
  };

  return (
    <Form.Item
      label={noLabel ? "" : title}
      name={fieldName}
      required={required || false}
      hasFeedback
      help={errors[fieldName]}
      validateStatus={
        errors[fieldName] === undefined
          ? ""
          : errors[fieldName] != null
          ? "error"
          : "success"
      }
    >
      <Space>
        <ColorIcon size={24} style={{ color: record[fieldName] }} />

        <SwatchesPicker
          color={record[fieldName]}
          onChange={handleColorChange}
        />
      </Space>
    </Form.Item>
  );
};

export default ColorItem;
