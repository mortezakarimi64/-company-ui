import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Radio,
  Popconfirm,
} from "antd";
import { BsFillCircleFill as FillCircleIcon } from "react-icons/bs";
import {
  InfoCircleOutlined as InfoIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
  PlusOutlined as PlusIcon,
  DownloadOutlined as DownloadIcon,
} from "@ant-design/icons";
import ExportExcel from "../../../common/export-excel";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import DetailsTable from "../../../common/details-table";
import service from "../../../../services/official/org/user-members-duties-service";
import { getSorter, handleError } from "../../../../tools/form-manager";
import DutyDetailsModal from "./duty-details-modal";
import UserDutyModal from "./user-duty-modal";

const { Text } = Typography;

const getSheets = (records, employee) => [
  {
    title: `${employee.FirstName} ${employee.LastName}`,
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

const getColumns = (access, onSelect, onShowDetails, onEdit, onDelete) => [
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
    width: 75,
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
    width: 75,
    align: "right",
    sorter: getSorter("LevelTitle"),
    render: (record) => (
      <Space>
        <FillCircleIcon size={15} style={{ color: record.LevelColor }} />

        <Text style={{ fontSize: 12 }}>{record.LevelTitle}</Text>
      </Space>
    ),
  },
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 110,
    render: (record) => (
      <Space>
        <Button
          type="link"
          icon={<InfoIcon style={{ color: Colors.green[6] }} />}
          onClick={() => {
            onSelect(record);
            onShowDetails(true);
          }}
        />

        {access.CanEdit && onEdit && record.DutyType === "PersonalBased" && (
          <Button
            type="link"
            icon={<EditIcon />}
            onClick={() => onEdit(record)}
          />
        )}

        {access.CanDelete && onDelete && record.DutyType === "PersonalBased" && (
          <Popconfirm
            title={Words.questions.sure_to_delete_item}
            onConfirm={async () => await onDelete(record.DutyID)}
            okText={Words.yes}
            cancelText={Words.no}
            icon={<QuestionIcon style={{ color: "red" }} />}
          >
            <Button type="link" icon={<DeleteIcon />} danger />
          </Popconfirm>
        )}
      </Space>
    ),
  },
];

const UserMembersDutiesDetailsModal = ({ employee, access, isOpen, onOk }) => {
  const [duties, setDuties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState(false);
  const [radioValue, setRadioValue] = React.useState(3);

  useMount(async () => {
    await loadData();
  });

  const loadData = async () => {
    const data = await service.getEmployeeDuties(employee.EmployeeID);

    setDuties(data);
  };

  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const getDuties = () => {
    let result = [];

    switch (radioValue) {
      case 1:
        result = duties.filter((d) => d.DutyType === "RoleBased");
        break;

      case 2:
        result = duties.filter((d) => d.DutyType === "PersonalBased");
        break;

      case 3:
        result = [...duties];
        break;

      default:
        result = [...duties];
        break;
    }

    return result;
  };

  const handleEditDuty = (record) => {
    setSelectedDuty(record);
    setShowModal(true);
  };

  const handleDeleteDuty = async (recordID) => {
    try {
      await service.deleteData(recordID);

      const updatedDuties = duties.filter(
        (d) => !(d.DutyType === "PersonalBased" && d.DutyID === recordID)
      );

      setDuties(updatedDuties);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSave = async (record) => {
    try {
      await service.saveData(record);
      await loadData();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <Modal
        visible={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={[
          <Button key="submit-button" type="primary" onClick={onOk}>
            {Words.confirm}
          </Button>,
        ]}
        onCancel={onOk}
        width={850}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <Row gutter={[10, 10]}>
              <Col xs={24}>
                <Alert
                  message={`${employee.FirstName} ${employee.LastName}`}
                  type="info"
                  showIcon
                />
              </Col>
              <Col xs={24} md={12}>
                <Radio.Group onChange={onRadioChange} value={radioValue}>
                  <Radio value={1}>{Words.by_role}</Radio>
                  <Radio value={2}>{Words.by_personal}</Radio>
                  <Radio value={3}>{Words.by_role_personal}</Radio>
                </Radio.Group>
              </Col>
              <Col xs={24} md={12} className="rowFlex flexEnd">
                <Space>
                  <ExportExcel
                    sheets={getSheets(getDuties(), employee)}
                    fileName="EmployeeDuties"
                    button={
                      <Button type="primary" icon={<DownloadIcon />}>
                        {Words.excel}
                      </Button>
                    }
                  />

                  <Button
                    type="primary"
                    icon={<PlusIcon />}
                    onClick={() => {
                      setShowModal(true);
                      setSelectedDuty(null);
                    }}
                  >
                    {Words.new}
                  </Button>
                </Space>
              </Col>
              <Col xs={24}>
                <DetailsTable
                  records={getDuties()}
                  columns={getColumns(
                    access,
                    setSelectedDuty,
                    setShowDetails,
                    handleEditDuty,
                    handleDeleteDuty
                  )}
                />
              </Col>
            </Row>
          </article>
        </section>
      </Modal>

      {showModal && (
        <UserDutyModal
          onOk={handleSave}
          onCancel={() => {
            setShowModal(false);
            setSelectedDuty(null);
          }}
          isOpen={showModal}
          selectedObject={selectedDuty}
          employee={employee}
        />
      )}

      {showDetails && (
        <DutyDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedDuty(null);
          }}
          isOpen={showDetails}
          duty={selectedDuty}
        />
      )}
    </>
  );
};

export default UserMembersDutiesDetailsModal;
