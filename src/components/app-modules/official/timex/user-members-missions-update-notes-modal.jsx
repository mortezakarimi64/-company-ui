import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Button, Popconfirm } from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  CheckOutlined as CheckIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
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
import InputItem from "../../../form-controls/input-item";
import SwitchItem from "../../../form-controls/switch-item";
import ModalWindow from "./../../../common/modal-window";

const schema = {
  NoteID: Joi.number().required(),
  DetailsText: Joi.string()
    .min(20)
    .max(1024)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .required()
    .label(Words.report_text),
  VisibleForEmployee: Joi.boolean(),
};

const initRecord = {
  NoteID: 0,
  DetailsText: "",
  VisibleForEmployee: false,
};

const formRef = React.createRef();

const UserMembersMissionsUpdateNotesModal = ({
  isOpen,
  mission,
  selectedNote,
  onCancel,
  onSaveNote,
}) => {
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

  const clearRecord = async () => {
    record.DetailsText = "";
    record.VisibleForEmployee = false;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();

    setRecord(initRecord);
    setErrors({});
    initModal(formRef, selectedNote, setRecord);
  });

  const handleSaveNote = async (record) => {
    setProgress(true);

    try {
      if (!record.MissionID) record.MissionID = mission.MissionID;
      await onSaveNote(record);

      onCancel();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getFooterButtons = () => {
    let footerButtons = [
      <Popconfirm
        title={Words.questions.sure_to_submit_note}
        onConfirm={async () => await handleSaveNote(record)}
        okText={Words.yes}
        cancelText={Words.no}
        icon={<QuestionIcon style={{ color: "red" }} />}
        key="submit-confirm"
        disabled={disabled}
      >
        <Button
          type="primary"
          icon={<CheckIcon />}
          loading={progress}
          disabled={disabled}
        >
          {Words.submit}
        </Button>
      </Popconfirm>,

      <Button key="clear-button" onClick={clearRecord}>
        {Words.clear}
      </Button>,

      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  const disabled = validateForm({ record, schema }) && true;

  return (
    <ModalWindow
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={selectedNote === null ? Words.new_note : Words.edit_note}
      footer={getFooterButtons()}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              horizontal
              autoFocus
              title={Words.note_text}
              fieldName="DetailsText"
              formConfig={formConfig}
              multiline
              rows={10}
              maxLength={1024}
              showCount
            />
          </Col>
          <Col xs={24}>
            <SwitchItem
              title={Words.visible_for_employee}
              fieldName="VisibleForEmployee"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMembersMissionsUpdateNotesModal;
