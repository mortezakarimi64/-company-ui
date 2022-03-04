import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Descriptions,
} from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const UserSecurityGuardRegedCardDetailsModal = ({
  regedCard,
  isOpen,
  onOk,
}) => {
  const valueColor = Colors.blue[7];

  const {
    MemberID,
    FirstName,
    LastName,
    CardNo,
    CardRegDate,
    CardRegTime,
    PicFileName,
    DetailsText,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
  } = regedCard;

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="submit-button" type="primary" onClick={onOk}>
          {Words.confirm}
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
                <Descriptions.Item label={Words.member_id}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${MemberID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.card_no}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${CardNo}`)}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label={Words.reg_date}>
                  <Text style={{ color: valueColor }}>
                    {`${utils.weekDayNameFromText(
                      CardRegDate
                    )} - ${utils.farsiNum(utils.slashDate(CardRegDate))}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.colonTime(CardRegTime))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.registerar}>
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
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserSecurityGuardRegedCardDetailsModal;
