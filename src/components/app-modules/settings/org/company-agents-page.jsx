import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/org/company-agents-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import CompanyAgentModal from "./company-agent-modal";
import CompanyAgentDetailsModal from "./company-agent-details-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CompanyAgents",
    data: records,
    columns: [
      { label: Words.id, value: "AgentID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.role, value: "RoleTitle" },
      { label: Words.fix_tel, value: "FixTel" },
      { label: Words.mobile, value: "Mobile" },
      { label: Words.company, value: "CompanyTitle" },
      { label: Words.reg_no, value: "RegNo" },
      { label: Words.national_id, value: "NationalID" },
      { label: Words.financial_code, value: "FinancialCode" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "AgentID",
    sorter: getSorter("AgentID"),
    render: (AgentID) => <Text>{utils.farsiNum(`${AgentID}`)}</Text>,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    ellipsis: true,
    // dataIndex: "First",
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
  {
    title: Words.company,
    width: 250,
    align: "center",
    ellipsis: true,
    dataIndex: "CompanyTitle",
    sorter: getSorter("CompanyTitle"),
    render: (CompanyTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{CompanyTitle}</Text>
    ),
  },
  {
    title: Words.role,
    width: 150,
    align: "center",
    ellipsis: true,
    dataIndex: "RoleTitle",
    sorter: getSorter("RoleTitle"),
    render: (RoleTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>{RoleTitle}</Text>
    ),
  },
];

const recordID = "AgentID";

const CompanyAgentsPage = ({ pageName }) => {
  const {
    progress,
    searched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleGetAll,
    handleSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <Button
        type="link"
        icon={<InfoIcon style={{ color: Colors.green[6] }} />}
        onClick={() => {
          setSelectedObject(record);
          setShowDetails(true);
        }}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.company_agents}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="CompanyAgents"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <CompanyAgentModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <CompanyAgentDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          agent={selectedObject}
        />
      )}
    </>
  );
};

export default CompanyAgentsPage;
