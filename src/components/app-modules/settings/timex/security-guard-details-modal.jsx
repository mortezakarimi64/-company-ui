import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Space,
} from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const SecurityGuardDetailsModal = ({ securityGuard, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

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
      width={650}
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
                    <MemberProfileImage fileName={securityGuard.PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${securityGuard.MemberID} - ${securityGuard.FirstName} ${securityGuard.LastName}`
                      )}
                    </Text>
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
                <Descriptions.Item label={Words.national_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${securityGuard.NationalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.mobile}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${securityGuard.Mobile}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Space>
                    {securityGuard.IsActive ? (
                      <CheckIcon style={{ color: Colors.green[6] }} />
                    ) : (
                      <LockIcon style={{ color: Colors.red[6] }} />
                    )}

                    <Text style={{ color: valueColor }}>
                      {`${
                        securityGuard.IsActive ? Words.active : Words.inactive
                      } `}
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_member}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      `${securityGuard.RegFirstName} ${securityGuard.RegLastName} `
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      utils.slashDate(`${securityGuard.RegDate}`)
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      utils.colonTime(`${securityGuard.RegTime}`)
                    )}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default SecurityGuardDetailsModal;
