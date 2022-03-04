import React from "react";
import { Form, Input } from "antd";
import utils from "../../tools/utils";
import Words from "../../resources/words";
import { validateFormProperty } from "../../tools/form-manager";

const { TextArea, Password } = Input;

const handleTextChange = (data, formConfig) => {
  const { errors, setErrors, record, setRecord, schema } = formConfig;
  const rec = { ...record };
  const errs = { ...errors };

  const { currentTarget: input } = data;
  const name = input.id.replace("dataForm_", "");
  const { value } = input;

  const errorMessage = validateFormProperty(name, value, schema);
  if (errorMessage) errs[name] = errorMessage;
  //else delete errs[name];
  else {
    if (name === "NationalCode" && !utils.checkNationalCode(value)) {
      errs[name] = Words.invalid_national_code;
    } else delete errs[name];
  }

  rec[name] = input.value;
  setRecord(rec);
  setErrors(errs);
};

const InputItem = ({
  title,
  fieldName,
  required,
  password,
  multiline,
  noLabel,
  horizontal,
  labelCol,
  formConfig,
  ...rest
}) => {
  const { errors } = formConfig;

  const handleChange = (data) => handleTextChange(data, formConfig);

  let control = null;
  if (!password && multiline) {
    control = <TextArea {...rest} onChange={handleChange} />;
  } else if (!multiline && password) {
    control = <Password {...rest} onChange={handleChange} />;
  } else {
    control = <Input {...rest} onChange={handleChange} />;
  }

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
      {control}
    </Form.Item>
  );
};

export default InputItem;
