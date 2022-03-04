import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/org/personal-duties-service";
import { BsFillCircleFill as FillCircleIcon } from "react-icons/bs";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import PersonalDutyModal from "./personal-duty-modal";
import PersonalDutyDetailsModal from "./personal-duty-details-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PersonalDuties",
    data: records,
    columns: [
      { label: Words.id, value: "PersonalDutyID" },
      { label: Words.member_id, value: "MemberID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.national_code, value: "NationalCode" },
      { label: Words.mobile, value: "Mobile" },
      { label: Words.duty_level, value: "LevelTitle" },
      { label: Words.department, value: "DepartmentTitle" },
      { label: Words.role, value: "RoleTitle" },
      {
        label: Words.department_manager,
        value: (record) => (record.IsDepartmentManger ? Words.yes : Words.no),
      },
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
    dataIndex: "PersonalDutyID",
    sorter: getSorter("PersonalDutyID"),
    render: (PersonalDutyID) => (
      <Text>{utils.farsiNum(`${PersonalDutyID}`)}</Text>
    ),
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

const recordID = "PersonalDutyID";

const PersonalDutiesPage = ({ pageName }) => {
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
            title={Words.personal_duties}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="PersonalDuties"
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
        <PersonalDutyModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <PersonalDutyDetailsModal
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

export default PersonalDutiesPage;
