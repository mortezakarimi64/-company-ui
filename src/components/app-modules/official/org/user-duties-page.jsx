import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/org/user-duties-service";
import { BsFillCircleFill as FillCircleIcon } from "react-icons/bs";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import DutyDetailsModal from "./user-duty-details-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Duties",
    data: records,
    columns: [
      { label: Words.id, value: "DutyID" },
      {
        label: Words.type,
        value: (record) =>
          record.DutyType === "RoleBased" ? Words.by_role : Words.by_personal,
      },
      { label: Words.title, value: "Title" },
      { label: Words.duty_level, value: "LevelTitle" },
      { label: Words.descriptions, value: "DetailsText" },
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
    dataIndex: "DutyID",
    sorter: getSorter("DutyID"),
    render: (DutyID) => <Text>{utils.farsiNum(`${DutyID}`)}</Text>,
  },
  {
    title: Words.duty_type,
    width: 100,
    align: "center",
    dataIndex: "DutyType",
    sorter: getSorter("DutyType"),
    render: (DutyType) => (
      <Text
        style={{
          color: DutyType === "PersonalBased" ? Colors.green[7] : Colors.red[7],
        }}
      >
        {DutyType === "PersonalBased" ? Words.by_personal : Words.by_role}
      </Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "right",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.duty_level,
    width: 100,
    align: "right",
    render: (record) => (
      <Space>
        <FillCircleIcon size={15} style={{ color: record.LevelColor }} />

        <Text>{record.LevelTitle}</Text>
      </Space>
    ),
  },
];

const recordID = "DutyID";

const UseDutiesPage = ({ pageName }) => {
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
    setSelectedObject,
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleGetAll,
    handleSearch,
    handleEdit,
    handleDelete,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <Button
        type="link"
        icon={<InfoIcon style={{ color: Colors.green[6] }} />}
        onClick={() => {
          setSelectedObject(record);
          setShowDetails(true);
        }}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.your_duties}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="YourDuties"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showDetails && (
        <DutyDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          duty={selectedObject}
        />
      )}
    </>
  );
};

export default UseDutiesPage;
