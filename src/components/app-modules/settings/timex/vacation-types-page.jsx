import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/vacation-types-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import VacationTypeModal from "./vacation-type-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "VacationTypes",
    data: records,
    columns: [
      { label: Words.id, value: "VacationTypeID" },
      { label: Words.title, value: "Title" },
      {
        label: Words.vacation_format,
        value: (record) =>
          record.FormatID === 1 ? Words.by_hour : Words.by_day,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "VacationTypeID",
    sorter: getSorter("VacationTypeID"),
    render: (VacationTypeID) => (
      <Text>{utils.farsiNum(`${VacationTypeID}`)}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => (
      <Text style={{ color: Colors.blue[7] }}>{utils.farsiNum(Title)}</Text>
    ),
  },
  {
    title: Words.vacation_format,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "FormatID",
    sorter: getSorter("FormatID"),
    render: (FormatID) => (
      <Text style={{ color: Colors.green[6] }}>
        {FormatID === 1 ? Words.by_hour : Words.by_day}
      </Text>
    ),
  },
];

const recordID = "VacationTypeID";

const VacationTypesPage = ({ pageName }) => {
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
            title={Words.vacation_types}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="VacationTypes"
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
        <VacationTypeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default VacationTypesPage;
