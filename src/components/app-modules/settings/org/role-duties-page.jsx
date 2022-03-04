import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/org/role-duties-service";
import { BsFillCircleFill as FillCircleIcon } from "react-icons/bs";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import RoleDutyModal from "./role-duty-modal";
import RoleDutyDetailsModal from "./role-duty-details-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "RoleDuties",
    data: records,
    columns: [
      { label: Words.id, value: "RoleDutyID" },
      { label: Words.role, value: "RoleTitle" },
      { label: Words.duty_level, value: "LevelTitle" },
      { label: Words.title, value: "Title" },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "RoleDutyID",
    sorter: getSorter("RoleDutyID"),
    render: (RoleDutyID) => <Text>{utils.farsiNum(`${RoleDutyID}`)}</Text>,
  },
  {
    title: Words.role,
    width: 200,
    align: "center",
    ellipsis: true,
    // dataIndex: "First",
    sorter: getSorter("RoleTitle"),
    render: (record) => (
      <Text style={{ color: Colors.blue[6] }}>{record.RoleTitle}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.orange[6] }}>{Title}</Text>,
  },
  {
    title: Words.duty_level,
    width: 100,
    align: "center",
    render: (record) => (
      <Space>
        <FillCircleIcon size={15} style={{ color: record.LevelColor }} />

        <Text>{record.LevelTitle}</Text>
      </Space>
    ),
  },
];

const recordID = "RoleDutyID";

const RoleDutiesPage = ({ pageName }) => {
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
            title={Words.role_duties}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="RoleDuties"
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
        <RoleDutyModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <RoleDutyDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          duty={selectedObject}
        />
      )}
    </>
  );
};

export default RoleDutiesPage;
