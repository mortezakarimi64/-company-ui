import React, { useState } from "react";
import { useMount } from "react-use";
import { Button, Modal, Row, Col, Typography, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import companiesService from "../../../../services/settings/org/companies-service";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "AgentID",
    render: (AgentID) => <Text>{utils.farsiNum(`${AgentID}`)}</Text>,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    ellipsis: true,
    render: (record) => (
      <Text style={{ color: Colors.green[7] }}>
        {`${record.FirstName} ${record.LastName}`}
      </Text>
    ),
  },
  {
    title: Words.role,
    width: 120,
    align: "center",
    dataIndex: "RoleTitle",
    render: (RoleTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>{RoleTitle}</Text>
    ),
  },
  {
    title: Words.mobile,
    width: 100,
    align: "center",
    ellipsis: true,
    render: (record) => (
      <Text style={{ color: Colors.red[6] }}>
        {utils.farsiNum(`${record.Mobile}`)}
      </Text>
    ),
  },
];

const CompanyAgentsModal = ({ company, isOpen, onOk }) => {
  const [agents, setAgents] = useState([]);

  useMount(async () => {
    const data = await companiesService.getAgentsByCompanyID(company.CompanyID);

    setAgents(data);
  });

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.company_agents}
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
              <DetailsTable records={agents} columns={columns} />
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default CompanyAgentsModal;
