import React, { useState } from "react";
import { useMount } from "react-use";
import { Button, Modal, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import departmentsService from "../../../../services/settings/org/departments-service";
import DetailsTable from "../../../common/details-table";
import { AiOutlineCheck as CheckIcon } from "react-icons/ai";
import { getSorter } from "../../../../tools/form-manager";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const columns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "EmployeeID",
    render: (EmployeeID) => <Text>{utils.farsiNum(`${EmployeeID}`)}</Text>,
  },
  {
    title: "",
    width: 75,
    align: "center",
    dataIndex: "PicFileName",
    render: (PicFileName) => <MemberProfileImage fileName={PicFileName} />,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    ellipsis: true,
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
  {
    title: Words.role,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "RoleTitle",
    sorter: getSorter("RoleTitle"),
    render: (RoleTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>{RoleTitle}</Text>
    ),
  },
  {
    title: Words.department_manager,
    width: 120,
    align: "center",
    ellipsis: true,
    sorter: getSorter("IsDepartmentManager"),
    render: (record) =>
      record.IsDepartmentManager && (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ),
  },
];

const DepartmentMembersModal = ({
  departmentID,
  departmentTitle,
  isOpen,
  onOk,
}) => {
  const [members, setMembers] = useState([]);

  useMount(async () => {
    const data = await departmentsService.getEmployees(departmentID);

    setMembers(data);
  });

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={departmentTitle}
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
              <DetailsTable records={members} columns={columns} />
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default DepartmentMembersModal;
