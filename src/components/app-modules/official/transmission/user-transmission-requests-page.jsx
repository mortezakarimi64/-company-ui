import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, message, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/transmission/user-transmission-requests";
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
import SearchModal from "./user-transmission-requests-search-modal";
import DetailsModal from "./user-transmission-requests-details-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "TransmissionRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RowID" },
      {
        label: Words.full_name,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      {
        label: Words.mission_target,
        value: (record) => `${record.TargetTitle}`,
      },
      {
        label: Words.in_province,
        value: (record) => (record.InProvince ? Words.yes : Words.no),
      },
      {
        label: Words.mission_format,
        value: (record) =>
          record.FormatID === 1 ? Words.by_hour : Words.by_day,
      },
      {
        label: Words.mission_type,
        value: (record) => `${record.MissionTypeTitle}`,
      },
      {
        label: Words.official_manager,
        value: (record) =>
          `${record.OfficialFirstName} ${record.OfficialLastName}`,
      },
      {
        label: Words.request_reg_date,
        value: (record) => utils.slashDate(record.RequestDate),
      },
      {
        label: Words.request_reg_time,
        value: (record) => utils.colonTime(record.RequestTime),
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
        label: Words.transfer_type,
        value: (record) => record.TransferTypeTitle,
      },
      {
        label: Words.pelak,
        value: (record) => record.Pelak,
      },
      {
        label: Words.product_year,
        value: (record) => record.Pelak,
      },
      {
        label: Words.brand,
        value: (record) => record.BrandTitle,
      },
      {
        label: Words.model,
        value: (record) => record.ModelTitle,
      },
      {
        label: Words.vehicle_type,
        value: (record) => record.VehicleTypeTitle,
      },
      {
        label: Words.descriptions,
        value: (record) => record.DetailsText,
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
    title: Words.mission_target,
    width: 200,
    align: "center",
    sorter: getSorter("TargetTitle"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.purple[6] }}>{record.TargetTitle}</Text>
        <Text style={{ color: Colors.grey[6], fontSize: 12 }}>
          {record.InProvince ? Words.inside_province : ""}
        </Text>
      </Space>
    ),
  },
];

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "RowID";

const UserTransmissionRequestsPage = ({ pageName }) => {
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
      SearchTypeID: 1,
      MemberID: 0,
      MissionTypeID: 0,
      TargetID: 0,
      RequestFromDate: "",
      RequestToDate: "",
      MissionFromDate: "",
      MissionToDate: "",
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

    const index = records.findIndex((v) => (v.RowID = response.RowID));
    records[index] = data;
    setSelectedObject(data);

    message.success(Words.messages.your_response_submitted);
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.transmission_requests}
            sheets={getSheets(records)}
            fileName="TransmissionRequests"
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
          request={selectedObject}
          onResponse={handleSaveResponse}
        />
      )}
    </>
  );
};

export default UserTransmissionRequestsPage;
