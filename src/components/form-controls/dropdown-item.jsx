import React from "react";
import { Form, Select } from "antd";
import Words from "../../resources/words";

const { Option } = Select;

const handleDropdownSelectedItemChange = (keyColumn, value, formConfig) => {
  const { record, setRecord } = formConfig;

  const rec = { ...record };
  rec[keyColumn] = value || 0;
  setRecord(rec);
};

const DropdownItem = ({
  title,
  dataSource,
  keyColumn,
  valueColumn,
  onChange,
  onSearch,
  required,
  initialValue,
  vertical,
  labelCol,
  formConfig,
  ...rest
}) => {
  return (
    <Form.Item
      wrapperCol={{ span: vertical && vertical !== false ? 24 : 24 - labelCol }}
      labelCol={{ span: vertical && vertical !== false ? 24 : labelCol }}
      label={title}
      name={keyColumn}
      initialValue={initialValue || 0}
      required={required}
    >
      <Select
        allowClear
        showSearch
        {...rest}
        style={{ width: "100%" }}
        placeholder={Words.select_please}
        optionFilterProp="children"
        onSearch={onSearch}
        onChange={(selectedValue) =>
          onChange
            ? onChange(selectedValue)
            : handleDropdownSelectedItemChange(
                keyColumn,
                selectedValue,
                formConfig
              )
        }
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option key={`${keyColumn}_0`} value={0}>
          {Words.select_please}
        </Option>
        {dataSource &&
          dataSource.map((item) => (
            <Option
              key={`${keyColumn}_${item[keyColumn]}`}
              value={item[keyColumn]}
            >
              {item[valueColumn]}
            </Option>
          ))}
      </Select>
    </Form.Item>
  );
};

export default DropdownItem;
