import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
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
import service from "../../../../services/official/timex/user-security-guard-reged-cards-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";
import InputItem from "../../../form-controls/input-item";
import TextItem from "../../../form-controls/text-item";
import MemberProfileImage from "../../../common/member-profile-image";

const schema = {
  RegID: Joi.number().required(),
  EmployeeID: Joi.number().min(1).required(),
  CardRegDate: Joi.string().required(),
  CardRegTime: Joi.string().required(),
  DetailsText: Joi.string().allow("").max(512),
};

const initRecord = {
  RegID: 0,
  EmployeeID: 0,
  CardRegDate: "",
  CardRegTime: "",
  DetailsText: "",
};

const formRef = React.createRef();

const UserSecurityGuardRegedCardModal = ({
  isOpen,
  selectedObject,
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
      record.CardRegDate = data.CurrentDateTime.CurrentDate;
      record.CardRegTime = "";
      record.DetailsText = "";

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
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      if (selectedObject === null) {
        const inr = { ...initRecord };
        inr.CardRegDate = data.CurrentDateTime.CurrentDate;
        inr.CardRegTime = data.CurrentDateTime.CurrentTime;

        setRecord(inr);
      }

      setEmployees(data.Employees);
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
          {isEdit && (
            <>
              <Col
                xs={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <MemberProfileImage fileName={record.PicFileName} size={60} />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.member}
                  value={`${record.FirstName} ${record.LastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}

          {!isEdit && (
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
          )}

          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.reg_date}
              fieldName="CardRegDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              title={Words.reg_time}
              fieldName="CardRegTime"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.descriptions}
              fieldName="DetailsText"
              formConfig={formConfig}
              multiline
              rows={7}
              maxLength={512}
              showCount
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserSecurityGuardRegedCardModal;
