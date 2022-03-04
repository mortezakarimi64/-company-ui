import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, message } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/timex/user-members-new-missions-check-manager-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import SearchModal from "./user-members-new-missions-check-manager-search-modal";
import DetailsModal from "./user-members-new-missions-check-manager-details-modal";

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
    title: "MissionWaitForManagerCheck",
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
    title: Words.requester,
    width: 150,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.red[7] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
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
    title: Words.from_date,
    width: 120,
    align: "center",
    dataIndex: "StartDate",
    sorter: getSorter("StartDate"),
    render: (StartDate) => (
      <Text style={{ color: Colors.green[6] }}>
        {`${utils.weekDayNameFromText(StartDate)} - ${utils.farsiNum(
          utils.slashDate(StartDate)
        )}`}
      </Text>
    ),
  },
  {
    title: Words.from_time,
    width: 100,
    align: "center",
    dataIndex: "StartTime",
    sorter: getSorter("StartTime"),
    render: (StartTime) => (
      <>
        {StartTime.Length > 0 && (
          <Text style={{ color: Colors.magenta[6] }}>
            {`${utils.farsiNum(utils.colonTime(StartTime))}`}
          </Text>
        )}
      </>
    ),
  },
  {
    title: Words.to_date,
    width: 120,
    align: "center",
    dataIndex: "FinishDate",
    sorter: getSorter("FinishDate"),
    render: (FinishDate) => (
      <Text style={{ color: Colors.green[6] }}>
        {`${utils.weekDayNameFromText(FinishDate)} - ${utils.farsiNum(
          utils.slashDate(FinishDate)
        )}`}
      </Text>
    ),
  },
  {
    title: Words.to_time,
    width: 100,
    align: "center",
    dataIndex: "FinishTime",
    sorter: getSorter("FinishTime"),
    render: (FinishTime) => (
      <>
        {FinishTime.Length > 0 && (
          <Text style={{ color: Colors.magenta[6] }}>
            {`${utils.farsiNum(utils.colonTime(FinishTime))}`}
          </Text>
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

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "MissionID";

const UserMembersNewMissionsCheckManagerPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();

    await checkAccess(setAccess, pageName);

    const default_filter_for_new_requests = {
      MemberID: 0,
      MissionTypeID: 0,
      FromDate: "",
      ToDate: "",
    };

    setFilter(default_filter_for_new_requests);

    //------

    setProgress(true);

    try {
      await handleAdvancedSearch(default_filter_for_new_requests);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  const { handleEdit, handleDelete, handleResetContext, handleAdvancedSearch } =
    GetSimplaDataPageMethods({
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

  const handleSaveResponse = async (response) => {
    const data = await service.saveResponse(response);

    const index = records.findIndex((v) => (v.MissionID = response.MissionID));
    records[index] = data;
    setSelectedObject(data);

    message.success(Words.messages.your_response_submitted);
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.members_missions_check_manager}
            sheets={getSheets(records)}
            fileName="MissionWaitForManagerCheck"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          mission={selectedObject}
          onResponse={handleSaveResponse}
        />
      )}
    </>
  );
};

export default UserMembersNewMissionsCheckManagerPage;
