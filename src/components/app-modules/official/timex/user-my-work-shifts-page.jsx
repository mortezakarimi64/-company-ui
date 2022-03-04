import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/timex/user-my-work-shifts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import WorkShiftSearchModal from "./user-my-work-shift-search-modal";
import DetailsTable from "./../../../common/details-table";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MyWorkShifts",
    data: records,
    columns: [
      { label: Words.id, value: "RowID" },
      {
        label: Words.week_day,
        value: (record) => utils.weekDayNameFromText(record.ShiftDate),
      },
      {
        label: Words.shift_date,
        value: (record) => utils.farsiNum(utils.slashDate(record.ShiftDate)),
      },
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
    dataIndex: "RowID",
    sorter: getSorter("RowID"),
    render: (RowID) => <Text>{utils.farsiNum(`${RowID}`)}</Text>,
  },
  {
    title: Words.shift_code,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "ShiftCode",
    sorter: getSorter("ShiftCode"),
    render: (ShiftCode) => (
      <Text style={{ color: Colors.orange[7] }}>{ShiftCode}</Text>
    ),
  },
  {
    title: Words.shift_date,
    width: 150,
    align: "center",
    // dataIndex: "ShiftDate",
    sorter: getSorter("ShiftDate"),
    render: (record) => (
      <Text
        style={{ color: record.IsHoliday ? Colors.red[6] : Colors.green[6] }}
      >
        {utils.farsiNum(
          `${utils.weekDayNameFromText(record.ShiftDate)} - ${utils.slashDate(
            record.ShiftDate
          )}`
        )}
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
      <Text style={{ color: Colors.blue[7] }}>
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
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(utils.colonTime(FinishTime))}
      </Text>
    ),
  },
];

const recordID = "RowID";

const UserMyWorkShiftsPage = ({ pageName }) => {
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleResetContext, handleAdvancedSearch } = GetSimplaDataPageMethods(
    {
      service,
      recordID,
    }
  );

  const columns = access
    ? getColumns(baseColumns, null, access, null, null)
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
            title={Words.my_work_shifts}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="MyWorkShifts"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && <DetailsTable records={records} columns={columns} />}
          </Col>
        </Row>
      </Spin>

      {showSearchModal && (
        <WorkShiftSearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default UserMyWorkShiftsPage;
