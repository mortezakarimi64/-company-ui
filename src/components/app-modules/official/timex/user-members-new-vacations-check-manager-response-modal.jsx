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
import DropdownItem from "../../../form-controls/dropdown-item";
import service from "../../../../services/official/timex/user-members-new-vacations-check-manager-service";

const schema = {
  MemberID: Joi.number(),
  IsAccepted: Joi.boolean(),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.descriptions),
};

const initRecord = {
  MemberID: 0,
  IsAccepted: false,
  DetailsText: "",
};

const formRef = React.createRef();

const UserMembersNewVacationsCheckManagerResponseModal = ({
  isOpen,
  vacation,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    members,
    setMembers,
    errors,
    setErrors,
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
    record.MemberID = 0;
    record.IsAccepted = false;
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, initRecord, setRecord);

    try {
      const { MemberID, SwapMemberID } = vacation;

      const data = await service.getSwapableMembers(MemberID, SwapMemberID);

      const { Members } = data;

      setMembers([...Members]);
    } catch (err) {
      handleError(err);
    }
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
        title={Words.questions.sure_to_submit_response}
        onConfirm={async () => await handleSubmit(record)}
        okText={Words.yes}
        cancelText={Words.no}
        icon={<QuestionIcon style={{ color: "red" }} />}
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
              checkedTitle={Words.im_accept_request}
              unCheckedTitle={Words.im_not_accept_request}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          {members.length > 0 && (
            <Col xs={24}>
              <DropdownItem
                title={Words.swap_member}
                dataSource={members}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
              />
            </Col>
          )}
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

export default UserMembersNewVacationsCheckManagerResponseModal;
