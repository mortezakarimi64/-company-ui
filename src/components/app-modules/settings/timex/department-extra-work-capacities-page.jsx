import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/timex/department-extra-work-capacities-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import DepartmentExtraWorkCapacityModal from "./department-extra-work-capacity-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "DepartmentExtraWorkCapaticies",
    data: records,
    columns: [
      { label: Words.id, value: "CapacityID" },
      { label: Words.title, value: "DepartmentTitle" },
      {
        label: Words.capacity_in_hours,
        value: (record) => utils.fileName(record.CapacityInHours),
      },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      {
        label: Words.reg_date,
        value: (record) => `${utils.slashDate(record.RegDate)}`,
      },
      {
        label: Words.reg_time,
        value: (record) => `${utils.colonTime(record.RegTime)}`,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "CapacityID",
    sorter: getSorter("CapacityID"),
    render: (CapacityID) => <Text>{utils.farsiNum(`${CapacityID}`)}</Text>,
  },
  {
    title: Words.department,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "DepartmentTitle",
    sorter: getSorter("DepartmentTitle"),
    render: (DepartmentTitle) => (
      <Text style={{ color: Colors.blue[7] }}>{DepartmentTitle}</Text>
    ),
  },
  {
    title: Words.capacity_in_hours,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "CapacityInHours",
    sorter: getSorter("CapacityInHours"),
    render: (CapacityInHours) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(`${CapacityInHours}`)}
      </Text>
    ),
  },
];

const recordID = "CapacityID";

const DepartmentExtraWorkCapacitiesPage = ({ pageName }) => {
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
    showModal,
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

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.department_extra_work_capacities}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="DepartmentExtraWorkCapacities"
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
        <DepartmentExtraWorkCapacityModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default DepartmentExtraWorkCapacitiesPage;
