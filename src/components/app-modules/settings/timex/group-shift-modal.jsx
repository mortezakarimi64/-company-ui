import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/settings/timex/group-shifts-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";

const schema = {
  GSID: Joi.number().required(),
  DepartmentID: Joi.number().min(1).required(),
  ShiftID: Joi.number().min(1).required(),
  ShiftDate: Joi.string().required(),
};

const initRecord = {
  GSID: 0,
  DepartmentID: 0,
  ShiftID: 0,
  ShiftDate: "",
};

const formRef = React.createRef();

const GroupShiftModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    departments,
    setDepartments,
    workShifts,
    setWorkShifts,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.DepartmentID = 0;
    record.ShiftID = 0;
    record.ShiftDate = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      setDepartments(data.Departments);
      setWorkShifts(data.WorkShifts);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.work_shift}
              dataSource={workShifts}
              keyColumn="ShiftID"
              valueColumn="ShiftInfo"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <DateItem
              horizontal
              title={Words.shift_date}
              fieldName="ShiftDate"
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default GroupShiftModal;
