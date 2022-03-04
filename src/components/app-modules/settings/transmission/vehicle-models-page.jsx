import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/transmission/vehicle-models-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import VehicleModelModal from "./vehicle-model-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "VehicleModels",
    data: records,
    columns: [
      { label: Words.id, value: "ModelID" },
      { label: Words.brand, value: "BrandTitle" },
      { label: Words.model, value: "ModelTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "ModelID",
    sorter: getSorter("ModelID"),
    render: (ModelID) => <Text>{utils.farsiNum(`${ModelID}`)}</Text>,
  },
  {
    title: Words.brand,
    width: 200,
    align: "center",
    dataIndex: "BrandTitle",
    sorter: getSorter("BrandTitle"),
    render: (BrandTitle) => (
      <Text style={{ color: Colors.red[7] }}>{utils.farsiNum(BrandTitle)}</Text>
    ),
  },
  {
    title: Words.model,
    width: 200,
    align: "center",
    dataIndex: "ModelTitle",
    sorter: getSorter("ModelTitle"),
    render: (ModelTitle) => (
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(ModelTitle)}
      </Text>
    ),
  },
];

const recordID = "ModelID";

const VehicleModelsPage = ({ pageName }) => {
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
            title={Words.vehicle_models}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="VehicleModels"
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
        <VehicleModelModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default VehicleModelsPage;
