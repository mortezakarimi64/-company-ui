import React from "react";
import { Button, Modal, Row, Col, Typography, Alert, Descriptions } from "antd";
import { AiFillStar as StarIcon } from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const PersonalDutyDetailsModal = ({ duty, isOpen, onOk }) => {
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
                message={utils.farsiNum(
                  `#${duty.EmployeeID} - ${duty.FirstName} ${duty.LastName}`
                )}
                type="info"
                showIcon
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
                {duty.IsDepartmentManager && (
                  <Descriptions.Item label={Words.department_manager} span={2}>
                    {/* <Text style={{ color: valueColor }}>
                      {Words.department_manager}
                    </Text> */}
                    <StarIcon style={{ color: Colors.yellow[6] }} />
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={Words.national_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${duty.NationalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.mobile}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${duty.Mobile}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.department}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${duty.DepartmentTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.role}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${duty.RoleTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.duty_title} span={2}>
                  <Text style={{ color: Colors.green[6] }}>{duty.Title}</Text>
                </Descriptions.Item>
                {duty.DetailsText.length > 0 && (
                  <Descriptions.Item label={Words.descriptions} span={2}>
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(duty.DetailsText)}
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

export default PersonalDutyDetailsModal;
