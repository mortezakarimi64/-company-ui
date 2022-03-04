import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
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
import service from "../../../../services/official/timex/user-my-missions-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";
import InputItem from "../../../form-controls/input-item";
import SwitchItem from "../../../form-controls/switch-item";

const schema = {
  MissionID: Joi.number().required(),
  MissionTypeID: Joi.number().min(1).required(),
  TargetID: Joi.number().min(1).required(),
  SwapMemberID: Joi.number().min(1).required(),
  Subject: Joi.string().min(5).max(100).required().label(Words.mission_subject),
  NeedVehicle: Joi.boolean(),
  NeedHoteling: Joi.boolean(),
  StartDate: Joi.string().required(),
  FinishDate: Joi.string().required(),
  StartTime: Joi.string().required().allow(""),
  FinishTime: Joi.string().required().allow(""),
  DetailsText: Joi.string().allow("").max(512),
};

const initRecord = {
  MissionID: 0,
  MissionTypeID: 0,
  TaregtID: 0,
  SwapMemberID: 0,
  Subject: "",
  NeedVehicle: false,
  NeedHoteling: false,
  StartDate: "",
  FinishDate: "",
  StartTime: "",
  FinishTime: "",
  DetailsText: "",
};

const formRef = React.createRef();

const UserMyMissionModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    missionTypes,
    setMissionTypes,
    swapMembers,
    setMissionTargets,
    missionTargets,
    setSwapMembers,
  } = useModalContext();

  const resetContext = useResetContext();

  const clearRecord = async () => {
    setProgress(true);
    try {
      const data = await service.getParams();
      const { CurrentDateTime } = data;

      record.MissionTypeID = 0;
      record.TargetID = 0;
      record.SwapMemberID = 0;
      record.Subject = "";
      record.NeedVehicle = false;
      record.NeedHoteling = false;
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

  const getMissionType = (missionTypeID) => {
    let result = "";

    const missionTypeTitle = missionTypes.find(
      (vt) => vt.MissionTypeID === missionTypeID
    )?.Title;

    if (missionTypeTitle?.startsWith("H-")) result = "hourly";
    if (missionTypeTitle?.startsWith("D-")) result = "daily";

    return result;
  };

  const getSchema = () => {
    const isHourly = getMissionType(record.MissionTypeID) === "hourly";

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

      const { MissionTypes, MissionTargets, SwapMembers, CurrentDateTime } =
        data;

      if (selectedObject === null) {
        const inr = { ...initRecord };
        inr.StartDate = `${CurrentDateTime.CurrentDate}`;
        inr.FinishDate = `${CurrentDateTime.CurrentDate}`;

        setRecord(inr);
      }

      setMissionTypes(MissionTypes);
      setMissionTargets(MissionTargets);
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
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.mission_type}
              dataSource={missionTypes}
              keyColumn="MissionTypeID"
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
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.mission_target}
              dataSource={missionTargets}
              keyColumn="TargetID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              horizontal
              title={Words.mission_subject}
              fieldName="Subject"
              formConfig={formConfig}
              maxLength={100}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.need_vehicle}
              fieldName="NeedVehicle"
              initialValue={false}
              checkedTitle={Words.i_need}
              unCheckedTitle={Words.i_dont_need}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.need_hoteling}
              fieldName="NeedHoteling"
              initialValue={false}
              checkedTitle={Words.i_need}
              unCheckedTitle={Words.i_dont_need}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          {record.MissionTypeID > 0 && (
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
              {getMissionType(record.MissionTypeID) === "hourly" && (
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

export default UserMyMissionModal;
