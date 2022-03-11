import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";

import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import Colors from "../../../../resources/colors";

import { getSorter, checkAccess, getColumns, GetSimplaDataPageMethods, } from "../../../../tools/form-manager";
import { usePageContext } from "../../../contexts/page-context";

import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";

import service from "../../../../services/official/tasks/user-my-tasks-service";

import UserMyTasksModal from "./user-my-task-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Tags",
    data: records,
    columns: [
      { label: Words.id, value: "TaskID" },
      { label: Words.title, value: "Title" },
      { label: Words.intervalTitle, value: "IntervalTitle" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.reminder_date, value: (record) => record.ReminderDate.length > 0 ? utils.slashDate(record.ReminderDate) : "", },
      { label: Words.reminder_time, value: (record) => record.ReminderTime.length > 0 ? utils.colonTime(record.ReminderTime) : "", },
      { label: Words.tags, value: (record) => utils.getDataFromJsonWithDash(record.Tags, "Title"), },
      { label: Words.letters, value: (record) => utils.getDataFromJsonWithDash(record.Letters, "Title"), },
      { label: Words.supervisors, value: (record) => utils.getDataFromJsonWithDash(record.Supervisors, "MemberName"), },
      { label: Words.descriptions, value: "DetailsText" },
      { label: Words.reg_date, value: (record) => utils.slashDate(record.RegDate), },
      { label: Words.reg_time, value: (record) => utils.colonTime(record.RegTime), },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id, width: 100, align: "center", dataIndex: "TaskID", sorter: getSorter("TaskID"),
    render: (TaskID) => <Text>{utils.farsiNum(`${TaskID}`)}</Text>,
  },
  {
    title: Words.title, width: 200, align: "center", ellipsis: true, dataIndex: "Title", sorter: getSorter("Title"),
    render: (Title) => <Text>{utils.farsiNum(Title)}</Text>,
  },
  {
    title: Words.intervalTitle, width: 200, align: "center", ellipsis: true, dataIndex: "IntervalTitle", sorter: getSorter("IntervalTitle"),
    render: (IntervalTitle) => (
      <Text>
        {(IntervalTitle !== undefined && IntervalTitle !== null) ? (IntervalTitle.length > 0 ? utils.farsiNum(IntervalTitle) : "") : ""}
      </Text>
    ),
  },
  {
    title: Words.responseMember, width: 200, align: "center", ellipsis: true, sorter: getSorter("LastName"),
    render: (record) => (<Text style={{ color: Colors.blue[6] }}>{`${record.FirstName} ${record.LastName}`}</Text>),
  },
  {
    title: Words.reminder_date, width: 100, align: "center", ellipsis: true, dataIndex: "ReminderDate", sorter: getSorter("ReminderDate"),
    render: (ReminderDate) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {(ReminderDate !== undefined && ReminderDate.length > 0) ? utils.farsiNum(utils.slashDate(ReminderDate)) : ""}
      </Text>
    ),
  },
  {
    title: Words.reminder_time, width: 100, align: "center", ellipsis: true, dataIndex: "ReminderTime", sorter: getSorter("ReminderTime"),
    render: (ReminderTime) => (
      <Text style={{ color: Colors.green[6] }}>
        {(ReminderTime !== undefined && ReminderTime.length > 0) ? utils.farsiNum(utils.colonTime(ReminderTime)) : ""}
      </Text>
    ),
  },
];

const recordID = "TaskID";

const UserMyTasksPage = ({ pageName }) => {
  const { progress, searched, searchText, setSearchText, records, setRecords, access, setAccess, selectedObject, showModal, } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleCloseModal, handleGetAll, handleSearch, handleAdd, handleEdit, handleDelete, handleSave, handleResetContext, } = GetSimplaDataPageMethods({ service, recordID, });

  const columns = access ? getColumns(baseColumns, null, access, handleEdit, handleDelete) : [];

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader title={Words.myTasks} searchText={searchText} sheets={getSheets(records)}
            fileName="MyTasks" onSearchTextChanged={(e) => setSearchText(e.target.value)} onSearch={handleSearch}
            onClear={() => setRecords([])} onGetAll={handleGetAll} onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (<SimpleDataTable records={records} columns={columns} />)}
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <UserMyTasksModal onOk={handleSave} onCancel={handleCloseModal} isOpen={showModal} selectedObject={selectedObject} />
      )}
    </>
  );
};

export default UserMyTasksPage;
