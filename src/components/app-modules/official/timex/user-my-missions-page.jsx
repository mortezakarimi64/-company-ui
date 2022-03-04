import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space, message } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/timex/user-my-missions-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import MissionModal from "./user-my-mission-modal";
import MissionSearchModal from "./user-my-mission-search-modal";
import MissionDetailsModal from "./user-my-mission-details-modal";

const { Text } = Typography;

const getMissionStatusColor = (statusID) => {
  let color = Colors.grey[6];

  switch (statusID) {
    case 2:
      color = Colors.green[6];
      break;
    case 3:
      color = Colors.red[6];
      break;
    default:
      color = Colors.grey[6];
      break;
  }

  return color;
};

const getMissionStatusTitle = (statusID) => {
  let title = Words.in_progress;

  switch (statusID) {
    case 2:
      title = Words.accepted;
      break;
    case 3:
      title = Words.rejected;
      break;
    default:
      title = Words.in_progress;
      break;
  }

  return title;
};

const getSheets = (records) => [
  {
    title: "MyMissions",
    data: records,
    columns: [
      { label: Words.id, value: "MissionID" },
      {
        label: Words.full_name,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      {
        label: Words.mission_type,
        value: (record) => `${record.MissionTypeTitle}`,
      },
      {
        label: Words.mission_target,
        value: "TargetTitle",
      },
      {
        label: Words.mission_subject,
        value: "Subject",
      },
      {
        label: Words.need_vehicle,
        value: (record) => (record.NeedVehicle ? Words.yes : Words.no),
      },
      {
        label: Words.need_hoteling,
        value: (record) => (record.NeedHoteling ? Words.yes : Words.no),
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      {
        label: Words.from_date,
        value: (record) => utils.slashDate(record.StartDate),
      },
      {
        label: Words.from_time,
        value: (record) => utils.colonTime(record.StartTime),
      },
      {
        label: Words.to_date,
        value: (record) => utils.slashDate(record.FinishDate),
      },
      {
        label: Words.to_time,
        value: (record) => utils.colonTime(record.FinishTime),
      },
      {
        label: Words.descriptions,
        value: (record) => record.DetailsText,
      },
      {
        label: Words.status,
        value: (record) => getMissionStatusTitle(record.FinalStatusID),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "MissionID",
    sorter: getSorter("MissionID"),
    render: (MissionID) => <Text>{utils.farsiNum(`${MissionID}`)}</Text>,
  },
  {
    title: Words.mission_type,
    width: 120,
    align: "center",
    dataIndex: "MissionTypeTitle",
    sorter: getSorter("MissionTypeTitle"),
    render: (MissionTypeTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{MissionTypeTitle}</Text>
    ),
  },
  {
    title: Words.mission_target,
    width: 150,
    align: "center",
    dataIndex: "TargetTitle",
    sorter: getSorter("TargetTitle"),
    render: (TargetTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{TargetTitle}</Text>
    ),
  },
  {
    title: Words.from,
    width: 150,
    align: "center",
    sorter: getSorter("StartDate"),
    render: (record) => (
      <>
        {record.StartTime.length === 0 ? (
          <Text style={{ color: Colors.green[6] }}>
            {`${utils.weekDayNameFromText(record.StartDate)} - ${utils.farsiNum(
              utils.slashDate(record.StartDate)
            )}`}
          </Text>
        ) : (
          <Space direction="vertical">
            <Text style={{ color: Colors.green[6] }}>
              {`${utils.weekDayNameFromText(
                record.StartDate
              )} - ${utils.farsiNum(utils.slashDate(record.StartDate))}`}
            </Text>

            <Text style={{ color: Colors.magenta[6] }}>
              {`${utils.farsiNum(utils.colonTime(record.StartTime))}`}
            </Text>
          </Space>
        )}
      </>
    ),
  },
  {
    title: Words.to,
    width: 150,
    align: "center",
    sorter: getSorter("FinishDate"),
    render: (record) => (
      <>
        {record.FinishTime.length === 0 ? (
          <Text style={{ color: Colors.green[6] }}>
            {`${utils.weekDayNameFromText(
              record.FinishDate
            )} - ${utils.farsiNum(utils.slashDate(record.FinishDate))}`}
          </Text>
        ) : (
          <Space direction="vertical">
            <Text style={{ color: Colors.green[6] }}>
              {`${utils.weekDayNameFromText(
                record.FinishDate
              )} - ${utils.farsiNum(utils.slashDate(record.FinishDate))}`}
            </Text>

            <Text style={{ color: Colors.magenta[6] }}>
              {`${utils.farsiNum(utils.colonTime(record.FinishTime))}`}
            </Text>
          </Space>
        )}
      </>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    dataIndex: "FinalStatusID",
    sorter: getSorter("FinalStatusID"),
    render: (FinalStatusID) => (
      <Text style={{ color: getMissionStatusColor(FinalStatusID) }}>
        {getMissionStatusTitle(FinalStatusID)}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "MissionID";

const UserMyMissionsPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showDetails,
    setShowDetails,
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

  const getOperationalButtons = (record) => {
    return (
      <>
        {record.RegTypeID !== 1 && (
          <Button
            type="link"
            icon={<InfoIcon style={{ color: Colors.green[6] }} />}
            onClick={() => {
              setSelectedObject(record);
              setShowDetails(true);
            }}
          />
        )}
      </>
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete,
        handleCheckEditable,
        handleCheckDeletable
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  //------

  const handleSaveReport = async (report) => {
    const data = await service.saveReport(report);

    const index = records.findIndex((m) => (m.MissionID = report.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_report_submitted);
  };

  const handleDeleteReport = async (report) => {
    const data = await service.deleteReport(report.ReportID);

    const index = records.findIndex((m) => (m.MissionID = report.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_report_deleted);
  };

  const handleSaveSeenDateTime = async (note) => {
    const data = await service.saveNoteSeenDateTime(note);

    const index = records.findIndex((m) => (m.MissionID = note.MissionID));
    records[index] = data;

    setSelectedObject(data);
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.my_missions}
            sheets={getSheets(records)}
            fileName="MyMissions"
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
        <MissionSearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <MissionModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <MissionDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          mission={selectedObject}
          onSaveReport={handleSaveReport}
          onDeleteReport={handleDeleteReport}
          onSaveSeenDateTime={handleSaveSeenDateTime}
        />
      )}
    </>
  );
};

export default UserMyMissionsPage;
