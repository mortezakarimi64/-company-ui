import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Space,
} from "antd";
import { AiFillStar as StarIcon } from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const EmployeeDetailsModal = ({ employee, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  return (
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
      width={750}
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
                message={
                  <Space>
                    <MemberProfileImage fileName={employee.PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${employee.EmployeeID} - ${employee.FirstName} ${employee.LastName}`
                      )}
                    </Text>
                  </Space>
                }
                type="info"
              />
            </Col>
            <Col xs={24}>
              <Descriptions
                bordered
                column={{
                  //   md: 2, sm: 2,
                  lg: 2,
                  md: 2,
                  xs: 1,
                }}
                size="middle"
              >
                {employee.IsDepartmentManager && (
                  <Descriptions.Item label={Words.department_manager} span={2}>
                    <StarIcon style={{ color: Colors.red[6] }} />
                  </Descriptions.Item>
                )}
                {employee.IsDepartmentSupervisor && (
                  <Descriptions.Item
                    label={Words.department_supervisor}
                    span={2}
                  >
                    <StarIcon style={{ color: Colors.yellow[6] }} />
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={Words.national_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${employee.NationalCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.mobile}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${employee.Mobile}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.department}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${employee.DepartmentTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.role}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${employee.RoleTitle}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.card_no}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${employee.CardNo}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.marriage_status}>
                  <Text style={{ color: valueColor }}>
                    {employee.IsMarried ? Words.married : Words.single}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.marriage_date}>
                  <Text style={{ color: valueColor }}>
                    {employee.IsMarried && employee.MarriageDate.length > 0
                      ? utils.farsiNum(
                          utils.slashDate(`${employee.MarriageDate}`)
                        )
                      : "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.father_name}>
                  <Text style={{ color: valueColor }}>
                    {employee.FatherName}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.personal_id}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(employee.PersonalID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.university}>
                  <Text style={{ color: valueColor }}>
                    {employee.UniversityTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.edu_level}>
                  <Text style={{ color: valueColor }}>
                    {employee.EduLevelTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.edu_field}>
                  <Text style={{ color: valueColor }}>
                    {employee.EduFieldTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.latest_edu_average}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(employee.LatestEduAverage)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.work_place}>
                  <Text style={{ color: valueColor }}>
                    {employee.WorkPlaceTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.employment_type}>
                  <Text style={{ color: valueColor }}>
                    {employee.EmploymentTypeTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.employment_status}>
                  <Text style={{ color: valueColor }}>
                    {employee.EmploymentStatusTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.employment_start_date}>
                  <Text style={{ color: valueColor }}>
                    {employee.EmploymentFinishDate.length > 0
                      ? utils.farsiNum(
                          utils.slashDate(employee.EmploymentStartDate)
                        )
                      : "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.employment_finish_date}>
                  <Text style={{ color: valueColor }}>
                    {employee.EmploymentFinishDate.length > 0
                      ? utils.farsiNum(
                          utils.slashDate(employee.EmploymentFinishDate)
                        )
                      : "-"}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default EmployeeDetailsModal;
