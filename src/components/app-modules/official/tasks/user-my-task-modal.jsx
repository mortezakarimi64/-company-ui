import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, message, Button } from "antd";
import { DeleteOutlined as DeleteIcon, } from "@ant-design/icons";
import Joi from "joi-browser";

import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import { validateForm, loadFieldsValue, initModal, handleError, hasFormError, trimRecord, handlePlusFileUpload, 
  handleMinusFileUpload, handleUpload, } from "../../../../tools/form-manager";
import { useModalContext, useResetContext, } from "../../../contexts/modal-context";
import { fileSize as fileConfig, fileBasicUrl, } from "../../../../config.json";

import InputItem from "../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";
import MultipleFileItem from "../../../form-controls/multiple-file-item";

import ModalWindow from "../../../common/modal-window";

import service from "../../../../services/official/tasks/user-my-tasks-service";
import fileService from "../../../../services/file-service";

const schema = {
  TaskID: Joi.number().required(),
  IntervalID: Joi.number().required(),
  Title: Joi.string().min(2).max(50).required().regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/),
  ResponseMemberID: Joi.number().min(1).required(),
  DetailsText: Joi.string().allow("").max(512).regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/),
  ReminderDate: Joi.string().allow(""),
  ReminderTime: Joi.string().allow(""),
  LetterID: Joi.array().items(Joi.number().allow("")),
  Letters: Joi.array().items(
    Joi.object().keys({
      RowID: Joi.number().required(),
      LetterID: Joi.number().required(),
    }),
  ),
  TagID: Joi.array().items(Joi.number().allow("")),
  Tags: Joi.array().items(
    Joi.object().keys({
      RowID: Joi.number().required(),
      TagID: Joi.number().required(),
    }),
  ),
  SupervisorMemberID: Joi.array().items(Joi.number().allow("")),
  Supervisors: Joi.array().items(
    Joi.object().keys({
      SupervisorID: Joi.number().required(),
      MemberID: Joi.number().required(),
    }),
  ),
  Files: Joi.array().items(
    Joi.object().keys({
      FileID: Joi.number().required(),
      FileName: Joi.string().required(),
      ListID: Joi.string().required(),
      FileSize: Joi.number().required(),
    }),
  ),
};

const initRecord = {
  TaskID: 0,
  IntervalID: 0,
  Title: "",
  ResponseMemberID: 0,
  DetailsText: "",
  ReminderDate: "",
  ReminderTime: "",
  LetterID: [],
  Letters: [],
  TagID: [],
  Tags: [],
  SupervisorMemberID: [],
  Supervisors: [],
  Files: [], //Warning: This Line Doesn't Change
};

const formRef = React.createRef();
const uploadFolder = "tasks";
const maxFile = 5;

const handleSubmitWithFile = async (fileConfig, formConfig, selectedObject, onOk, clearRecord, isEdit) => {
  const { errors, record, fileLists, setFileLists, setProgress, schema } = formConfig;

  if (!hasFormError(errors)) {
    setProgress(true);

    try {
      if (record.ReminderDate.length > 0 || record.ReminderTime.length > 0) {
        if (record.ReminderDate.length > 0 && record.ReminderTime.length <= 0) { return message.error(Words.messages.reminder_select); }
        if (record.ReminderDate.length <= 0 && record.ReminderTime.length > 0) { return message.error(Words.messages.reminder_select); }
      }

      for (const obj of fileLists) { await handleUpload(obj, true, fileConfig, formConfig, isEdit, uploadFolder); }
  
      const _record = { ...record };
      const letters = isEdit ? selectedObject.Letters : null;
      const tags = isEdit ? selectedObject.Tags : null;
      const supervisors = isEdit ? selectedObject.Supervisors : null;
      _record.Letters = utils.convertArrayToObject(_record.LetterID, letters, isEdit, "RowID", "LetterID");
      _record.Tags = utils.convertArrayToObject(_record.TagID, tags, isEdit, "RowID", "TagID");
      _record.Supervisors = utils.convertArrayToObject(_record.SupervisorMemberID, supervisors, isEdit, "SupervisorID", "MemberID");
  
      
      const rec = trimRecord(_record);
      // just validate properties of record, which included in schema
      const rec_to_submit = {};
      for (const key in schema) {
        rec_to_submit[key] = rec[key];
      }

      await onOk(rec_to_submit);
      if (selectedObject === null) { clearRecord(); }
      else { 
        const _Files = selectedObject.Files ? utils.getDataFromJsonAsObject(selectedObject.Files, ["FileID", "FileName", "FileSize"]) : [];
        _Files.forEach(element => {
          const obj = record.Files.find(obj => obj.FileID === element.FileID);
          if (obj === undefined) { fileService.deleteFile(element.FileName, uploadFolder); }
          else {
            if (obj.FileName.length <= 0 && element.FileName.length > 0) { 
              fileService.deleteFile(element.FileName, uploadFolder); 
            }
          }
        });

        record.Files.forEach(element => {
          const list = fileLists.find(f => f.ListID === element.ListID);
          list.fileList[0].name = element.FileName;
          list.fileList[0].url = `${fileBasicUrl}/${uploadFolder}/${element.FileName}`;
          setFileLists(fileLists);
        });
      }

      message.success(Words.messages.success_submit);
    } catch (ex) {
      handleError(ex);
    } finally {
      setProgress(false);
    }
  }
};

const UserMyTasksModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors, members, setMembers, 
    intervals, setIntervals, supervisors, setSupervisors, tags, setTags, letters, setLetters,
    fileLists, setFileLists, counter, setCounter, } = useModalContext();
  const formConfig = { schema, record, setRecord, errors, setErrors, fileLists, setFileLists, 
    progress, setProgress, counter, setCounter, };
  const resetContext = useResetContext();
  const isEdit = selectedObject !== null;

  const clearRecord = () => {
    record.IntervalID = 0;
    record.Title = "";
    record.ResponseMemberID = 0;
    record.DetailsText = "";
    record.ReminderDate = "";
    record.ReminderTime = "";
    record.LetterID = [];
    record.Letters = [];
    record.TagID = [];
    record.Tags = [];
    record.SupervisorMemberID = [];
    record.Supervisors = [];
    record.Files = [];

    setRecord(record);
    setErrors({});
    setCounter(0);
    setFileLists([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    const _selectedObject = isEdit ? { ...selectedObject } : null;
    const _fileLists = [];
    if (isEdit) {
      _selectedObject.LetterID = selectedObject.Letters ? utils.getDataFromJsonAsArray(selectedObject.Letters, "LetterID") : [];
      _selectedObject.Letters = selectedObject.Letters ? utils.getDataFromJsonAsObject(selectedObject.Letters, ["RowID", "LetterID"]) : [];
      _selectedObject.TagID = selectedObject.Tags ? utils.getDataFromJsonAsArray(selectedObject.Tags, "TagID") : [];
      _selectedObject.Tags = selectedObject.Tags ? utils.getDataFromJsonAsObject(selectedObject.Tags, ["RowID", "TagID"]) : [];
      _selectedObject.SupervisorMemberID = selectedObject.Supervisors ? utils.getDataFromJsonAsArray(selectedObject.Supervisors, "MemberID") : [];
      _selectedObject.Supervisors = selectedObject.Supervisors ? utils.getDataFromJsonAsObject(selectedObject.Supervisors, ["SupervisorID", "MemberID"]) : [];
      _selectedObject.Files = selectedObject.Files ? utils.getDataFromJsonAsObject(selectedObject.Files, ["FileID", "FileName", "FileSize"]) : [];
      
      _selectedObject.Files.forEach((element, index) => {
        const name = "List"+(index+1).toString(); //Warning: This Line Doesn't Change
        element.ListID = name;
        _fileLists.push({
          ListID: name,
          fileList: [{
            uid: element.FileID,
            name: element.FileName,
            status: 'done',
            size: element.FileSize * 1024,
            url: `${fileBasicUrl}/${uploadFolder}/${element.FileName}`,
          }],
          file: undefined,
        });
      });
    }
    const count = isEdit ? _selectedObject.Files.length : 0;
    
    resetContext();
    setRecord(initRecord);
    setCounter(count);
    setFileLists(_fileLists);
    initModal(formRef, _selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      let _supervisors = [];
      data.Members.forEach(member => {
        _supervisors.push({
          SupervisorMemberID: member.ResponseMemberID,
          FullName: member.FullName,
        });
      });

      setMembers(data.Members);
      setIntervals(data.Intervals);
      setLetters(data.Letters);
      setTags(data.Tags);
      setSupervisors(_supervisors);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleSubmit = async () => {
    await handleSubmitWithFile(fileConfig, formConfig, selectedObject, onOk, clearRecord, isEdit);
  };

  const disabled = isEdit ? (selectedObject.ReportCount > 0 ? true : false) : false;

  const taskFiles = [];
  for(let i = 0; i < counter; i++) {
    const name = "File"+(i+1).toString();
    const listID = "List"+(i+1).toString(); //Warning: This Line Doesn't Change
    taskFiles.push(
      <Col xs={24}>
        <Row gutter={[5, 1]} justify="space-between">
          <Col xs={20}>
            <MultipleFileItem horizontal title={Words.file} fieldName={name} listID={listID} formConfig={formConfig} 
              fileConfig={fileConfig} disabled={disabled} />
          </Col>
          <Col xs={4} style={{ textAlign: "left", }}>
            <Button type="link" icon={<DeleteIcon />} danger disabled={disabled}
              onClick={() => handleMinusFileUpload(listID, formConfig)} />
          </Col>
        </Row>
      </Col>
    );
  }
  
  return (
    <ModalWindow isOpen={isOpen} isEdit={isEdit} inProgress={progress} width={650}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord} onSubmit={handleSubmit} onCancel={onCancel}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem title={Words.title} fieldName="Title" required autoFocus maxLength={50} formConfig={formConfig} disabled={disabled} />
          </Col>
          <Col xs={24}>
            <DropdownItem title={Words.intervalTasks} dataSource={intervals} formConfig={formConfig} required={false}
              keyColumn="IntervalID" valueColumn="Title" disabled={disabled}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem title={Words.responseMember} dataSource={members} formConfig={formConfig} required
              keyColumn="ResponseMemberID" valueColumn="FullName" disabled={disabled}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem horizontal title={Words.reminder_date} fieldName="ReminderDate" formConfig={formConfig} required={false} disabled={disabled} />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem horizontal title={Words.reminder_time} fieldName="ReminderTime" formConfig={formConfig} required={false} disabled={disabled} />
          </Col>
          <Col xs={24}>
            <DropdownItem title={Words.letters} dataSource={letters} formConfig={formConfig} required={false} disabled={disabled}
              keyColumn="LetterID" valueColumn="Title" mode="multiple" initialValue={[]} showFirstOption={false}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem title={Words.tags} dataSource={tags} formConfig={formConfig} required={false} disabled={disabled}
              keyColumn="TagID" valueColumn="Title" colorColumn="Color" mode="multiple" initialValue={[]} showFirstOption={false}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem title={Words.supervisors} dataSource={supervisors} formConfig={formConfig} required={false}
              keyColumn="SupervisorMemberID" valueColumn="FullName" mode="multiple" initialValue={[]} showFirstOption={false}
            />
          </Col>
          {taskFiles.map((file, index) => (<div key={index} style={{ width: "100%", }}>{file}</div>))}
          <Button type="primary" disabled={disabled} onClick={() => handlePlusFileUpload(maxFile, formConfig)} style={{ margin: 5, }}>
            {Words.addAnotherFile}
          </Button>
          <Col xs={24}>
            <InputItem title={Words.descriptions} fieldName="DetailsText" multiline rows={5} showCount maxLength={512} formConfig={formConfig} disabled={disabled} />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMyTasksModal;
