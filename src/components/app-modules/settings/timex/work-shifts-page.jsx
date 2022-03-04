import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/work-shifts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import WorkShiftModal from "./work-shift-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "WorkShifts",
    data: records,
    columns: [
      { label: Words.id, value: "ShiftID" },
      { label: Words.shift_code, value: "ShiftCode" },
      {
        label: Words.start_time,
        value: (record) => utils.farsiNum(utils.colonTime(record.StartTime)),
      },
      {
        label: Words.finish_time,
        value: (record) => utils.farsiNum(utils.colonTime(record.FinishTime)),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "ShiftID",
    sorter: getSorter("ShiftID"),
    render: (ShiftID) => <Text>{utils.farsiNum(`${ShiftID}`)}</Text>,
  },
  {
    title: Words.shift_code,
    width: 150,
    align: "center",
    ellipsis: true,
    dataIndex: "ShiftCode",
    sorter: getSorter("ShiftCode"),
    render: (ShiftCode) => (
      <Text style={{ color: Colors.blue[7] }}>{ShiftCode}</Text>
    ),
  },
  {
    title: Words.start_time,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "StartTime",
    sorter: getSorter("StartTime"),
    render: (StartTime) => (
      <Text style={{ color: Colors.green[7] }}>
        {utils.farsiNum(utils.colonTime(StartTime))}
      </Text>
    ),
  },
  {
    title: Words.finish_time,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "FinishTime",
    sorter: getSorter("FinishTime"),
    render: (FinishTime) => (
      <Text style={{ color: Colors.green[7] }}>
        {utils.farsiNum(utils.colonTime(FinishTime))}
      </Text>
    ),
  },
];

const recordID = "ShiftID";

const WorkShiftsPage = ({ pageName }) => {
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
            title={Words.work_shifts}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="WorkShifts"
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
        <WorkShiftModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default WorkShiftsPage;
