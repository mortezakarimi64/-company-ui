import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  //   handleError,
} from "../../../../tools/form-manager";
import DropdownItem from "../../../form-controls/dropdown-item";
import TextItem from "../../../form-controls/text-item";
import InputItem from "../../../form-controls/input-item";
import service from "../../../../services/settings/org/role-duties-service";
import utils from "../../../../tools/utils";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  RoleDutyID: Joi.number().required(),
  RoleID: Joi.number().required().min(1),
  LevelID: Joi.number().required().min(1),
  Title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.title),
  DetailsText: Joi.string()
    .allow("")
    .max(1024)
    // .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.descriptions),
};

const initRecord = {
  RoleDutyID: 0,
  RoleID: 0,
  LevelID: 0,
  Title: "",
  DetailsText: "",
};

const formRef = React.createRef();

const RoleDutyModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    dutyLevels,
    setDutyLevels,
    roles,
    setRoles,
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
    record.RoleID = 0;
    record.LevelID = 0;
    record.Title = "";
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const data = await service.getParams();

    setDutyLevels(data.Levels);
    setRoles(data.Roles);
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
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {isEdit && (
            <Col xs={24}>
              <TextItem
                title={Words.role}
                value={record.RoleTitle}
                valueColor={Colors.magenta[6]}
              />
            </Col>
          )}

          {!isEdit && (
            <Col xs={24}>
              <DropdownItem
                title={Words.role}
                dataSource={roles}
                keyColumn="RoleID"
                valueColumn="RoleTitle"
                formConfig={formConfig}
                required
                autoFocus
              />
            </Col>
          )}

          <Col xs={24}>
            <DropdownItem
              title={Words.duty_level}
              dataSource={dutyLevels}
              keyColumn="LevelID"
              valueColumn="LevelTitle"
              formConfig={formConfig}
              required
              autoFocus={isEdit}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              required
              maxLength={100}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              showCount
              rows={7}
              maxLength={1024}
              formConfig={formConfig}
            />
          </Col>
          {isEdit && (
            <>
              <Col xs={24} ms={12}>
                <TextItem
                  title={Words.reg_member}
                  value={`${record.RegFirstName} ${record.RegLastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24} md={12}>
                <TextItem
                  title={Words.reg_date_time}
                  value={utils.formattedDateTime(
                    record.RegDate,
                    record.RegTime
                  )}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default RoleDutyModal;
