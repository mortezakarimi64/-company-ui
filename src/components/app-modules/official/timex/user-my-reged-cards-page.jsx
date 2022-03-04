import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/timex/user-my-reged-cards-service";
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
import RegedCardSearchModal from "./user-my-reged-card-search-modal";
import RegedCardDetailsModal from "./user-my-reged-card-details-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MyRegedCards",
    data: records,
    columns: [
      { label: Words.id, value: "RegID" },
      {
        label: Words.employee,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      { label: Words.card_no, value: "CardNo" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.CardRegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.CardRegTime),
      },
      {
        label: Words.reg_type,
        value: (record) => record.RegTypeTitle,
      },
      {
        label: Words.reg_member,
        value: (record) =>
          `${record.RegisterarFirstName} ${record.RegisterarLastName}`,
      },
      {
        label: Words.manual_reg_date,
        value: (record) => utils.slashDate(record.RegisterarRegDate),
      },
      {
        label: Words.manual_reg_time,
        value: (record) => utils.colonTime(record.RegisterarRegTime),
      },
      {
        label: Words.descriptions,
        value: (record) => record.RegisterarDetailsText,
      },
      {
        label: Words.security_guard_reg_id,
        value: (record) => record.SecurityGuardRegID,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "RegID",
    sorter: getSorter("RegID"),
    render: (RegID) => <Text>{utils.farsiNum(`${RegID}`)}</Text>,
  },
  {
    title: Words.card_no,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "CardNo",
    sorter: getSorter("CardNo"),
    render: (CardNo) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(`${CardNo}`)}
      </Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "CardRegDate",
    sorter: getSorter("CardRegDate"),
    render: (CardRegDate) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.slashDate(CardRegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "CardRegTime",
    sorter: getSorter("CardRegTime"),
    render: (CardRegTime) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(utils.colonTime(CardRegTime))}
      </Text>
    ),
  },
  {
    title: Words.reg_type,
    width: 100,
    align: "center",
    ellipsis: true,
    dataIndex: "RegTypeTitle",
    sorter: getSorter("RegTypeTitle"),
    render: (RegTypeTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{RegTypeTitle}</Text>
    ),
  },
];

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "RegID";

const UserMyRegedCardsPage = ({ pageName }) => {
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
    selectedObject,
    setSelectedObject,
    showDetails,
    setShowDetails,
    // showModal,
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
    // handleCloseModal,
    // handleAdd,
    // handleEdit,
    // handleDelete,
    // handleSave,
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
        null, //handleEdit,
        null, //handleDelete,
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

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.my_reged_cards}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="MyRegedCards"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
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
        <RegedCardSearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <RegedCardDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          regedCard={selectedObject}
        />
      )}
    </>
  );
};

export default UserMyRegedCardsPage;
