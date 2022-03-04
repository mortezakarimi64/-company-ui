import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Tooltip } from "antd";
import { GiModernCity as CityIcon } from "react-icons/gi";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/basic-info/provinces-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import ProvinceModal from "./province-modal";
import ProvinceCitiesModal from "./province-cities-modal";
import { usePageContext } from "./../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Provinces",
    data: records,
    columns: [
      { label: Words.id, value: "ProvinceID" },
      { label: Words.title, value: "ProvinceTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "ProvinceID",
    sorter: getSorter("ProvinceID"),
    render: (ProvinceID) => <Text>{utils.farsiNum(`${ProvinceID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "ProvinceTitle",
    sorter: getSorter("ProvinceTitle"),
    render: (ProvinceTitle) => <Text>{utils.farsiNum(ProvinceTitle)}</Text>,
  },
];

const recordID = "ProvinceID";

const ProvincesPage = ({ pageName }) => {
  const [showCitiesModal, setShowCitiesModal] = useState(false);

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

  const getOperationalButtons = (record) => {
    return (
      <Tooltip title={Words.cities}>
        <Button
          type="link"
          icon={<CityIcon style={{ color: Colors.cyan[6] }} />}
          onClick={() => {
            setSelectedObject(record);
            setShowCitiesModal(true);
          }}
        />
      </Tooltip>
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
            title={Words.provinces}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Provinces"
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
        <ProvinceModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showCitiesModal && (
        <ProvinceCitiesModal
          onOk={() => {
            setSelectedObject(null);
            setShowCitiesModal(false);
          }}
          isOpen={showCitiesModal}
          province={selectedObject}
        />
      )}
    </>
  );
};

export default ProvincesPage;
