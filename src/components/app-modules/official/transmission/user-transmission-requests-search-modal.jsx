import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/transmission/user-transmission-requests";
import DropdownItem from "../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";

const schema = {
  SearchTypeID: Joi.number().min(1).required().label(Words.search_type),
  MemberID: Joi.number(),
  MissionTypeID: Joi.number(),
  TargetID: Joi.number(),
  RequestFromDate: Joi.string().allow(""),
  RequestToDate: Joi.string().allow(""),
  MissionFromDate: Joi.string().allow(""),
  MissionToDate: Joi.string().allow(""),
};

const initRecord = {
  SearchTypeID: 0,
  MemberID: 0,
  MissionTypeID: 0,
  TargetID: 0,
  RequestFromDate: "",
  RequestToDate: "",
  MissionFromDate: "",
  MissionToDate: "",
};

const formRef = React.createRef();

const UserTransmissionRequestsSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    members,
    setMembers,
    searchTypes,
    setSearchTypes,
    missionTypes,
    setMissionTypes,
    missionTargets,
    setMissionTargets,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.SearchTypeID = 0;
    record.MemberID = 0;
    record.MissionTypeID = 0;
    record.TargetID = 0;
    record.RequestFromDate = "";
    record.RequestToDate = "";
    record.MissionFromDate = "";
    record.MissionToDate = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { SearchTypes, MissionTypes, Targets, Members } = data;

      setSearchTypes(SearchTypes);
      setMissionTypes(MissionTypes);
      setMissionTargets(Targets);
      setMembers(Members);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.search_type}
              dataSource={searchTypes}
              keyColumn="SearchTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.mission_type}
              dataSource={missionTypes}
              keyColumn="MissionTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.employee}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.mission_target}
              dataSource={missionTargets}
              keyColumn="TargetID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.mission_from_date}
              fieldName="MissionFromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.mission_to_date}
              fieldName="MissionToDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.request_from_date}
              fieldName="ReuqestFromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.request_to_date}
              fieldName="ReuqestToDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserTransmissionRequestsSearchModal;
