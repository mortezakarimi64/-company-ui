import React from "react";
import { useMount } from "react-use";
import {
  Form,
  Row,
  Col,
  Button,
  Popconfirm,
  Collapse,
  Alert,
  Tag,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  CheckOutlined as CheckIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as ApprovedIcon,
  CloseCircleOutlined as CloseIcon,
  StarOutlined as StarIcon,
  ThunderboltOutlined as CorrectionIcon,
  UserOutlined as PersonIcon,
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
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "./../../../common/modal-window";

const { Panel } = Collapse;
const { Text } = Typography;

const statuses = [
  { StatusID: 2, Title: Words.accept_request },
  { StatusID: 3, Title: Words.reject_request },
  { StatusID: 4, Title: Words.need_correction },
];

const schema = {
  DetailsText: Joi.string()
    .allow("")
    .max(1024)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.manager_response),
  StatusID: Joi.number().min(1).required(),
};

const initRecord = {
  DetailsText: "",
};

const formRef = React.createRef();

const UserMembersMissionNewReportsModal = ({
  isOpen,
  mission,
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
    record.DetailsText = "";
    record.StatusID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, initRecord, setRecord);
  });

  const handleSubmit = async (report) => {
    setProgress(true);

    try {
      record.ReportID = report.ReportID;

      await onOk(record);

      clearRecord();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const disabled = validateForm({ record, schema }) && true;

  const getStatusTag = (report) => {
    let result = <></>;

    switch (report.StatusID) {
      case 1:
        result = (
          <Tag icon={<StarIcon />} color="error">
            {Words.new}
          </Tag>
        );
        break;

      case 2:
        result = (
          <Tag icon={<ApprovedIcon />} color="success">
            {Words.accepted}
          </Tag>
        );
        break;

      case 3:
        result = (
          <Tag icon={<CloseIcon />} color="error">
            {Words.rejected}
          </Tag>
        );
        break;

      case 4:
        result = (
          <Tag icon={<CorrectionIcon />} color="error">
            {Words.need_correction}
          </Tag>
        );
        break;

      default:
        result = <></>;
        break;
    }

    return result;
  };

  const handleStatusChange = (value) => {
    record.StatusID = value;

    // 3: Reject
    // 4: Need Correction
    if (value === 3 || value === 4) {
      schema.DetailsText = Joi.string()
        .min(20)
        .max(1024)
        .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
        .required()
        .label(Words.manager_response);
    } else {
      schema.DetailsText = Joi.string()
        .allow("")
        .max(1024)
        .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
        .label(Words.manager_response);
    }

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  return (
    <ModalWindow
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.mission_report}
      footer={[
        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <Form.Item>
              {mission.ReportInfo.length > 0 ? (
                <Collapse accordion>
                  {mission.ReportInfo.map((report) => (
                    <Panel
                      key={report.ReportID}
                      header={
                        <Row gutter={[1, 5]}>
                          <Col xs={24} md={19}>
                            <Tag icon={<CalendarIcon />} color="processing">
                              {`${utils.weekDayNameFromText(
                                report.RegDate
                              )} ${utils.farsiNum(
                                utils.slashDate(report.RegDate)
                              )}`}
                            </Tag>
                            <Tag icon={<ClockIcon />} color="processing">
                              {utils.farsiNum(utils.colonTime(report.RegTime))}
                            </Tag>
                          </Col>
                          <Col xs={24} md={5}>
                            {getStatusTag(report)}
                          </Col>
                        </Row>
                      }
                    >
                      <Row gutter={[1, 5]}>
                        <Col xs={24}>
                          <Text
                            style={{
                              color: Colors.purple[7],
                              whiteSpace: "pre-line",
                            }}
                          >
                            {utils.farsiNum(report.DetailsText)}
                          </Text>
                        </Col>
                        {report.ManagerMemberID === 0 ? (
                          <>
                            <Col xs={24}>
                              <Divider />
                            </Col>
                            <Col xs={24}>
                              <InputItem
                                autoFocus
                                title={Words.manager_response}
                                fieldName="DetailsText"
                                formConfig={formConfig}
                                multiline
                                rows={10}
                                maxLength={1024}
                                showCount
                                required={
                                  record.StatusID === 3 || record.StatusID === 4
                                }
                              />
                            </Col>
                            <Col xs={24}>
                              <DropdownItem
                                title={Words.mission_reply_status}
                                dataSource={statuses}
                                keyColumn="StatusID"
                                valueColumn="Title"
                                formConfig={formConfig}
                                required
                                onChange={handleStatusChange}
                              />
                            </Col>
                            <Col xs={24}>
                              <Space>
                                <Button
                                  key="clear-button"
                                  onClick={clearRecord}
                                >
                                  {Words.clear}
                                </Button>

                                <Popconfirm
                                  title={
                                    Words.questions.sure_to_submit_report_reply
                                  }
                                  onConfirm={async () =>
                                    await handleSubmit(report)
                                  }
                                  okText={Words.yes}
                                  cancelText={Words.no}
                                  icon={
                                    <QuestionIcon style={{ color: "red" }} />
                                  }
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
                                </Popconfirm>
                              </Space>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col xs={24}>
                              <Divider orientation="right" plain>
                                <Text style={{ fontSize: 12 }}>
                                  {Words.manager_response}
                                </Text>
                              </Divider>
                            </Col>
                            <Col xs={24}>
                              <Text
                                style={{
                                  color: Colors.grey[7],
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {utils.farsiNum(report.ManagerDetailsText)}
                              </Text>
                            </Col>
                            <Col xs={24}>
                              <Row gutter={[1, 5]}>
                                <Col xs={24} md={8}>
                                  <Tag icon={<CalendarIcon />} color="magenta">
                                    {`${utils.weekDayNameFromText(
                                      report.ManagerResponseDate
                                    )} ${utils.farsiNum(
                                      utils.slashDate(report.RegDate)
                                    )}`}
                                  </Tag>

                                  <Tag icon={<ClockIcon />} color="magenta">
                                    {utils.farsiNum(
                                      utils.colonTime(
                                        report.ManagerResponseTime
                                      )
                                    )}
                                  </Tag>
                                </Col>
                                <Col xs={24} md={16}>
                                  <Tag icon={<PersonIcon />} color="purple">
                                    {`${report.ManagerFirstName} ${report.ManagerLastName}`}
                                  </Tag>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Alert
                  message={Words.messages.no_report_submitted_yet}
                  type="warning"
                  showIcon
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMembersMissionNewReportsModal;
