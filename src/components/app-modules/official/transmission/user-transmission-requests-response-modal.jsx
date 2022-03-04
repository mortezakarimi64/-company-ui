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
import DropdownItem from "../../../form-controls/dropdown-item";
import service from "../../../../services/official/transmission/user-transmission-requests";

const schema = {
  TransferTypeID: Joi.number().min(1).required(),
  VehicleID: Joi.number(),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.descriptions),
};

const initRecord = {
  TransferTypeID: 0,
  VehicleID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const UserTransmissionRequestsResponseModal = ({
  isOpen,
  request,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    transferTypes,
    setTransferTypes,
    vehicles,
    setVehicles,
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
    record.TransferTypeID = 0;
    record.VehicleID = false;
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
      const data = await service.getResponseParams();

      const { TransferTypes, Vehicles } = data;

      setTransferTypes(TransferTypes);
      setVehicles(Vehicles);
    } catch (err) {
      handleError(err);
    }
  });

  const handleSubmit = async (record) => {
    setProgress(true);

    try {
      record.MissionID = request.MissionID;
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

  const handleSelectTransferType = (value) => {
    record.TransferTypeID = value;

    if (value !== 1) {
      record.VehicleID = 0;

      schema.VehicleID = Joi.number();
      schema.DetailsText = Joi.string()
        .min(5)
        .max(512)
        .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
        .required()
        .label(Words.descriptions);
    } else {
      schema.VehicleID = Joi.number().min(1).required();
      schema.DetailsText = Joi.string()
        .allow("")
        .max(512)
        .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
        .label(Words.descriptions);
    }

    setRecord({ ...record });
    loadFieldsValue(formRef, record);
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
          <Col xs={24}>
            <DropdownItem
              title={Words.transfer_type}
              dataSource={transferTypes}
              keyColumn="TransferTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              onChange={handleSelectTransferType}
            />
          </Col>

          {record.TransferTypeID === 1 && (
            <Col xs={24}>
              <DropdownItem
                title={Words.vehicle}
                dataSource={vehicles}
                keyColumn="VehicleID"
                valueColumn="Title"
                formConfig={formConfig}
                required
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
              required={record.TransferTypeID !== 1}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserTransmissionRequestsResponseModal;
