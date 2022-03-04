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
import TextItem from "./../../../form-controls/text-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import service from "./../../../../services/settings/timex/department-extra-work-capacities-service";
import utils from "./../../../../tools/utils";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
const schema = {
  CapacityID: Joi.number().required(),
  DepartmentID: Joi.number().required().min(1),
  CapacityInHours: Joi.number().min(0).max(1000).required(),
};

const initRecord = {
  CapacityID: 0,
  DepartmentID: 0,
  CapacityInHours: 0,
};

const formRef = React.createRef();

const DepartmentExtraWorkCapacityModal = ({
  isOpen,
  selectedObject,
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
    departments,
    setDepartments,
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
    record.DepartmentID = 0;
    record.CapacityInHours = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    try {
      const data = await service.getParams();

      setDepartments(data.Departments);
    } catch (err) {
      handleError(err);
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
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>

          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.capacity_in_hours}
              fieldName="CapacityInHours"
              min={0}
              max={1000}
              formConfig={formConfig}
            />
          </Col>

          {isEdit && (
            <>
              <Col xs={24} ms={12}>
                <TextItem
                  title={Words.reg_member}
                  value={`${record.RegFirstName} ${record.RegLastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24} md={12}>
                <TextItem
                  title={Words.reg_date_time}
                  value={utils.formattedDateTime(
                    record.RegDate,
                    record.RegTime
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

export default DepartmentExtraWorkCapacityModal;
