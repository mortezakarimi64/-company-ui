import React from "react";
import {
  Row,
  Col,
  Button,
  Collapse,
  Alert,
  Tag,
  Typography,
  Divider,
} from "antd";
import {
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as ApprovedIcon,
  CloseCircleOutlined as CloseIcon,
  FieldTimeOutlined as WaitingIcon,
  ThunderboltOutlined as CorrectionIcon,
  UserOutlined as PersonIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "./../../../common/modal-window";

const { Panel } = Collapse;
const { Text } = Typography;

const UserMembersMissionsReportModal = ({ isOpen, mission, onCancel }) => {
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
      footer={[
        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onCancel}
      width={750}
    >
      <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
        <Col xs={24}>
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
                                  utils.colonTime(report.ManagerResponseTime)
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
        </Col>
      </Row>
    </ModalWindow>
  );
};

export default UserMembersMissionsReportModal;
