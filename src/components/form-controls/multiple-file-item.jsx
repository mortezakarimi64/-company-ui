import React from "react";
import { Form, Upload, Button, Progress, message } from "antd";
import { UploadOutlined as UploadIcon } from "@ant-design/icons";
import Words from "../../resources/words";
import utils from "../../tools/utils";

const getUploadProps = (fileConfig, formConfig, listID) => {
  const { maxFileSize, sizeType } = fileConfig;
  const { fileLists, setFileLists, record, setRecord, } = formConfig;

  let _fileLists = [...fileLists];
  const temp = _fileLists.find(f => f.ListID === listID);
  const fileList = temp ? temp.fileList : undefined;

  const handleChange = info => {
    let fList = [...info.fileList];
    fList = fList.slice(-1);
    
    if(fList.length > 0) {
      const list = _fileLists.find(f => f.ListID === listID);
      list.fileList = fList;
      list.file = info.file;

      setFileLists(_fileLists);
    }
  };

  const props = {
    onChange: handleChange,
    onRemove: (file) => {
      const list = _fileLists.find(f => f.ListID === listID);
      list.fileList = [];
      list.file = undefined;

      setFileLists(_fileLists);

      const _record = record.Files.find(obj => obj.ListID === listID);
      if (_record) {
        _record.FileName = "";
        _record.FileSize = 0;
      }
      setRecord(record);
    },
    beforeUpload: (file) => {
      const validFileSize = file.size / 1024 / (sizeType === "mb" ? 1024 : 1) <= maxFileSize;

      if (!validFileSize) {
        message.error(Words.limit_upload_file_size);

        //prevent auto upload
        return false;
      }

      //prevent auto upload
      return false;
    },
    fileList: fileList ? fileList : [],
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  return props;
};

const MultipleFileItem = ({ title, fieldName, noLabel, required, horizontal, labelCol, formConfig, 
  fileConfig, listID, disabled, }) => {
  const { errors, fileLists } = formConfig;
  const { maxFileSize, sizeType } = fileConfig;

  const _disabled = disabled !== undefined ? disabled : false;
  const props = getUploadProps(fileConfig, formConfig, listID);

  let uploading = false;
  let uploadProgress = 0;

  const fileToUpload = fileLists.find(f => f.ListID === listID);
  if (fileToUpload) {
    uploading = fileToUpload.uploading;
    uploadProgress = fileToUpload.uploadProgress;
  }

  return (
    <Form.Item
      labelCol={{ span: horizontal && horizontal !== false ? labelCol : 24 }}
      wrapperCol={{ span: horizontal && horizontal !== false ? 24 - labelCol : 24, }}
      label={noLabel ? "" : title}
      name={fieldName}
      help={errors[fieldName]}
      hasFeedback
      valuePropName="fileList"
      required={required && required}
      validateStatus={errors[fieldName] === undefined ? "" : errors[fieldName] != null ? "error" : "success"}
      extra={utils.farsiNum(
        maxFileSize > 0 ? Words.max_file_size_1 + maxFileSize + 
          (sizeType === "mb" ? Words.max_file_size_2_mb : Words.max_file_size_2_kb) 
        : Words.max_file_size
      )}
    >
      <>
        <Upload {...props} disabled={_disabled}>
          <Button icon={<UploadIcon />}>{Words.select_file}</Button>
        </Upload>

        {uploading && <Progress percent={uploadProgress} size="small" />}
      </>
    </Form.Item>
  );
};

export default MultipleFileItem;
