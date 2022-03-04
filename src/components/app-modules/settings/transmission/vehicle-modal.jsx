import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
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
import InputItem from "./../../../form-controls/input-item";
import TextItem from "./../../../form-controls/text-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import service from "../../../../services/settings/transmission/vehicles-service";
import utils from "../../../../tools/utils";

const schema = {
  VehicleID: Joi.number().required(),
  VehicleTypeID: Joi.number().min(1).required(),
  ModelID: Joi.number().min(1).required(),
  ProductYear: Joi.number()
    .min(1370)
    .max(1499)
    .required()
    .label(Words.product_year),
  Pelak: Joi.string()
    .min(8)
    .max(50)
    .required()
    .label(Words.pelak)
    .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    // .regex(/^[آ-یa-zA-Z0-9.\-()\s]+$/)
    .label(Words.descriptions),
};

const initRecord = {
  VehicleID: 0,
  VehicleTypeID: 0,
  ModelID: 0,
  ProductYear: 0,
  Pelak: "",
  DetailsText: "",
};

const formRef = React.createRef();

const VehicleBrandModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    types,
    setTypes,
    brands,
    setBrands,
    models,
    setModels,
    errors,
    setErrors,
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
    record.VehicleTypeID = 0;
    record.ModelID = 0;
    record.ProductYear = 0;
    record.Pelak = "";
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Brands, Models, VehicleTypes } = data;

      setTypes(VehicleTypes);
      setBrands(Brands);
      setModels(Models);
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

  const handleBrandChange = (value) => {
    const rec = { ...record };
    rec.BrandID = value;

    if (value === 0) {
      rec.ModelID = 0;
    }

    setRecord(rec);
  };

  const isEdit = selectedObject !== null;

  const filteredModels = models.filter((m) => m.BrandID === record.BrandID);

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.vehicle_type}
              dataSource={types}
              keyColumn="VehicleTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.brand}
              dataSource={brands}
              keyColumn="BrandID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
              onChange={handleBrandChange}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.model}
              dataSource={filteredModels}
              keyColumn="ModelID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.product_year}
              fieldName="ProductYear"
              min={1370}
              max={1499}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.pelak}
              fieldName="Pelak"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
            />
          </Col>

          {isEdit && (
            <>
              <Col xs={24} ms={12}>
                <TextItem
                  title={Words.reg_member}
                  value={`${selectedObject.RegFirstName} ${selectedObject.RegLastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24} md={12}>
                <TextItem
                  title={Words.reg_date_time}
                  value={utils.formattedDateTime(
                    selectedObject.RegDate,
                    selectedObject.RegTime
                  )}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default VehicleBrandModal;
