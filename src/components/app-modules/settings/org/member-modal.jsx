import React, { useEffect } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, message, Button, Avatar, Space, Tooltip } from "antd";
import {
  UserOutlined as UserIcon,
  CloseOutlined as RemoveIcon,
  ReloadOutlined as ReloadIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  hasFormError,
  handleError,
  trimRecord,
  // saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "../../../form-controls/input-item";
import DropdownItem from "../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import SwitchItem from "../../../form-controls/switch-item";
import FileItem from "../../../form-controls/file-item";
import TextItem from "../../../form-controls/text-item";
import membersService from "../../../../services/settings/org/members-service";
import fileService from "../../../../services/file-service";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  profileImageFileSize as fileConfig,
  fileBasicUrl,
} from "../../../../config.json";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  MemberID: Joi.number().required(),
  ProvinceID: Joi.number().required().min(1),
  CityID: Joi.number().required().min(1),
  GenderID: Joi.number().required().min(1),
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
  Address: Joi.string().max(200).allow("").label(Words.address),
  PostalCode: Joi.string()
    .max(10)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.postal_code),
  NationalCode: Joi.string()
    .max(10)
    .required()
    .regex(/^[0-9]+$/)
    .label(Words.national_code),
  BirthDate: Joi.string().allow("").label(Words.birth_date),
  PicFileName: Joi.string().max(50).allow("").label(Words.profile_image),
  Username: Joi.string()
    .min(8)
    .max(50)
    .required()
    .regex(/^[a-zA-Z0-9.\-()\s]+$/)
    .label(Words.username),
  Password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .regex(/^[a-zA-Z0-9-._!@#$%^&*]{7,31}$/)
    .label(Words.password),
  IsActive: Joi.boolean(),
};

const initRecord = {
  MemberID: 0,
  ProvinceID: 0,
  CityID: 0,
  GenderID: 0,
  FirstName: "",
  LastName: "",
  FixTel: "",
  Mobile: "",
  Address: "",
  PostalCode: "",
  NationalCode: "",
  BirthDate: "",
  PicFileName: "",
  Username: "",
  Password: "",
  IsActive: false,
};

const genders = [
  { GenderID: 1, GenderTitle: Words.male },
  { GenderID: 2, GenderTitle: Words.female },
];

const formRef = React.createRef();

const onUploadProgress = (progressEvent, fieldName, formConfig) => {
  const progress = Math.round(
    (progressEvent.loaded / progressEvent.total) * 100
  );

  const { fileList, setFileList } = formConfig;
  fileList[fieldName].uploadProgress = progress;

  setFileList({ ...fileList });
};

const handleUpload = async (
  fieldName,
  deleteLastFile,
  fileConfig,
  formConfig
) => {
  const { destinationFolder: category, extensions, maxFileSize } = fileConfig;
  const { fileList, setFileList, record } = formConfig;
  // const { fileList, record } = this.state;

  let result = null;

  if (fileList[fieldName]) {
    const upFileName = fileList[fieldName].name;

    const fd = new FormData();
    fd.append("dataFile", fileList[fieldName], upFileName);

    const uploadConditions = {
      category,
      extensions,
      maxFileSize,
    };

    if (deleteLastFile === true && record[fieldName].length > 0) {
      uploadConditions.deleteFileName = record[fieldName];
    }

    //---

    fileList[fieldName].uploading = true;
    setFileList({ ...fileList });

    result = await fileService.uploadFile(fd, uploadConditions, (e) =>
      onUploadProgress(e, fieldName, formConfig)
    );

    record[fieldName] = result.fileName;

    fileList[fieldName].uploading = false;

    setFileList({ ...fileList });
  }

  return result;
};

const handleSubmitWithFile = async (
  fileConfig,
  formConfig,
  selectedObject,
  onOk,
  clearRecord
) => {
  const { errors, record, fileList, setFileList, setProgress, schema } =
    formConfig;

  if (!hasFormError(errors)) {
    setProgress(true);

    try {
      for (const key in fileList) {
        await handleUpload(key, true, fileConfig, formConfig);
      }

      const rec = trimRecord(record);

      // just validate properties of record, which included in schema
      const rec_to_submit = {};
      for (const key in schema) {
        rec_to_submit[key] = rec[key];
      }

      await onOk(rec_to_submit);
      if (selectedObject === null) clearRecord();
      else {
        setFileList({});
        // setRecord(_record);
      }

      message.success(Words.messages.success_submit);
    } catch (ex) {
      handleError(ex);
    } finally {
      setProgress(false);
      // this.setState({ inProgress: false });
    }
  }
};

const MemberModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    fileList,
    setFileList,
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
    fileList,
    setFileList,
    setRecord,
    errors,
    setErrors,
    progress,
    setProgress,
  };

  const clearRecord = () => {
    record.CityID = 0;
    record.ProvinceID = 0;
    record.GenderID = 0;
    record.FirstName = "";
    record.LastName = "";
    record.FixTel = "";
    record.Mobile = "";
    record.Address = "";
    record.PostalCode = "";
    record.NationalCode = "";
    record.BirthDate = "";
    record.PicFileName = "";
    record.Username = "";
    record.Password = "";
    record.IsActive = false;

    setFileList({});
    setRecord(record);
    setSelectedProvinceID(0);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const data = await membersService.getParams();

    setProvinces(data.Provinces);
    setCities(data.Cities);

    setSelectedProvinceID(
      selectedObject !== null ? selectedObject.ProvinceID : 0
    );
  });

  useEffect(() => {
    loadFieldsValue(formRef, record);
  }, [record]);

  const handleSubmit = async () => {
    await handleSubmitWithFile(
      fileConfig,
      formConfig,
      selectedObject,
      onOk,
      clearRecord
    );
  };

  const handleSelectProvince = (value) => {
    record.CityID = 0;
    record.ProvinceID = value;
    setRecord({ ...record });
    setSelectedProvinceID(value);
  };

  const getCities = () => {
    const selectedCities = cities.filter(
      (c) => c.ProvinceID === selectedProvinceID
    );
    return selectedCities;
  };

  const handleGenerateRandomAccountInfo = () => {
    const { NationalCode } = record;

    if (NationalCode.length === 0)
      return message.error(Words.messages.no_national_code);
    else {
      const rec = { ...record };
      rec.Username = rec.NationalCode;
      rec.Password = utils.generateRandomNumericPassword(8);
      setRecord(rec);
    }
  };

  const removeProfileImage = () => {
    record.PicFileName = "";
    setRecord({ ...record });
  };

  const reloadProfileImage = () => {
    record.PicFileName = selectedObject.PicFileName;
    setRecord({ ...record });
  };

  const isEdit = selectedObject !== null;

  if (isEdit) {
    schema.Password = Joi.string()
      .min(8)
      .max(50)
      .allow("")
      .regex(/^[a-zA-Z0-9-._!@#$%^&*]{7,31}$/)
      .label(Words.password);
  }

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
            <InputItem
              title={Words.first_name}
              fieldName="FirstName"
              required
              maxLength={50}
              formConfig={formConfig}
              autoFocus
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
              title={Words.national_code}
              fieldName="NationalCode"
              maxLength={10}
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.gender}
              dataSource={genders}
              keyColumn="GenderID"
              valueColumn="GenderTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.birth_date}
              fieldName="BirthDate"
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
              required
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
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                danger
                onClick={() => handleGenerateRandomAccountInfo()}
              >
                {Words.generate_random_account_info}
              </Button>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.username}
              fieldName="Username"
              maxLength={50}
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.password}
              fieldName="Password"
              maxLength={50}
              required={!isEdit}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>

          {isEdit && (
            <>
              <Col xs={24} md={6}>
                {record.PicFileName?.length > 0 ? (
                  <Space>
                    <Avatar
                      shape="square"
                      size={60}
                      src={`${fileBasicUrl}/member-profiles/${record.PicFileName}`}
                    />

                    <Tooltip title={Words.remove_image}>
                      <Button
                        shape="circle"
                        icon={<RemoveIcon />}
                        style={{ color: Colors.red[6] }}
                        onClick={removeProfileImage}
                      />
                    </Tooltip>
                  </Space>
                ) : (
                  <Space>
                    <Avatar shape="square" size={60} icon={<UserIcon />} />

                    {selectedObject.PicFileName.length > 0 &&
                      record.PicFileName?.length === 0 && (
                        <Tooltip title={Words.reload_image}>
                          <Button
                            shape="circle"
                            icon={<ReloadIcon />}
                            style={{ color: Colors.green[6] }}
                            onClick={reloadProfileImage}
                          />
                        </Tooltip>
                      )}
                  </Space>
                )}
              </Col>

              <Col xs={24} md={18}>
                <FileItem
                  horizontal
                  // rows={3}
                  title={Words.profile_image}
                  fieldName="PicFileName"
                  formConfig={formConfig}
                  fileConfig={fileConfig}
                />
              </Col>
            </>
          )}

          {!isEdit && (
            <Col xs={24}>
              <FileItem
                horizontal
                // rows={3}
                title={Words.profile_image}
                fieldName="PicFileName"
                formConfig={formConfig}
                fileConfig={fileConfig}
              />
            </Col>
          )}

          {isEdit && (
            <>
              <Col xs={24} md={12}>
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

export default MemberModal;
