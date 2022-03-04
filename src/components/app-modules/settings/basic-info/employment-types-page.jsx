import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/basic-info/employment-types-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import EmploymentTypeModal from "./employment-type-modal";
import { usePageContext } from "./../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "EmploymentTypes",
    data: records,
    columns: [
      { label: Words.id, value: "EmploymentTypeID" },
      { label: Words.title, value: "EmploymentTypeTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "EmploymentTypeID",
    sorter: getSorter("EmploymentTypeID"),
    render: (EmploymentTypeID) => (
      <Text>{utils.farsiNum(`${EmploymentTypeID}`)}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "EmploymentTypeTitle",
    sorter: getSorter("EmploymentTypeTitle"),
    render: (EmploymentTypeTitle) => (
      <Text>{utils.farsiNum(EmploymentTypeTitle)}</Text>
    ),
  },
];

const recordID = "EmploymentTypeID";

const EmploymentTypesPage = ({ pageName }) => {
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
            title={Words.employment_types}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="EmploymentTypes"
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
        <EmploymentTypeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default EmploymentTypesPage;
