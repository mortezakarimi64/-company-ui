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
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import TimeItem from "./../../../form-controls/time-item";
import InputItem from "./../../../form-controls/input-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";

const schema = {
  ShiftID: Joi.number().required(),
  ShiftCode: Joi.string()
    .min(1)
    .max(5)
    .required()
    .label(Words.shift_code)
    // .regex(/^[a-zA-Z0-9.\-()\s]+$/),
    .regex(/^[a-zA-Z0-9]+$/),
  StartTime: Joi.string().required(),
  FinishTime: Joi.string().required(),
  UnDelayInMin: Joi.number().required(),
  UnHurryupInMin: Joi.number().required(),
  UnExtraEnterInMin: Joi.number().required(),
  UnExtraExitInMin: Joi.number().required(),
};

const initRecord = {
  ShiftID: 0,
  ShiftCode: "",
  StartTime: "",
  FinishTime: "",
  UnDelayInMin: 0,
  UnHurryupInMin: 0,
  UnExtraEnterInMin: 0,
  UnExtraExitInMin: 0,
};

const formRef = React.createRef();

const WorkShiftModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
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
    record.ShiftCode = "";
    record.StartTime = "";
    record.FinishTime = "";
    record.UnDelayInMin = 0;
    record.UnHurryupInMin = 0;
    record.UnExtraEnterInMin = 0;
    record.UnExtraExitInMin = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);
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
            <InputItem
              title={Words.shift_code}
              fieldName="ShiftCode"
              required
              autoFocus
              maxLength={5}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              required
              title={Words.start_time}
              fieldName="StartTime"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              required
              title={Words.finish_time}
              fieldName="FinishTime"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.un_delay_in_min}
              fieldName="UnDelayInMin"
              min={0}
              max={60}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.un_hurryup_in_min}
              fieldName="UnHurryupInMin"
              min={0}
              max={60}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.un_extra_enter_in_min}
              fieldName="UnExtraEnterInMin"
              min={0}
              max={60}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.un_extra_exit_in_min}
              fieldName="UnExtraExitInMin"
              min={0}
              max={60}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default WorkShiftModal;
