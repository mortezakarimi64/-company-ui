import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Select,
  Card,
  Progress,
  Popconfirm,
  Popover,
} from "antd";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/holidays-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../tools/form-manager";
import HolidayModal from "./holiday-modal";
import { usePageContext } from "./../../../contexts/page-context";
import {
  PlusOutlined as PlusIcon,
  DownloadOutlined as DownloadIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  InfoCircleOutlined as InfoIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import { AiTwotoneCalendar as CalendarIcon } from "react-icons/ai";
import ExportExcel from "../../../common/export-excel";
import Colors from "../../../../resources/colors";
import Words from "../../../../resources/words";

const { Text } = Typography;
const { Option } = Select;

const monthes = [
  { monthNo: 1, title: Words.monthes.farvardin, seasonNo: 1 },
  { monthNo: 2, title: Words.monthes.ordibehesht, seasonNo: 1 },
  { monthNo: 3, title: Words.monthes.khordad, seasonNo: 1 },
  //---
  { monthNo: 4, title: Words.monthes.tir, seasonNo: 2 },
  { monthNo: 5, title: Words.monthes.mordad, seasonNo: 2 },
  { monthNo: 6, title: Words.monthes.shahrivar, seasonNo: 2 },
  //---
  { monthNo: 7, title: Words.monthes.mehr, seasonNo: 3 },
  { monthNo: 8, title: Words.monthes.aban, seasonNo: 3 },
  { monthNo: 9, title: Words.monthes.azar, seasonNo: 3 },
  //---
  { monthNo: 10, title: Words.monthes.dey, seasonNo: 4 },
  { monthNo: 11, title: Words.monthes.bahman, seasonNo: 4 },
  { monthNo: 12, title: Words.monthes.esfand, seasonNo: 4 },
];

const MonthCard = ({ month, days, access, onEdit, onDelete }) => {
  const seasonColors = [
    { seasonNo: 1, startColor: "#128D08", finishColor: "#83C07E" },
    { seasonNo: 2, startColor: "#CC0608", finishColor: "#E78586" },
    { seasonNo: 3, startColor: "#EF850D", finishColor: "#EDBF68" },
    { seasonNo: 4, startColor: "#0D9ED8", finishColor: "#90D1EB" },
  ];

  return (
    <Card size="small" style={{ height: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <CalendarIcon
            size={20}
            style={{ color: Colors.grey[6], marginTop: 5 }}
          />
          <Text>{month.title}</Text>
        </Space>

        <Progress
          strokeColor={{
            "0%": seasonColors.find((s) => s.seasonNo === month.seasonNo)
              .startColor,
            "100%": seasonColors.find((s) => s.seasonNo === month.seasonNo)
              .finishColor,
          }}
          percent={100}
          showInfo={false}
        />

        <Row gutter={[5, 10]}>
          {days.map((day) => (
            <Col xs={24} key={day.HolidayID}>
              <div
                style={{ display: "flex", flexGrow: 1, alignItems: "center" }}
              >
                <Text style={{ flexGrow: 1 }}>{`${utils.farsiNum(
                  day.HolidayDate.substring(6)
                )} - ${utils.weekDayNameFromText(day.HolidayDate)}`}</Text>

                <Space>
                  {day.DetailsText.length > 0 && (
                    <Popover
                      content={
                        <Text style={{ fontSize: 12, whiteSpace: "pre-line" }}>
                          {day.DetailsText}
                        </Text>
                      }
                      trigger="click"
                    >
                      <Button
                        type="link"
                        icon={<InfoIcon />}
                        style={{ color: Colors.orange[6] }}
                      />
                    </Popover>
                  )}

                  {access?.CanEdit && (
                    <Button
                      type="link"
                      icon={<EditIcon />}
                      onClick={() => onEdit(day)}
                    />
                  )}

                  {access?.CanDelete && (
                    <Popconfirm
                      title={Words.questions.sure_to_delete_item}
                      onConfirm={async () => await onDelete(day)}
                      okText={Words.yes}
                      cancelText={Words.no}
                      icon={<QuestionIcon style={{ color: "red" }} />}
                    >
                      <Button type="link" icon={<DeleteIcon />} danger />
                    </Popconfirm>
                  )}
                </Space>
              </div>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
};

const getSheets = (records) => [
  {
    title: "Holidays",
    data: records,
    columns: [
      { label: Words.id, value: "HolidayID" },
      {
        label: Words.date,
        value: (record) => utils.slashDate(record.HolidayDate),
      },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const DropdownYears = ({ dataSource, onChange, value }) => {
  return (
    <Select
      showSearch
      placeholder={Words.select_please}
      value={value}
      style={{ width: 100 }}
      onChange={(selectedValue) => onChange(selectedValue)}
    >
      {dataSource &&
        dataSource.map((item) => (
          <Option key={`YearNo_${item.YearNo}`} value={item.YearNo}>
            {item.YearNo}
          </Option>
        ))}
    </Select>
  );
};

const PageHeader = ({
  title,
  sheets,
  years,
  selectedYear,
  fileName,
  access,
  onAdd,
  onChangeYear,
}) => {
  return (
    <>
      <Col xs={24}>
        <Text
          style={{
            paddingBottom: 20,
            paddingRight: 5,
            fontSize: 18,
          }}
          strong
          type="success"
        >
          {title}
        </Text>
      </Col>

      <Col xs={24}>
        <Space>
          {years.length > 0 && (
            <DropdownYears
              dataSource={years}
              value={selectedYear}
              onChange={onChangeYear}
            />
          )}

          <ExportExcel
            sheets={sheets}
            fileName={fileName}
            button={
              <Button type="primary" icon={<DownloadIcon />}>
                {Words.excel}
              </Button>
            }
          />

          {access?.CanAdd && onAdd && (
            <Button type="primary" icon={<PlusIcon />} onClick={onAdd}>
              {Words.new}
            </Button>
          )}
        </Space>
      </Col>
    </>
  );
};

const getHolidays = (days, year, month) => {
  const yearMonth = `${year}${month < 10 ? "0" : ""}${month}`;

  return days.filter((d) => d.HolidayDate.substring(0, 6) === yearMonth);
};

const recordID = "HolidayID";

const HolidaysPage = ({ pageName }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(0);

  const {
    progress,
    setProgress,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    showModal,
  } = usePageContext();

  const {
    handleCloseModal,
    handleAdd,
    handleSave,
    handleEdit,
    handleDelete,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  useMount(async () => {
    handleResetContext();

    setProgress(true);

    try {
      const data = await service.getParams();

      setYears(data.Years);
      if (data.Years.length > 0) {
        const currentYear = data.Years[0].YearNo;

        setSelectedYear(currentYear);

        const holidays = await service.getHolidays(currentYear);
        setRecords(holidays);
      }
    } catch (err) {
      handleError(err);
    }

    setProgress(false);

    await checkAccess(setAccess, pageName);
  });

  const handleChangeYear = async (selectedValue) => {
    setSelectedYear(parseInt(selectedValue));

    setProgress(true);

    try {
      const holidays = await service.getHolidays(parseInt(selectedValue));
      setRecords(holidays);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <PageHeader
            title={Words.holidays}
            sheets={getSheets(records)}
            fileName="Holidays"
            years={years}
            selectedYear={selectedYear}
            access={access}
            onChangeYear={handleChangeYear}
            onAdd={access?.CanAdd && handleAdd}
          />

          {monthes.map((month) => (
            <Col xs={24} md={8} key={month.monthNo}>
              <MonthCard
                month={month}
                days={getHolidays(records, selectedYear, month.monthNo)}
                access={access}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      </Spin>

      {showModal && (
        <HolidayModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default HolidaysPage;
