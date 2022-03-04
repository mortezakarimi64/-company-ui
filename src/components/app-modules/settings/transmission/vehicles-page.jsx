import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/transmission/vehicles-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import VehicleModal from "./vehicle-modal";
import VehicleDetailsModal from "./vehicle-details-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Vehicles",
    data: records,
    columns: [
      { label: Words.id, value: "VehicleID" },
      { label: Words.vehicle_type, value: "VehicleTypeTitle" },
      { label: Words.brand, value: "BrandTitle" },
      { label: Words.model, value: "ModelTitle" },
      { label: Words.product_year, value: "ProductYear" },
      { label: Words.pelak, value: "Pelak" },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.registerar,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      {
        label: Words.reg_date,
        value: (record) => `${utils.slashDate(record.RegDate)}`,
      },
      {
        label: Words.reg_time,
        value: (record) => `${utils.colonTime(record.RegTime)}`,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "VehicleID",
    sorter: getSorter("VehicleID"),
    render: (VehicleID) => <Text>{utils.farsiNum(`${VehicleID}`)}</Text>,
  },
  {
    title: Words.vehicle_type,
    width: 150,
    align: "center",
    dataIndex: "VehicleTypeTitle",
    sorter: getSorter("VehicleTypeTitle"),
    render: (VehicleTypeTitle) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(VehicleTypeTitle)}
      </Text>
    ),
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
  {
    title: Words.product_year,
    width: 100,
    align: "center",
    dataIndex: "ProductYear",
    sorter: getSorter("ProductYear"),
    render: (ProductYear) => (
      <Text style={{ color: Colors.cyan[7] }}>
        {utils.farsiNum(ProductYear)}
      </Text>
    ),
  },
  {
    title: Words.pelak,
    width: 120,
    align: "center",
    dataIndex: "Pelak",
    sorter: getSorter("Pelak"),
    render: (Pelak) => (
      <Text style={{ color: Colors.purple[7] }}>{utils.farsiNum(Pelak)}</Text>
    ),
  },
];

const recordID = "VehicleID";

const VehiclesPage = ({ pageName }) => {
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
    showDetails,
    setShowDetails,
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
            title={Words.vehicles}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Vehicles"
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
        <VehicleModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <VehicleDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          vehicle={selectedObject}
        />
      )}
    </>
  );
};

export default VehiclesPage;
