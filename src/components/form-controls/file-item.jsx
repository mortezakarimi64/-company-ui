import React from "react";
import { Form, Upload, Button, Progress, message } from "antd";
import { UploadOutlined as UploadIcon } from "@ant-design/icons";
import Words from "../../resources/words";
import utils from "../../tools/utils";

const getUploadProps = (fieldName, fileConfig, formConfig) => {
  const { maxFileSize, sizeType } = fileConfig;
  const { fileList, setFileList, record, setRecord } = formConfig;

  let _fileList = { ...fileList };
  let _record = { ...record };

  const props = {
    onRemove: (file) => {
      delete _fileList[fieldName];
      _record[fieldName] = "";
      setFileList(_fileList);
      setRecord(_record);
    },
    beforeUpload: (file) => {
      const validFileSize =
        file.size / 1024 / (sizeType === "mb" ? 1024 : 1) <= maxFileSize;

      if (!validFileSize) {
        message.error(Words.limit_upload_file_size);

        //prevent auto upload
        return false;
      }

      _fileList[fieldName] = file;
      _record[fieldName] = file.name;
      setFileList(_fileList);

      //prevent auto upload
      return false;
    },
    fileList: _fileList[fieldName] ? [_fileList[fieldName]] : [],
  };

  return props;
};

const FileItem = ({
  title,
  fieldName,
  noLabel,
  required,
  horizontal,
  labelCol,
  formConfig,
  fileConfig,
}) => {
  const { errors, fileList } = formConfig;
  const { maxFileSize, sizeType } = fileConfig;

  const props = getUploadProps(fieldName, fileConfig, formConfig);

  let uploading = false;
  let uploadProgress = 0;

  const fileToUpload = fileList[fieldName];
  if (fileToUpload) {
    uploading = fileToUpload.uploading;
    uploadProgress = fileToUpload.uploadProgress;
  }

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
      extra={utils.farsiNum(
        maxFileSize > 0
          ? Words.max_file_size_1 +
              maxFileSize +
              (sizeType === "mb"
                ? Words.max_file_size_2_mb
                : Words.max_file_size_2_kb)
          : Words.max_file_size
      )}
    >
      <>
        <Upload {...props}>
          <Button icon={<UploadIcon />}>{Words.select_file}</Button>
        </Upload>

        {uploading && <Progress percent={uploadProgress} size="small" />}
      </>
    </Form.Item>
  );
};

export default FileItem;
