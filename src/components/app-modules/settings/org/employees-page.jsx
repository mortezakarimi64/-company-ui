import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/org/employees-service";
import { AiOutlineCheck as CheckIcon } from "react-icons/ai";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import EmployeeModal from "./employee-modal";
import EmployeeDetailsModal from "./employee-details-modal";
import MemberProfileImage from "../../../common/member-profile-image";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Employees",
    data: records,
    columns: [
      { label: Words.id, value: "EmployeeID" },
      { label: Words.member_id, value: "MemberID" },
      { label: Words.card_no, value: "CardNo" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.national_code, value: "NationalCode" },
      { label: Words.mobile, value: "Mobile" },
      { label: Words.department, value: "DepartmentTitle" },
      { label: Words.role, value: "RoleTitle" },
      {
        label: Words.department_manager,
        value: (record) => (record.IsDepartmentManger ? Words.yes : Words.no),
      },
      {
        label: Words.department_supervisor,
        value: (record) =>
          record.IsDepartmentSupervisor ? Words.yes : Words.no,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "EmployeeID",
    sorter: getSorter("EmployeeID"),
    render: (EmployeeID) => <Text>{utils.farsiNum(`${EmployeeID}`)}</Text>,
  },
  {
    title: "",
    width: 75,
    align: "center",
    dataIndex: "PicFileName",
    render: (PicFileName) => <MemberProfileImage fileName={PicFileName} />,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    ellipsis: true,
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
  {
    title: Words.card_no,
    width: 100,
    align: "center",
    dataIndex: "CardNo",
    sorter: getSorter("CardNo"),
    render: (CardNo) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(`${CardNo}`)}
      </Text>
    ),
  },
  {
    title: Words.department,
    width: 150,
    align: "center",
    ellipsis: true,
    dataIndex: "DepartmentTitle",
    sorter: getSorter("DepartmentTitle"),
    render: (DepartmentTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{DepartmentTitle}</Text>
    ),
  },
  {
    title: Words.role,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "RoleTitle",
    sorter: getSorter("RoleTitle"),
    render: (RoleTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>{RoleTitle}</Text>
    ),
  },
  {
    title: Words.department_manager,
    width: 130,
    align: "center",
    sorter: getSorter("IsDepartmentManager"),
    render: (record) =>
      record.IsDepartmentManager && (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ),
  },
  {
    title: Words.department_supervisor,
    width: 130,
    align: "center",
    sorter: getSorter("IsDepartmentSupervisor"),
    render: (record) =>
      record.IsDepartmentSupervisor && (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ),
  },
];

const recordID = "EmployeeID";

const EmployeesPage = ({ pageName }) => {
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
            title={Words.employees}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Employees"
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
        <EmployeeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <EmployeeDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          employee={selectedObject}
        />
      )}
    </>
  );
};

export default EmployeesPage;
