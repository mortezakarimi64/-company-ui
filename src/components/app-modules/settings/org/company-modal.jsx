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
} from "../../../../tools/form-manager";
import InputItem from "../../../form-controls/input-item";
import DropdownItem from "../../../form-controls/dropdown-item";
import companiesService from "../../../../services/settings/org/companies-service";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  CompanyID: Joi.number().required(),
  CityID: Joi.number().required().min(1),
  CompanyTitle: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.title),
  OfficeTel: Joi.string()
    .max(50)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.office_tel),
  Fax: Joi.string()
    .max(50)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.fax),
  Address: Joi.string().min(25).max(200).required().label(Words.address),
  PostalCode: Joi.string()
    .max(10)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.postal_code),
  NationalID: Joi.string()
    .min(10)
    .max(50)
    .required()
    .regex(/^[0-9]+$/)
    .label(Words.national_id),
  FinancialCode: Joi.string()
    .min(10)
    .max(50)
    .allow("")
    // .required()
    .regex(/^[0-9]+$/)
    .label(Words.financial_code),
  RegNo: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    // .required()
    .regex(/^[0-9]+$/)
    .label(Words.reg_no),
};

const initRecord = {
  CompanyID: 0,
  CompanyTitle: "",
  CityID: 0,
  OfficeTel: "",
  Fax: "",
  Address: "",
  PostalCode: "",
  NatioanlID: "",
  FinancialCode: "",
  RegNo: "",
};

const formRef = React.createRef();

const CompanyModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    provinces,
    setProvinces,
    selectedProvinceID,
    setSelectedProvinceID,
    cities,
    setCities,
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
    record.CompanyTitle = "";
    record.CityID = 0;
    record.OfficeTel = "";
    record.Fax = "";
    record.Address = "";
    record.PostalCode = "";
    record.NationalID = "";
    record.FinancialCode = "";
    record.RegNo = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const data = await companiesService.getParams();

    setProvinces(data.Provinces);
    setCities(data.Cities);

    setSelectedProvinceID(
      selectedObject !== null ? selectedObject.ProvinceID : 0
    );
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

  const handleSelectProvince = (value) => {
    setSelectedProvinceID(value);
  };

  const getCities = () => {
    const selectedCities = cities.filter(
      (c) => c.ProvinceID === selectedProvinceID
    );
    return selectedCities;
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
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="CompanyTitle"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.national_id}
              fieldName="NationalID"
              maxLength={50}
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.financial_code}
              fieldName="FinancialCode"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.reg_no}
              fieldName="RegNo"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.postal_code}
              fieldName="PostalCode"
              maxLength={10}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.province}
              dataSource={provinces}
              keyColumn="ProvinceID"
              valueColumn="ProvinceTitle"
              onChange={handleSelectProvince}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.city}
              dataSource={getCities()}
              keyColumn="CityID"
              valueColumn="CityTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.address}
              fieldName="Address"
              maxLength={200}
              multiline
              showCount
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.office_tel}
              fieldName="OfficeTel"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.fax}
              fieldName="Fax"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default CompanyModal;
