import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Tooltip } from "antd";
import { BsKeyFill as KeyIcon } from "react-icons/bs";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/org/employees-service";
import { AiOutlineCheck as CheckIcon } from "react-icons/ai";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import PageAccessModal from "./page-access-modal";
import MemberProfileImage from "../../../common/member-profile-image";
import { usePageContext } from "./../../../contexts/page-context";

const { Text } = Typography;

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
    width: 120,
    align: "center",
    ellipsis: true,
    sorter: getSorter("IsDepartmentManager"),
    render: (record) =>
      record.IsDepartmentManager && (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ),
  },
];

const recordID = "EmployeeID";

const PageAccessesPage = ({ pageName }) => {
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
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleGetAll, handleSearch, handleResetContext } =
    GetSimplaDataPageMethods({
      service,
      recordID,
    });

  const getOperationalButtons = (record) => {
    return (
      <Tooltip title={Words.accesses}>
        <Button
          type="link"
          icon={<KeyIcon style={{ color: Colors.red[6], fontSize: 20 }} />}
          onClick={() => {
            setSelectedObject(record);
            setShowDetails(true);
          }}
        />
      </Tooltip>
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        null, //handleEdit,
        null //handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.page_accesses}
            searchText={searchText}
            sheets={null}
            fileName="PageAccesses"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showDetails && (
        <PageAccessModal
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

export default PageAccessesPage;
