import React from "react";
import { Button, Modal, Row, Col, Typography, Alert, Descriptions } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const CompanyDetailsModal = ({ company, isOpen, onOk }) => {
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
              <Alert message={company.CompanyTitle} type="info" showIcon />
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
                <Descriptions.Item label={Words.national_id}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.NationalID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.financial_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.FinancialCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_no}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.RegNo}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.postal_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.PostalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.province}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.ProvinceTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.city}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.CityTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.address} span={2}>
                  <Text style={{ color: valueColor, whiteSpace: "pre" }}>
                    {utils.farsiNum(`${company.Address}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.office_tel}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.OfficeTel}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.fax}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${company.Fax}`)}
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

export default CompanyDetailsModal;
