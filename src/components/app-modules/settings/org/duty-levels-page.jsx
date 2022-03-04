import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Space, Button } from "antd";
import { MdColorLens as ColorIcon } from "react-icons/md";
import {
  AiFillCaretUp as UpIcon,
  AiFillCaretDown as DownIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/org/duty-levels-service";
import {
  //   getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import DutyLevelModal from "./duty-level-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "DutyLevels",
    data: records,
    columns: [
      { label: Words.id, value: "LevelID" },
      { label: Words.title, value: "LevelTitle" },
      { label: Words.color_code, value: "LevelColor" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "LevelID",
    // sorter: getSorter("LevelID"), ===> disable because here we have OrderID sorting
    render: (LevelID) => <Text>{utils.farsiNum(`${LevelID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    ellipsis: true,
    render: (record) => (
      <Text style={{ color: record.LevelColor }}>{record.LevelTitle}</Text>
    ),
  },
  {
    title: Words.color_id,
    width: 75,
    align: "center",
    ellipsis: true,
    render: (record) => (
      <ColorIcon size="20" style={{ color: record.LevelColor }} />
    ),
  },
];

const recordID = "LevelID";

const DutyLevelsPage = ({ pageName }) => {
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
    setSearched,
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

  const handleChangeOrder = async (rec, direction) => {
    const data = await service.changeOrder(rec.LevelID, direction);

    setRecords(data);
  };

  const getOperationalButtons = (record) => {
    return (
      <Space>
        <Button
          type="link"
          icon={<UpIcon size={20} style={{ color: Colors.blue[6] }} />}
          onClick={async () => await handleChangeOrder(record, "up")}
        />

        <Button
          type="link"
          icon={<DownIcon size={20} style={{ color: Colors.red[6] }} />}
          onClick={async () => await handleChangeOrder(record, "down")}
        />
      </Space>
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        access.CanEdit ? getOperationalButtons : null,
        access,
        handleEdit,
        handleDelete
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.duty_levels}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="DutyLevels"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClear}
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
        <DutyLevelModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default DutyLevelsPage;
