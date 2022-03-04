import React from "react";
import { Button, Modal, Row, Col, Typography, Alert, Descriptions } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const CompanyAgentDetailsModal = ({ agent, isOpen, onOk }) => {
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
                  `#${agent.AgentID} - ${agent.FirstName} ${agent.LastName}`
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
                <Descriptions.Item label={Words.fix_tel}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.FixTel}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.mobile}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.Mobile}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.company}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.CompanyTitle} (${agent.RegNo})`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.national_id}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.NationalID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.financial_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.FinancialCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.role}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${agent.RoleTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text style={{ color: valueColor, whiteSpace: "pre-line" }}>
                    {utils.farsiNum(`${agent.DetailsText}`)}
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

export default CompanyAgentDetailsModal;
