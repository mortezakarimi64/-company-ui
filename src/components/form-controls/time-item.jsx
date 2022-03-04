import React from "react";
import { Form, ConfigProvider } from "antd";
import { TimePicker } from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
import moment from "moment";
import utils from "../../tools/utils";

const ProTimePicker = ({ fieldName, formConfig }) => {
  const timeValue = formConfig.record[fieldName];

  return (
    <ConfigProvider locale={fa_IR} direction="rtl">
      <TimePicker
        locale={fa_IR}
        use12Hours
        format="h:mm a"
        value={
          timeValue && timeValue.length > 0 ? moment(timeValue, "HHmm") : null
        }
        onChange={(time) => onTimeChange(fieldName, time, formConfig)}
        style={{ width: "100%" }}
      />
    </ConfigProvider>
  );
};

const onTimeChange = (fieldName, time, formConfig) => {
  const { record, setRecord } = formConfig;
  const rec = { ...record };

  if (time !== null) {
    const { $H: hour, $m: minute } = time;
    rec[fieldName] = `${utils.addFirstZero(`${hour}`)}${utils.addFirstZero(
      `${minute}`
    )}`;
  } else {
    rec[fieldName] = "";
  }

  setRecord(rec);
};

const TimeItem = ({
  title,
  fieldName,
  noLabel,
  required,
  horizontal,
  labelCol,
  formConfig,
}) => {
  const { errors } = formConfig;

  return (
    <Form.Item
      labelCol={{ span: horizontal && horizontal !== false ? labelCol : 24 }}
      wrapperCol={{
        span: horizontal && horizontal !== false ? 24 - labelCol : 24,
      }}
      label={noLabel ? "" : title}
      name={fieldName}
      help={errors[fieldName]}
      hasFeedback
      required={required && required}
      validateStatus={
        errors[fieldName] === undefined
          ? ""
          : errors[fieldName] != null
          ? "error"
          : "success"
      }
    >
      <ProTimePicker fieldName={fieldName} formConfig={formConfig} />
    </Form.Item>
  );
};

export default TimeItem;
