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
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  CheckOutlined as CheckIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as ApprovedIcon,
  CloseCircleOutlined as CloseIcon,
  FieldTimeOutlined as WaitingIcon,
  DeleteOutlined as DeleteIcon,
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
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "./../../../common/modal-window";

const { Panel } = Collapse;
const { Text } = Typography;

const schema = {
  DetailsText: Joi.string()
    .max(1024)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .required()
    .label(Words.report_text),
};

const initRecord = {
  DetailsText: "",
};

const formRef = React.createRef();

const UserMyMissionsReportModal = ({
  isOpen,
  mission,
  onOk,
  onDelete,
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
      record.MissionID = mission.MissionID;
      await onOk(record);

      clearRecord();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const handleDelete = async (record) => {
    setProgress(true);

    try {
      record.MissionID = mission.MissionID;
      await onDelete(record);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const disabled = validateForm({ record, schema }) && true;

  const getFooterButtons = () => {
    let footerButtons = [
      <>
        {mission.CanRegReport && (
          <Popconfirm
            title={Words.questions.sure_to_submit_report}
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
          </Popconfirm>
        )}
      </>,

      <>
        {mission.CanRegReport && (
          <Button key="clear-button" onClick={clearRecord}>
            {Words.clear}
          </Button>
        )}
      </>,

      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  const genExtra = (report) => (
    <>
      {report.ManagerMemberID === 0 && (
        <Popconfirm
          title={Words.questions.sure_to_delete_report}
          onConfirm={async () => await handleDelete(report)}
          okText={Words.yes}
          cancelText={Words.no}
          icon={<QuestionIcon style={{ color: "red" }} />}
          key="submit-confirm"
        >
          <DeleteIcon style={{ color: Colors.red[6] }} />
        </Popconfirm>
      )}
    </>
  );

  const getStatusTag = (report) => {
    let result = <></>;

    switch (report.StatusID) {
      case 1:
        result = (
          <Tag icon={<WaitingIcon />} color="warning">
            {Words.in_progress}
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

  return (
    <ModalWindow
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.mission_report}
      footer={getFooterButtons()}
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
                      extra={genExtra(report)}
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
                        {report.ManagerMemberID > 0 && (
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

          {mission.CanRegReport && (
            <Col xs={24}>
              <InputItem
                horizontal
                autoFocus
                title={Words.report_text}
                fieldName="DetailsText"
                formConfig={formConfig}
                multiline
                rows={10}
                maxLength={1024}
                showCount
              />
            </Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMyMissionsReportModal;
