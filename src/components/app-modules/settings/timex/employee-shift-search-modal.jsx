import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/settings/timex/employee-shifts-service";
import DropdownItem from "./../../../form-controls/dropdown-item";

const schema = {
  EmployeeID: Joi.number().min(1).required(),
  ShiftID: Joi.number(),
  MonthID: Joi.number(),
  YearNo: Joi.number().min(1).required(),
};

const initRecord = {
  EmployeeID: 0,
  ShiftID: 0,
  MonthID: 0,
  YearNo: 0,
};

const formRef = React.createRef();

const EmployeeShiftSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    employees,
    setEmployees,
    workShifts,
    setWorkShifts,
    monthes,
    setMonthes,
    years,
    setYears,
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
    record.EmployeeID = 0;
    record.ShiftID = 0;
    record.MonthID = 0;
    record.YearNo = years.length > 0 ? years[0].YearNo : 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees, WorkShifts, Years, Monthes } = data;

      setEmployees(Employees);
      setWorkShifts(WorkShifts);
      setMonthes(Monthes);
      setYears(Years);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.employee}
              dataSource={employees}
              keyColumn="EmployeeID"
              valueColumn="FullName"
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
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.year}
              dataSource={years}
              keyColumn="YearNo"
              valueColumn="YearNo"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.month}
              dataSource={monthes}
              keyColumn="MonthID"
              valueColumn="MonthName"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default EmployeeShiftSearchModal;
