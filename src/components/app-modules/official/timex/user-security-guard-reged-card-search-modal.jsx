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
import service from "../../../../services/official/timex/user-security-guard-reged-cards-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";

const schema = {
  EmployeeID: Joi.number().min(1).required(),
  FromDate: Joi.string().required(),
  ToDate: Joi.string().allow(""),
};

const initRecord = {
  EmployeeID: 0,
  FromDate: "",
  ToDate: "",
};

const formRef = React.createRef();

const UserSecurityGuardRegedCardSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    employees,
    setEmployees,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = async () => {
    setProgress(true);
    try {
      const data = await service.getParams();

      record.EmployeeID = 0;
      record.FromDate = data.CurrentDateTime.CurrentDate;
      record.ToDate = "";

      setRecord(record);
      setErrors({});
      loadFieldsValue(formRef, record);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees, CurrentDateTime } = data;

      if (filter === null) {
        const inr = { ...initRecord };
        inr.FromDate = CurrentDateTime.CurrentDate;
        setRecord(inr);
      }

      setEmployees(Employees);
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
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserSecurityGuardRegedCardSearchModal;
