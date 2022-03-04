import React, { useState } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Divider,
  Descriptions,
} from "antd";
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";
import ResponseModal from "./user-transmission-requests-response-modal";

const { Text } = Typography;

const UserTransmissionRequestsDetailsModal = ({
  request,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showModal, setShowModal] = useState(false);

  const valueColor = Colors.blue[7];

  const {
    //RowID,
    //MissionID,
    //MemberID,
    FirstName,
    LastName,
    //Mobile,
    PicFileName,
    //TargetID,
    TargetTitle,
    InProvince,
    StartDate,
    FinishDate,
    StartTime,
    FinishTime,
    //MissionTypeID,
    MissionTypeTitle,
    FormatID,
    //OfficialMemberID,
    OfficialFirstName,
    OfficialLastName,
    RequestDate,
    RequestTime,
    TransferTypeID,
    TransferTypeTitle,
    DetailsText,
    //VehicleID,
    Pelak,
    //ProductYear,
    //VehicleTypeID,
    VehicleTypeTitle,
    //ModelID,
    ModelTitle,
    //BrandID,
    BrandTitle,
    //RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
  } = request;

  const getFooterButtons = () => {
    let footerButtons = [
      <Button key="close-button" type="primary" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (TransferTypeID === 0) {
      footerButtons = [
        <Button
          key="submit-button"
          type="primary"
          icon={<PlusIcon />}
          danger
          onClick={() => setShowModal(true)}
        >
          {Words.submit_response}
        </Button>,
        ...footerButtons,
      ];
    }

    return footerButtons;
  };

  return (
    <>
      <Modal
        visible={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={getFooterButtons()}
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
                  <Descriptions.Item label={Words.mission_target}>
                    <Space direction="vertical">
                      <Text style={{ color: Colors.purple[6] }}>
                        {TargetTitle}
                      </Text>
                      <Text style={{ color: Colors.grey[6], fontSize: 12 }}>
                        {InProvince ? Words.InProvince : ""}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.request_type}>
                    <Text style={{ color: Colors.green[6] }}>
                      {MissionTypeTitle}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.from_date}>
                    <Text style={{ color: valueColor }}>
                      {`${utils.weekDayNameFromText(
                        StartDate
                      )} ${utils.farsiNum(utils.slashDate(StartDate))}`}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.to_date}>
                    <Text style={{ color: valueColor }}>
                      {`${utils.weekDayNameFromText(
                        FinishDate
                      )} ${utils.farsiNum(utils.slashDate(FinishDate))}`}
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
                  <Descriptions.Item label={Words.official_manager}>
                    <Text style={{ color: valueColor }}>
                      {`${OfficialFirstName} ${OfficialLastName}`}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.reg_date_time}>
                    <Text style={{ color: valueColor }}>
                      {utils.farsiNum(
                        `${utils.slashDate(RequestDate)} - ${utils.colonTime(
                          RequestTime
                        )}`
                      )}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
                {TransferTypeID > 0 && (
                  <>
                    <Divider orientation="right" plain>
                      {Words.transmission_info}
                    </Divider>
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
                          {TransferTypeID === 1
                            ? utils.farsiNum(
                                `${VehicleTypeTitle} ${BrandTitle} ${ModelTitle} - ${Pelak}`
                              )
                            : TransferTypeTitle}
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
                            {utils.farsiNum(DetailsText)}
                          </Text>
                        </Descriptions.Item>
                      )}

                      <Descriptions.Item label={Words.transmission_manager}>
                        <Text style={{ color: valueColor }}>
                          {`${RegFirstName} ${RegLastName}`}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={Words.reg_date_time}>
                        <Text style={{ color: valueColor }}>
                          {utils.farsiNum(
                            `${utils.slashDate(RegDate)} - ${utils.colonTime(
                              RegTime
                            )}`
                          )}
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                )}
              </Col>
            </Row>
          </article>
        </section>
      </Modal>

      {showModal && (
        <ResponseModal
          onOk={onResponse}
          onCancel={() => setShowModal(false)}
          isOpen={showModal}
          request={request}
        />
      )}
    </>
  );
};

export default UserTransmissionRequestsDetailsModal;
