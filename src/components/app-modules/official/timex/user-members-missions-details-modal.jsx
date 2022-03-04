import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Steps,
  Descriptions,
} from "antd";
import {
  SnippetsOutlined as ReportIcon,
  ContainerOutlined as NoteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";
import ReportModal from "./user-members-missions-report-modal";
import NoteModal from "./user-members-missions-notes-modal";
import ModalWindow from "../../../common/modal-window";

const { Text } = Typography;
const { Step } = Steps;

const UserMembersMissionsDetailsModal = ({
  mission,
  isOpen,
  onOk,
  onSaveNote,
  onDeleteNote,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    // MissionID,
    // MemberID,
    FirstName,
    LastName,
    PicFileName,
    RegDate,
    RegTime,
    Subject,
    // TargetID,
    TargetTitle,
    InProvince,
    DetailsText,
    // MissionTypeID,
    MissionTypeTitle,
    FormatID,
    NeedVehicle,
    NeedHoteling,
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
    OfficialIsVehicleApproved,
    OfficialIsHotelingApproved,
    // -----------------------
    VehicleInfo,
    // ReportInfo,
    // Notes,
    // -----------------------
    // FinalStatusID,
  } = mission;

  const getRequirementsTitle = () => {
    let result = "-";

    if (NeedVehicle || NeedHoteling) {
      let requirements = [];

      if (NeedVehicle) requirements = [...requirements, Words.vehicle];
      if (NeedHoteling) requirements = [...requirements, Words.hoteling];

      result = requirements.join(" - ");
    }

    return result;
  };

  let steps = [
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
          <Descriptions.Item label={Words.reg_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${utils.weekDayNameFromText(RegDate)} ${utils.slashDate(
                  RegDate
                )}`
              )}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_time}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${utils.colonTime(RegTime)}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.swap_member}>
            <Text
              style={{ color: Colors.red[7] }}
            >{`${SwapMemberFirstName} ${SwapMemberLastName}`}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_type}>
            <Text style={{ color: Colors.green[6] }}>{MissionTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_subject} span={2}>
            <Text style={{ color: Colors.orange[6] }}>{Subject}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_target}>
            <Text style={{ color: Colors.cyan[6] }}>{TargetTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_target_type}>
            <Text style={{ color: Colors.purple[6] }}>
              {InProvince ? Words.inside_province : Words.outside_province}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.requirements} span={2}>
            <Text style={{ color: Colors.grey[6] }}>
              {getRequirementsTitle()}
            </Text>
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
              <Descriptions.Item label={Words.vehicle}>
                {NeedVehicle ? (
                  <Text
                    style={{
                      color: OfficialIsVehicleApproved
                        ? Colors.green[6]
                        : Colors.red[6],
                    }}
                  >
                    {OfficialIsVehicleApproved
                      ? Words.accept_request
                      : Words.reject_request}
                  </Text>
                ) : (
                  <Text style={{ color: valueColor }}>{"-"}</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={Words.hoteling}>
                {NeedHoteling ? (
                  <Text
                    style={{
                      color: OfficialIsHotelingApproved
                        ? Colors.green[6]
                        : Colors.red[6],
                    }}
                  >
                    {OfficialIsHotelingApproved
                      ? Words.accept_request
                      : Words.reject_request}
                  </Text>
                ) : (
                  <Text style={{ color: valueColor }}>{"-"}</Text>
                )}
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

  if (NeedVehicle && OfficialIsVehicleApproved) {
    steps = [
      ...steps,
      {
        stepID: 4,
        title: Words.transmission,
        status: VehicleInfo.TransferTypeID > 0 ? "finish" : "wait",
        content: (
          <>
            {VehicleInfo.TransferTypeID === 0 ? (
              <Alert
                message={Words.messages.transmission_response_not_submitted}
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
                <Descriptions.Item label={Words.transfer_type} span={2}>
                  <Text style={{ color: Colors.cyan[6] }}>
                    {VehicleInfo.TransferTypeID === 1
                      ? utils.farsiNum(
                          `${VehicleInfo.VehicleTypeTitle} ${VehicleInfo.BrandTitle} ${VehicleInfo.ModelTitle} - ${VehicleInfo.Pelak}`
                        )
                      : VehicleInfo.TransferTypeTitle}
                  </Text>
                </Descriptions.Item>

                {DetailsText.length > 0 && (
                  <Descriptions.Item label={Words.descriptions} span={2}>
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(VehicleInfo.DetailsText)}
                    </Text>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label={Words.transmission_manager}>
                  <Text style={{ color: valueColor }}>
                    {`${VehicleInfo.RegFirstName} ${VehicleInfo.RegLastName}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        VehicleInfo.RegDate
                      )} - ${utils.colonTime(VehicleInfo.RegTime)}`
                    )}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        ),
      },
    ];
  }

  const getFooterButtons = () => {
    let footerButtons = [
      <Button
        key="note-button"
        type="primary"
        icon={<NoteIcon />}
        onClick={() => setShowNoteModal(true)}
      >
        {Words.notes}
      </Button>,
      <Button
        key="report-button"
        type="primary"
        icon={<ReportIcon />}
        danger
        onClick={() => setShowReportModal(true)}
      >
        {Words.mission_report}
      </Button>,
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  return (
    <>
      <ModalWindow
        visible={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={getFooterButtons()}
        onCancel={onOk}
        width={750}
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
      </ModalWindow>

      {showNoteModal && (
        <NoteModal
          onCancel={() => setShowNoteModal(false)}
          isOpen={showNoteModal}
          mission={mission}
          onSaveNote={onSaveNote}
          onDeleteNote={onDeleteNote}
        />
      )}

      {showReportModal && (
        <ReportModal
          onCancel={() => setShowReportModal(false)}
          isOpen={showReportModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default UserMembersMissionsDetailsModal;
