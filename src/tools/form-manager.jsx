import React from "react";
import { errorLanguage } from "./language";
import Joi from "joi-browser";
import { Space, Button, Popconfirm, message } from "antd";
import {
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import Words from "../resources/words";
import accessesService from "./../services/app/accesses-service";
import fileService from "./../services/file-service";
import utils from "./utils";
import {
  usePageContext,
  useResetContext,
} from "./../components/contexts/page-context";

export const validateFormProperty = (name, value, schema) => {
  const obj = { [name]: value };
  const property_schema = { [name]: schema[name] };
  const options = { language: errorLanguage };

  const { error } = Joi.validate(obj, property_schema, options);

  return error ? error.details[0].message : null;
};

export const validateProperty = (name, schema, value) => {
  const obj = { [name]: value };
  const fieldSchema = { [name]: schema[name] };
  const options = { language: errorLanguage };

  const { error } = Joi.validate(obj, fieldSchema, options);

  return error ? error.details[0].message : null;
};

export const validateForm = (formConfig) => {
  const { record, schema } = formConfig;
  const options = { abortEarly: false, language: errorLanguage };

  // just validate properties of record, which included in schema
  const validateObject = {};
  for (const key in schema) {
    validateObject[key] = record[key];
  }

  const { error } = Joi.validate(validateObject, schema, options);

  if (!error) return null;

  const errors = {};
  for (let item of error.details) errors[item.path[0]] = item.message;

  return errors;
};

export const hasFormError = (errors) => Object.keys(errors).length > 0;

export const handleError = (ex) => {
  if (ex.response && ex.response.status === 400) {
    if (ex.response.data.Error) {
      message.error(ex.response.data.Error);
    } else {
      message.error(Words.messages.operation_failed);
    }
  } else {
    message.error(Words.messages.operation_failed);
  }
};

export const handleTextChange = (
  errors,
  data,
  schema,
  record,
  setRecord,
  setErrors
) => {
  const { currentTarget: input } = data;
  const name = input.id.replace("dataForm_", "");
  const { value } = input;

  const errs = { ...errors };
  const errorMessage = validateProperty(name, schema, value);
  if (errorMessage) errs[name] = errorMessage;
  //else delete errs[name];
  else {
    if (name === "NationalCode" && !utils.checkNationalCode(value)) {
      errs[name] = Words.invalid_national_code;
    } else delete errs[name];
  }

  const rec = { ...record };
  rec[name] = input.value;
  setRecord(rec);
  setErrors(errs);
};

export const getData = (records) => {
  const data = [...records];

  data.forEach((row, index) => {
    row.key = index;
  });

  return data;
};

export const trimRecord = (object) => {
  for (const key in object) {
    if (typeof object[key] === "string") {
      object[key] = object[key].trim();
    }
  }

  return object;
};

export const getSorter = (fieldName) => (a, b) => {
  if (a[fieldName] < b[fieldName]) return -1;
  if (a[fieldName] > b[fieldName]) return 1;
  return 0;
};

export const loadFieldsValue = (formRef, data) => {
  formRef.current.setFieldsValue(data);
};

export const initModal = (formRef, selectedObject, setRecord) => {
  if (selectedObject && selectedObject !== null) {
    loadFieldsValue(formRef, selectedObject);
    setRecord({ ...selectedObject });
  }
};

export const checkAccess = async (setAccess, pageName) => {
  try {
    const userAccess = await accessesService.getPageAccess(pageName);

    setAccess(userAccess);
  } catch (ex) {
    window.location = "/invalid-access";
  }
};

export const updateSavedRecords = (row, recordID, records, savedRow) => {
  let newRecords = [];

  if (row[recordID] === 0) {
    newRecords = [...records, savedRow];
  } else {
    records[records.findIndex((obj) => obj[recordID] === row[recordID])] =
      savedRow;
    newRecords = records;
  }

  return newRecords;
};

export const saveModalChanges = async (
  formConfig,
  selectedObject,
  setProgress,
  onOk,
  clearRecord
) => {
  const { errors, schema, record } = formConfig;

  if (!hasFormError(errors)) {
    setProgress(true);

    try {
      const rec = trimRecord(record);

      // just validate properties of record, which included in schema
      const rec_to_submit = {};
      for (const key in schema) {
        rec_to_submit[key] = rec[key];
      }

      await onOk(rec_to_submit);
      if (selectedObject === null) clearRecord();

      message.success(Words.messages.success_submit);
    } catch (ex) {
      handleError(ex);
    } finally {
      setProgress(false);
    }
  }
};

export const getColumns = (
  baseColumns,
  getOperationalButtons,
  access,
  onEdit,
  onDelete,
  checkEditableFunc,
  checkDeletableFunc,
  colWidth
) => {
  const { CanEdit, CanDelete } = access;
  let columns = baseColumns;

  if ((CanEdit && onEdit) || (CanDelete && onDelete) || getOperationalButtons) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: colWidth || 110,
        render: (record) => (
          <Space>
            {getOperationalButtons && getOperationalButtons(record)}

            {CanEdit &&
              onEdit &&
              (!checkEditableFunc || checkEditableFunc(record) === true) && (
                <Button
                  type="link"
                  icon={<EditIcon />}
                  onClick={() => onEdit(record)}
                />
              )}

            {CanDelete &&
              onDelete &&
              (!checkDeletableFunc || checkDeletableFunc(record) === true) && (
                <Popconfirm
                  title={Words.questions.sure_to_delete_item}
                  onConfirm={async () => await onDelete(record)}
                  okText={Words.yes}
                  cancelText={Words.no}
                  icon={<QuestionIcon style={{ color: "red" }} />}
                >
                  <Button type="link" icon={<DeleteIcon />} danger />
                </Popconfirm>
              )}
          </Space>
        ),
      },
    ];
  }

  return columns;
};

export const handleDropdownSelectedItemChange = (
  keyColumn,
  value,
  formConfig
) => {
  const { record, setRecord } = formConfig;

  record[keyColumn] = value || 0;
  setRecord(record);
};

export const handlePlusFileUpload = (maxFile, formConfig) => {
  const { counter, setCounter, fileLists, setFileLists } = formConfig;

  if (counter < maxFile) {
    let _counter = counter + 1, _fileLists = [...fileLists];
    const listID = "List" + _counter.toString(); //Warning: This Line Doesn't Change
    _fileLists.push({
      ListID: listID,
      fileList: [],
      file: undefined,
    });

    setCounter(_counter);
    setFileLists(_fileLists);
  }
};

export const handleMinusFileUpload = (listID, formConfig) => {
  const { counter, setCounter, fileLists, setFileLists, record, setRecord } = formConfig;

  if (counter >= 0) {
    let _counter = counter - 1;
    const _fileLists = fileLists.filter(obj => obj.ListID !== listID);
    _fileLists.forEach((element, index) => {
      const listID = "List" + (index+1).toString(); //Warning: This Line Doesn't Change
      element.ListID = listID;
    });
    const _record = record.Files.filter(obj => obj.ListID !== listID);
    _record.forEach((element, index) => {
      const listID = "List" + (index+1).toString(); //Warning: This Line Doesn't Change
      element.ListID = listID;
    });
    record.Files = _record;

    setCounter(_counter);
    setFileLists(_fileLists);
    setRecord(record);
  }
};

export const onUploadProgress = (progressEvent, object, formConfig) => {
  const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

  const { fileLists, setFileLists } = formConfig;
  fileLists.find(f => f.ListID === object.ListID).uploadProgress = progress;

  setFileLists(fileLists);
};

export const handleUpload = async (object, deleteLastFile, fileConfig, formConfig, isEdit, uploadFolder) => {
  const { extensions, maxFileSize } = fileConfig;
  const { fileLists, setFileLists, record, setRecord } = formConfig;

  let result = null;

  if (object.file) {
    const upFileName = object.file.name;

    const fd = new FormData();
    fd.append("dataFile", object.file, upFileName);

    const uploadConditions = { category: uploadFolder, extensions, maxFileSize, };
    const _record = record.Files.find(obj => obj.ListID === object.ListID);

    if (record.Files.length > 0 && record.Files.some(obj => obj.ListID === object.ListID)) {
      if (deleteLastFile === true && _record.FileName.length > 0) {
        uploadConditions.deleteFileName = _record.FileName;
      }
    }

    const list = fileLists.find(f => f.ListID === object.ListID);
    list.uploading = true;
    setFileLists(fileLists);

    result = await fileService.uploadFile(fd, uploadConditions, (e) =>
      onUploadProgress(e, object, formConfig)
    );

    if (isEdit && _record) {
      _record.FileName = result.fileName;
      _record.FileSize = parseInt(object.file.size / 1024);
    }
    else {
      record.Files.push({
        FileID: -1,
        FileName: result.fileName,
        ListID: object.ListID,
        FileSize: parseInt(object.file.size / 1024),
      });
    }
    list.uploading = false;

    setFileLists(fileLists);
    setRecord({ ...record });
  }

  return result;
};

//------------------------------------------------------------------------------

export const GetSimplaDataPageMethods = (config) => {
  const { service, recordID } = config;

  const {
    showModal,
    setShowModal,
    setShowSearchModal,
    selectedObject,
    setSelectedObject,
    setProgress,
    records,
    setRecords,
    setSearched,
    searchText,
    setSearchText,
    setFilter,
  } = usePageContext();

  const resetContext = useResetContext();

  return {
    handleCloseModal: () => {
      setShowModal(false);
      setSelectedObject(null);
    },

    handleGetAll: async () => {
      setProgress(true);

      try {
        const data = await service.getAllData();

        setRecords(data);
        setProgress(false);
        setSearched(true);
        setSearchText("");
      } catch (ex) {
        setProgress(false);
        handleError(ex);
      }
    },

    handleSearch: async () => {
      if (searchText.length > 0) {
        setProgress(true);

        try {
          const data = await service.searchData(searchText);

          setRecords(data);
          setSearched(true);
        } catch (ex) {
          handleError(ex);
        }

        setProgress(false);
      }
    },

    handleAdvancedSearch: async (filter) => {
      setFilter(filter);
      setShowSearchModal(false);

      setProgress(true);

      try {
        const data = await service.searchData(filter);

        setRecords(data);
        setSearched(true);
      } catch (err) {
        handleError(err);
      }

      setProgress(false);
    },

    handleAdd: () => {
      setShowModal(!showModal);
    },

    handleEdit: (obj) => {
      const selectedObject = { ...obj };
      delete selectedObject.key;

      setSelectedObject(selectedObject);
      setShowModal(true);
    },

    handleDelete: async (row) => {
      setProgress(true);

      try {
        // await new Promise((resolve) => setTimeout(resolve, 4000));
        let result = await service.deleteData(row[recordID]);

        if (result.Message) {
          message.success(result.Message);
        } else {
          message.error(result.Error);
        }

        let filteredRecords = records.filter(
          (obj) => obj[recordID] !== row[recordID]
        );

        setRecords(filteredRecords);
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    },

    handleSave: async (row) => {
      const savedRow = await service.saveData(row);

      const updatedRecords = updateSavedRecords(
        row,
        recordID,
        records,
        savedRow
      );

      if (selectedObject !== null) {
        setSelectedObject({ ...savedRow });
      }

      setRecords(updatedRecords);
    },

    handleResetContext: () => {
      resetContext();
    },
  };
};
