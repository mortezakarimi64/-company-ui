import React from "react";
import { Form, InputNumber } from "antd";
import { validateFormProperty } from "../../tools/form-manager";

const handleNumericValueChange = (value, fieldName, formConfig) => {
  const { errors, setErrors, record, setRecord, schema } = formConfig;
  const rec = { ...record };
  const errs = { ...errors };

  const errorMessage = validateFormProperty(fieldName, value, schema);
  if (errorMessage) errs[fieldName] = errorMessage;
  else delete errs[fieldName];

  rec[fieldName] = value;

  setRecord(rec);
  setErrors(errs);
};

const NumericInputItem = ({
  title,
  fieldName,
  noLabel,
  required,
  horizontal,
  labelCol,
  initialValue,
  decimalText,
  formConfig,
  ...rest
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
      initialValue={initialValue || 0}
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
      <InputNumber
        style={{ width: "100%" }}
        onChange={(value) =>
          handleNumericValueChange(
            decimalText && decimalText !== false ? parseFloat(value) : value,
            fieldName,
            formConfig
          )
        }
        {...rest}
      />
    </Form.Item>
  );
};

export default NumericInputItem;
