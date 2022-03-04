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

const RegedCardDetailsModal = ({ regedCard, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];
  const securityGuardValueColor = Colors.red[7];

  const {
    FirstName,
    LastName,
    CardNo,
    CardRegDate,
    CardRegTime,
    PicFileName,
    RegTypeID,
    RegTypeTitle,
    RegisterarRegDate,
    RegisterarRegTime,
    RegisterarFirstName,
    RegisterarLastName,
    RegisterarDetailsText,
    SecurityGuardFullName,
    SecurityGuardDetailsText,
    SecurityGuardRegDate,
    SecurityGuardRegTime,
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
                <Descriptions.Item label={Words.card_no}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${CardNo}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_type}>
                  <Text style={{ color: valueColor }}>{RegTypeTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(CardRegDate))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.colonTime(CardRegTime))}
                  </Text>
                </Descriptions.Item>
                {/* 3 : Manual Reg */}
                {RegTypeID === 3 && (
                  <>
                    <Descriptions.Item label={Words.registerar}>
                      <Text style={{ color: valueColor }}>
                        {`${RegisterarFirstName} ${RegisterarLastName}`}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.manual_reg_date_time}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(
                          `${utils.slashDate(
                            RegisterarRegDate
                          )} - ${utils.colonTime(RegisterarRegTime)}`
                        )}
                      </Text>
                    </Descriptions.Item>
                    {RegisterarDetailsText.length > 0 && (
                      <Descriptions.Item label={Words.descriptions} span={2}>
                        <Text
                          style={{
                            color: Colors.purple[7],
                            whiteSpace: "pre-line",
                          }}
                        >
                          {utils.farsiNum(RegisterarDetailsText)}
                        </Text>
                      </Descriptions.Item>
                    )}
                  </>
                )}
                {/* 2 : SecurityGuard Reg */}
                {RegTypeID === 2 && (
                  <>
                    <Descriptions.Item label={Words.security_guard}>
                      <Text style={{ color: securityGuardValueColor }}>
                        {SecurityGuardFullName}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={Words.security_guard_reg_date_time}
                    >
                      <Text style={{ color: securityGuardValueColor }}>
                        {utils.farsiNum(
                          `${utils.slashDate(
                            SecurityGuardRegDate
                          )} - ${utils.colonTime(SecurityGuardRegTime)}`
                        )}
                      </Text>
                    </Descriptions.Item>
                    {SecurityGuardDetailsText.length > 0 && (
                      <Descriptions.Item
                        label={Words.security_guard_descriptions}
                        span={2}
                      >
                        <Text
                          style={{
                            color: Colors.purple[7],
                            whiteSpace: "pre-line",
                          }}
                        >
                          {utils.farsiNum(SecurityGuardDetailsText)}
                        </Text>
                      </Descriptions.Item>
                    )}
                  </>
                )}
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default RegedCardDetailsModal;
