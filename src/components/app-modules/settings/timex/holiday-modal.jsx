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
} from "../../../../tools/form-manager";
import TextItem from "./../../../form-controls/text-item";
import InputItem from "./../../../form-controls/input-item";
import DateItem from "./../../../form-controls/date-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import utils from "./../../../../tools/utils";

const schema = {
  HolidayID: Joi.number().required(),
  HolidayDate: Joi.string().required().label(Words.holiday_date),
  DetailsText: Joi.string().max(255).allow("").label(Words.descriptions),
};

const initRecord = {
  HolidayID: 0,
  HolidayDate: "",
  DetailsText: "",
};

const formRef = React.createRef();

const HolidayModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
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
    record.HolidayDate = "";
    record.DetailsText = "";

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
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            {isEdit && (
              <Col xs={24}>
                <TextItem
                  title={Words.holiday_date}
                  value={utils.farsiNum(
                    utils.slashDate(`${record.HolidayDate}`)
                  )}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}

            {!isEdit && (
              <DateItem
                horizontal
                title={Words.holiday_date}
                fieldName="HolidayDate"
                required
                formConfig={formConfig}
              />
            )}

            <Col xs={24}>
              <InputItem
                title={Words.descriptions}
                fieldName="DetailsText"
                maxLength={255}
                formConfig={formConfig}
                multiline
                showCount
              />
            </Col>
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default HolidayModal;
