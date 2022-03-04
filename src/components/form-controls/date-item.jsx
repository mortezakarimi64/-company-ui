import React from "react";
import { Form, ConfigProvider } from "antd";
import { DatePicker as DatePickerJalali } from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
import utils from "./../../tools/utils";

const JalaliDatePicker = ({ fieldName, formConfig }) => {
  const dateValue = formConfig.record[fieldName];

  return (
    <ConfigProvider locale={fa_IR} direction="rtl">
      <DatePickerJalali
        onChange={(date) => onDateChange(fieldName, date, formConfig)}
        value={
          dateValue && dateValue.length > 0 ? utils.jalaliDate(dateValue) : null
        }
        style={{ width: "100%" }}
      />
    </ConfigProvider>
  );
};

const onDateChange = (fieldName, date, formConfig) => {
  const { record, setRecord } = formConfig;
  const rec = { ...record };

  if (date !== null) {
    const { $jy: jYear, $jM: jMonth, $jD: jDay } = date;

    rec[fieldName] = `${jYear}${utils.addFirstZero(
      `${jMonth + 1}`
    )}${utils.addFirstZero(`${jDay}`)}`;
  } else {
    rec[fieldName] = "";
  }

  setRecord(rec);
};

const DateItem = ({
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
      <JalaliDatePicker fieldName={fieldName} formConfig={formConfig} />
    </Form.Item>
  );
};

export default DateItem;
