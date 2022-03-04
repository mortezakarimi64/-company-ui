import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/group-shifts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import GroupShiftModal from "./group-shift-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import GroupShiftSearchModal from "./group-shift-search-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "GroupShifts",
    data: records,
    columns: [
      { label: Words.id, value: "GSID" },
      { label: Words.department, value: "DepartmentTitle" },
      {
        label: Words.shift_date,
        value: (record) => utils.slashDate(record.ShiftDate),
      },
      { label: Words.shift_code, value: "ShiftCode" },
      {
        label: Words.start_time,
        value: (record) => utils.colonTime(record.StartTime),
      },
      {
        label: Words.finish_time,
        value: (record) => utils.colonTime(record.FinishTime),
      },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "GSID",
    sorter: getSorter("GSID"),
    render: (GSID) => <Text>{utils.farsiNum(`${GSID}`)}</Text>,
  },
  {
    title: Words.shift_code,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "ShiftCode",
    sorter: getSorter("ShiftCode"),
    render: (ShiftCode) => (
      <Text style={{ color: Colors.blue[7] }}>{ShiftCode}</Text>
    ),
  },
  {
    title: Words.shift_date,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "ShiftDate",
    sorter: getSorter("ShiftDate"),
    render: (ShiftDate) => (
      <Text style={{ color: Colors.magenta[7] }}>
        {utils.farsiNum(utils.slashDate(ShiftDate))}
      </Text>
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

const recordID = "GSID";

const GroupShiftsPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    showModal,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
    handleAdvancedSearch,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.group_shifts}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="GroupShifts"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showSearchModal && (
        <GroupShiftSearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <GroupShiftModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default GroupShiftsPage;
