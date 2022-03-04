import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Button, Modal, Popconfirm } from "antd";
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

const schema = {
  IsAccepted: Joi.boolean(),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.descriptions),
};

const initRecord = {
  IsAccepted: false,
  DetailsText: "",
};

const formRef = React.createRef();

const UserVacationReplaceWorkRequestResponseModal = ({
  isOpen,
  vacation,
  onOk,
  onCancel,
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
    record.IsAccepted = false;
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, initRecord, setRecord);
  });

  const handleSubmit = async (record) => {
    setProgress(true);

    try {
      record.VacationID = vacation.VacationID;
      await onOk(record);
      onCancel();
    } catch (err) {
      handleError(err);
      setProgress(false);
    }
  };

  const disabled = validateForm({ record, schema }) && true;

  const getFooterButtons = () => {
    let footerButtons = [
      <Popconfirm
        title={Words.questions.sure_to_submit_response_for_replace_work_request}
        onConfirm={async () => await handleSubmit(record)}
        okText={Words.yes}
        cancelText={Words.no}
        icon={<QuestionIcon style={{ color: "red" }} />}
        disabled={disabled}
        key="submit-confirm"
      >
        <Button
          type="primary"
          icon={<CheckIcon />}
          danger
          loading={progress}
          disabled={disabled}
        >
          {Words.submit}
        </Button>
      </Popconfirm>,

      <Button key="clear-button" onClick={clearRecord}>
        {Words.clear}
      </Button>,

      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.newInfo}
      footer={getFooterButtons()}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.your_response}
              fieldName="IsAccepted"
              initialValue={false}
              checkedTitle={Words.im_accept_replace_work_request}
              unCheckedTitle={Words.im_not_accept_replace_work_request}
              formConfig={formConfig}
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
    </Modal>
  );
};

export default UserVacationReplaceWorkRequestResponseModal;
