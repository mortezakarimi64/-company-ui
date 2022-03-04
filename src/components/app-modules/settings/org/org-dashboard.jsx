import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { AiOutlineCodepen as RoleIcon } from "react-icons/ai";
import {
  FaUsers as MemberIcon,
  FaIdCard as EmployeeIcon,
  FaUsersCog as AgentIcon,
  FaTasks as RoleDutyIcon,
} from "react-icons/fa";
import { BiUnite as DepartmentIcon } from "react-icons/bi";
import {
  RiBuilding2Fill as CompanyIcon,
  RiOrganizationChart as OrgChartIcon,
} from "react-icons/ri";
import { VscUngroupByRefType as DutyLevelIcon } from "react-icons/vsc";
import { GoTasklist as PersonalDutyIcon } from "react-icons/go";
import Colors from "../../../../resources/colors";
import modulesService from "../../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (pageID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (pageID) {
    case 3:
      link = "departments";
      icon = <DepartmentIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 4:
      link = "org-chart";
      icon = <OrgChartIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 5:
      link = "roles";
      icon = <RoleIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 6:
      link = "companies";
      icon = <CompanyIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    case 7:
      link = "members";
      icon = <MemberIcon {...iconProps} />;
      backColor = Colors.magenta[6];
      break;

    case 8:
      link = "employees";
      icon = <EmployeeIcon {...iconProps} />;
      backColor = Colors.geekblue[6];
      break;

    case 9:
      link = "company-agents";
      icon = <AgentIcon {...iconProps} />;
      backColor = Colors.gold[6];
      break;

    case 10:
      link = "duty-levels";
      icon = <DutyLevelIcon {...iconProps} />;
      backColor = Colors.magenta[4];
      break;

    case 11:
      link = "personal-duties";
      icon = <PersonalDutyIcon {...iconProps} />;
      backColor = Colors.red[4];
      break;

    case 29:
      link = "role-duties";
      icon = <RoleDutyIcon {...iconProps} />;
      backColor = Colors.red[5];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const OrgDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const org_module_id = 3;
    const accessiblePages = await modulesService.accessiblePages(org_module_id);

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`org/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default OrgDashboard;
