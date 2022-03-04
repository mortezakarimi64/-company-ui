import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "../../../form-controls/input-item";
import DropdownItem from "../../../form-controls/dropdown-item";
import departmentsService from "../../../../services/settings/org/departments-service";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  DepartmentID: Joi.number().required(),
  ParentDepartmentID: Joi.number().required(),
  DepartmentTitle: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/),
};

const initRecord = {
  DepartmentID: 0,
  ParentDepartmentID: 0,
  DepartmentTitle: "",
};

const formRef = React.createRef();

const DepartmentModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [parentDepartments, setParentDepartments] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.DepartmentTitle = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const data = await departmentsService.getParams();

    setParentDepartments(
      data.filter((d) => d.ParentDepartmentID !== record.DepartmentID)
    );
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.parent_department}
              dataSource={parentDepartments}
              keyColumn="ParentDepartmentID"
              valueColumn="ParentDepartmentTitle"
              autoFocus
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="DepartmentTitle"
              required
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default DepartmentModal;
