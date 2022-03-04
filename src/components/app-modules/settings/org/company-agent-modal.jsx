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
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import DropdownItem from "../../../form-controls/dropdown-item";
import InputItem from "../../../form-controls/input-item";
import companyAgentsService from "../../../../services/settings/org/company-agents-service";
import accessesService from "../../../../services/app/accesses-service";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  AgentID: Joi.number().required(),
  RoleID: Joi.number().required().min(1),
  CompanyID: Joi.number().required().min(1),
  FirstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.first_name),
  LastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.last_name),
  FixTel: Joi.string()
    .max(50)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.fix_tel),
  Mobile: Joi.string()
    .max(11)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.mobile),
  DetailsText: Joi.string().max(200).allow("").label(Words.descriptions),
};

const initRecord = {
  AgentID: 0,
  RoleID: 0,
  CompanyID: 0,
  FirstName: "",
  LastName: "",
  FixTel: "",
  Mobile: "",
  DetailsText: "",
};

const formRef = React.createRef();

const CompanyAgentModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    companySearchProgress,
    setCompanySearchProgress,
    companies,
    setCompanies,
    roles,
    setRoles,
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
    record.AgentID = 0;
    record.RoleID = 0;
    record.CompanyID = 0;
    record.FirstName = "";
    record.LastName = "";
    record.FixTel = "";
    record.Mobile = "";
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const roles_data = await companyAgentsService.getParams();
    setRoles(roles_data);

    if (isEdit) {
      const { CompanyID, CompanyTitle, RegNo } = selectedObject;
      setCompanies([{ CompanyID, CompanyTitle: `${CompanyTitle} (${RegNo})` }]);
    }
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

  const handleSearchCompanies = async (searchValue) => {
    setCompanySearchProgress(true);

    try {
      const data_companies = await accessesService.searchCompanies(
        "CompanyAgents",
        searchValue
      );

      setCompanies(data_companies);
    } catch (ex) {
      handleError(ex);
    }

    setCompanySearchProgress(false);
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.company}
              dataSource={companies}
              keyColumn="CompanyID"
              valueColumn="CompanyTitle"
              formConfig={formConfig}
              required
              autoFocus
              loading={companySearchProgress}
              onSearch={handleSearchCompanies}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.role}
              dataSource={roles}
              keyColumn="RoleID"
              valueColumn="RoleTitle"
              formConfig={formConfig}
              required
              loading={companySearchProgress}
              onSearch={handleSearchCompanies}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.first_name}
              fieldName="FirstName"
              required
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.last_name}
              fieldName="LastName"
              maxLength={50}
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.fix_tel}
              fieldName="FixTel"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.mobile}
              fieldName="Mobile"
              maxLength={11}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              maxLength={200}
              multiline
              showCount
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default CompanyAgentModal;
