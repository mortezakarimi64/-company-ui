import React from "react";
import { Form, Switch } from "antd";

const handleSwitchChange = (fieldName, checked, formConfig) => {
  const { record, setRecord } = formConfig;

  const rec = { ...record };
  rec[fieldName] = checked;

  setRecord(rec);
};

const SwitchItem = ({
  fieldName,
  title,
  checkedTitle,
  unCheckedTitle,
  initialValue,
  formConfig,
  onChange,
}) => {
  return (
    <Form.Item
      // labelCol={{ xs: { span: 12 } }}
      // wrapperCol={{ xs: { span: 12 } }}
      label={title}
      name={fieldName}
      valuePropName="checked"
      initialValue={initialValue || false}
    >
      <Switch
        defaultChecked
        checkedChildren={checkedTitle}
        unCheckedChildren={unCheckedTitle}
        onChange={(e) =>
          onChange ? onChange(e) : handleSwitchChange(fieldName, e, formConfig)
        }
      />
    </Form.Item>
  );
};

export default SwitchItem;
