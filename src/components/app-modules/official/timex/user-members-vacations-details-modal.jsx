import React, { useState } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Steps,
  Descriptions,
} from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;
const { Step } = Steps;

const UserMembersVacationsDetailsModal = ({ vacation, isOpen, onOk }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    // VacationID,
    // MemberID,
    FirstName,
    LastName,
    PicFileName,
    RegDate,
    RegTime,
    DetailsText,
    // VacationTypeID,
    VacationTypeTitle,
    FormatID,
    StartDate,
    FinishDate,
    StartTime,
    FinishTime,
    // -----------------------
    // SwapMemberID,
    SwapMemberFirstName,
    SwapMemberLastName,
    SwapIsAccepted,
    SwapResponseDate,
    SwapResponseTime,
    SwapDetailsText,
    // -----------------------
    // ManagerMemberID,
    // ManagerMemberFirstName,
    // ManagerMemberLastName,
    ManagerSelectedSwapMemberID,
    ManagerSelectedSwapMemberFirstName,
    ManagerSelectedSwapMemberLastName,
    // ManagerSelectedSwapMemberSeenDate,
    // ManagerSelectedSwapMemberSeenTime,
    ManagerIsAccepted,
    ManagerResponseDate,
    ManagerResponseTime,
    ManagerDetailsText,
    // -----------------------
    // OfficialMemberID,
    OfficialMemberFirstName,
    OfficialMemberLastName,
    OfficialIsAccepted,
    OfficialResponseDate,
    OfficialResponseTime,
    OfficialDetailsText,
    // -----------------------
    // FinalStatusID,
  } = vacation;

  const steps = [
    {
      stepID: 0,
      title: Words.request_info,
      status: "finish",
      content: (
        <Descriptions
          bordered
          column={{
            //   md: 2, sm: 2,
            lg: 2,
            md: 2,
            xs: 1,
          }}
          size="middle"
        >
          <Descriptions.Item label={Words.reg_date_time}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
              )}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.vacation_type}>
            <Text style={{ color: Colors.green[6] }}>{VacationTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.from_date}>
            <Text style={{ color: valueColor }}>
              {`${utils.weekDayNameFromText(StartDate)} ${utils.farsiNum(
                utils.slashDate(StartDate)
              )}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.to_date}>
            <Text style={{ color: valueColor }}>
              {`${utils.weekDayNameFromText(FinishDate)} ${utils.farsiNum(
                utils.slashDate(FinishDate)
              )}`}
            </Text>
          </Descriptions.Item>
          {FormatID === 1 && (
            <>
              <Descriptions.Item label={Words.start_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(StartTime))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.finish_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(FinishTime))}
                </Text>
              </Descriptions.Item>
            </>
          )}
          {DetailsText.length > 0 && (
            <Descriptions.Item label={Words.descriptions} span={2}>
              <Text
                style={{
                  color: Colors.purple[7],
                  whiteSpace: "pre-line",
                }}
              >
                {utils.farsiNum(DetailsText)}
              </Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    },
    {
      stepID: 1,
      title: Words.swap_member_response,
      status: SwapResponseDate.length > 0 ? "finish" : "wait",
      content: (
        <>
          {ManagerSelectedSwapMemberID === 0 &&
          ManagerResponseDate.length === 0 &&
          SwapResponseDate.length === 0 ? (
            <Alert
              message={Words.messages.swap_member_response_not_submitted}
              type="warning"
              showIcon
            />
          ) : (
            <Descriptions
              bordered
              column={{
                //   md: 2, sm: 2,
                lg: 2,
                md: 2,
                xs: 1,
              }}
              size="middle"
            >
              <Descriptions.Item label={Words.swap_member}>
                <Text style={{ color: Colors.red[7] }}>
                  {`${SwapMemberFirstName} ${SwapMemberLastName}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{
                    color: SwapIsAccepted ? Colors.green[6] : Colors.red[6],
                  }}
                >
                  {SwapIsAccepted ? Words.accepted : Words.rejected}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {`${utils.weekDayNameFromText(
                    SwapResponseDate
                  )} ${utils.farsiNum(`${utils.slashDate(SwapResponseDate)}`)}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${utils.colonTime(SwapResponseTime)}`)}
                </Text>
              </Descriptions.Item>

              {SwapDetailsText.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(SwapDetailsText)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </>
      ),
    },
    {
      stepID: 2,
      title: Words.manager_response,
      status: ManagerResponseDate.length > 0 ? "finish" : "wait",
      content: (
        <>
          {ManagerResponseDate.length === 0 ? (
            <Alert
              message={Words.messages.manager_response_not_submitted}
              type="warning"
              showIcon
            />
          ) : (
            <Descriptions
              bordered
              column={{
                //   md: 2, sm: 2,
                lg: 2,
                md: 2,
                xs: 1,
              }}
              size="middle"
            >
              <Descriptions.Item label={Words.new_swap_member}>
                <Text style={{ color: Colors.red[7] }}>
                  {ManagerSelectedSwapMemberID > 0
                    ? `${ManagerSelectedSwapMemberFirstName} ${ManagerSelectedSwapMemberLastName}`
                    : "-"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{
                    color: ManagerIsAccepted ? Colors.green[6] : Colors.red[6],
                  }}
                >
                  {ManagerIsAccepted ? Words.accepted : Words.rejected}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {`${utils.weekDayNameFromText(
                    ManagerResponseDate
                  )} ${utils.farsiNum(
                    `${utils.slashDate(ManagerResponseDate)}`
                  )}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${utils.colonTime(ManagerResponseTime)}`)}
                </Text>
              </Descriptions.Item>
              {ManagerDetailsText.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(ManagerDetailsText)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </>
      ),
    },
    {
      stepID: 3,
      title: Words.official_response,
      status: OfficialResponseDate.length > 0 ? "finish" : "wait",
      content: (
        <>
          {OfficialResponseDate.length === 0 ? (
            <Alert
              message={Words.messages.official_response_not_submitted}
              type="warning"
              showIcon
            />
          ) : (
            <Descriptions
              bordered
              column={{
                //   md: 2, sm: 2,
                lg: 2,
                md: 2,
                xs: 1,
              }}
              size="middle"
            >
              <Descriptions.Item label={Words.official_manager}>
                <Text
                  style={{
                    color: Colors.cyan[7],
                  }}
                >
                  {`${OfficialMemberFirstName} ${OfficialMemberLastName}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{
                    color: OfficialIsAccepted ? Colors.green[6] : Colors.red[6],
                  }}
                >
                  {OfficialIsAccepted ? Words.accepted : Words.rejected}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {`${utils.weekDayNameFromText(
                    OfficialResponseDate
                  )} - ${utils.farsiNum(
                    `${utils.slashDate(OfficialResponseDate)}`
                  )}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${utils.colonTime(OfficialResponseTime)}`)}
                </Text>
              </Descriptions.Item>
              {OfficialDetailsText.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(OfficialDetailsText)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </>
      ),
    },
  ];

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="close-button" type="primary" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onOk}
      width={750}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Alert
                message={
                  <Space>
                    <MemberProfileImage fileName={PicFileName} />
                    <Text>{`${FirstName} ${LastName}`}</Text>
                  </Space>
                }
                type="info"
              />
            </Col>
            <Col xs={24}>
              <Steps current={currentStep} onChange={handleStepChange}>
                {steps.map((item) => (
                  <Step
                    key={item.title}
                    title={
                      <Text
                        style={{
                          fontSize: 13,
                          color:
                            item.stepID === currentStep
                              ? Colors.orange[6]
                              : Colors.grey[8],
                        }}
                      >
                        {item.title}
                      </Text>
                    }
                    status={item.status}
                  />
                ))}
              </Steps>
            </Col>
            <Col xs={24}>{steps[currentStep].content}</Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserMembersVacationsDetailsModal;
