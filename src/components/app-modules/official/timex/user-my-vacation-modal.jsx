import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
// import Colors from "../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/official/timex/user-my-vacations-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";
import InputItem from "../../../form-controls/input-item";
// import TextItem from "../../../form-controls/text-item";
// import MemberProfileImage from "../../../common/member-profile-image";

const schema = {
  VacationID: Joi.number().required(),
  VacationTypeID: Joi.number().min(1).required(),
  SwapMemberID: Joi.number().min(1).required(),
  StartDate: Joi.string().required(),
  FinishDate: Joi.string().required(),
  StartTime: Joi.string().required().allow(""),
  FinishTime: Joi.string().required().allow(""),
  DetailsText: Joi.string().allow("").max(512),
};

const initRecord = {
  VacationID: 0,
  VacationTypeID: 0,
  SwapMemberID: 0,
  StartDate: "",
  FinishDate: "",
  StartTime: "",
  FinishTime: "",
  DetailsText: "",
};

const formRef = React.createRef();

const UserMyVacationModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    vacationTypes,
    setVacationTypes,
    swapMembers,
    setSwapMembers,
  } = useModalContext();

  const resetContext = useResetContext();

  const clearRecord = async () => {
    setProgress(true);
    try {
      const data = await service.getParams();
      const { CurrentDateTime } = data;

      record.VacationTypeID = 0;
      record.SwapMemberID = 0;
      record.StartDate = `${CurrentDateTime.CurrentDate}`;
      record.FinishDate = `${CurrentDateTime.CurrentDate}`;
      record.StartTime = "";
      record.FinishTime = "";
      record.DetailsText = "";

      setRecord(record);
      setErrors({});
      loadFieldsValue(formRef, record);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  };

  const getVacationType = (vacationTypeID) => {
    let result = "";

    const vacationTypeTitle = vacationTypes.find(
      (vt) => vt.VacationTypeID === vacationTypeID
    )?.Title;

    if (vacationTypeTitle?.startsWith("H-")) result = "hourly";
    if (vacationTypeTitle?.startsWith("D-")) result = "daily";

    return result;
  };

  const getSchema = () => {
    const isHourly = getVacationType(record.VacationTypeID) === "hourly";

    let result = { ...schema };

    if (isHourly) {
      result.StartTime = Joi.string().required();
      result.FinishTime = Joi.string().required();
    } else {
      result.StartTime = Joi.string().required().allow("");
      result.FinishTime = Joi.string().required().allow("");
    }

    return result;
  };

  const formConfig = {
    schema: getSchema(),
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { VacationTypes, SwapMembers, CurrentDateTime } = data;

      if (selectedObject === null) {
        const inr = { ...initRecord };
        inr.StartDate = `${CurrentDateTime.CurrentDate}`;
        inr.FinishDate = `${CurrentDateTime.CurrentDate}`;

        setRecord(inr);
      }

      setVacationTypes(VacationTypes);
      setSwapMembers(SwapMembers);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema: getSchema() }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {/* {isEdit && (
            <>
              <Col
                xs={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <MemberProfileImage fileName={record.PicFileName} size={60} />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.member}
                  value={`${record.FirstName} ${record.LastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )} */}

          {/* {!isEdit && (
            <Col xs={24}>
              <DropdownItem
                title={Words.employee}
                dataSource={employees}
                keyColumn="EmployeeID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
                autoFocus
              />
            </Col>
          )} */}

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.vacation_type}
              dataSource={vacationTypes}
              keyColumn="VacationTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.swap_member}
              dataSource={swapMembers}
              keyColumn="SwapMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
            />
          </Col>
          {record.VacationTypeID > 0 && (
            <>
              <Col xs={24} md={12}>
                <DateItem
                  horizontal
                  title={Words.start_date}
                  fieldName="StartDate"
                  formConfig={formConfig}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <DateItem
                  horizontal
                  title={Words.finish_date}
                  fieldName="FinishDate"
                  formConfig={formConfig}
                  required
                />
              </Col>
              {getVacationType(record.VacationTypeID) === "hourly" && (
                <>
                  <Col xs={24} md={12}>
                    <TimeItem
                      horizontal
                      title={Words.start_time}
                      fieldName="StartTime"
                      formConfig={formConfig}
                      required
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <TimeItem
                      horizontal
                      title={Words.finish_time}
                      fieldName="FinishTime"
                      formConfig={formConfig}
                      required
                    />
                  </Col>
                </>
              )}
            </>
          )}
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.descriptions}
              fieldName="DetailsText"
              formConfig={formConfig}
              multiline
              rows={7}
              maxLength={512}
              showCount
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMyVacationModal;
