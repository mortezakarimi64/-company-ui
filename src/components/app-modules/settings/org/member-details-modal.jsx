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
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import { getGenderTitle } from "../../../../tools/general";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const MemberDetailsModal = ({ member, isOpen, onOk }) => {
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
                    <MemberProfileImage fileName={member.PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${member.MemberID} - ${member.FirstName} ${member.LastName}`
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
                    {utils.farsiNum(`${member.NationalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.gender}>
                  <Text style={{ color: valueColor }}>
                    {getGenderTitle(member.GenderID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.birth_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(`${member.BirthDate}`))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.mobile}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.Mobile}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.fix_tel}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.FixTel}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.postal_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.PostalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.province}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.ProvinceTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.city}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.CityTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.address} span={2}>
                  <Text style={{ color: valueColor, whiteSpace: "pre" }}>
                    {utils.farsiNum(`${member.Address}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.username}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${member.Username}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(`${member.RegDate}`))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.colonTime(`${member.RegTime}`))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_member}>
                  <Text style={{ color: valueColor }}>
                    {`${member.RegFirstName} ${member.RegLastName}`}
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

export default MemberDetailsModal;
