import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { RiOrganizationChart as OrgChartIcon } from "react-icons/ri";
import { VscUngroupByRefType as MyDutiesIcon } from "react-icons/vsc";
import { GoTasklist as MembersDutiesIcon } from "react-icons/go";
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
    case 30:
      link = "org-chart";
      icon = <OrgChartIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 31:
      link = "my-duties";
      icon = <MyDutiesIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 32:
      link = "members-duties";
      icon = <MembersDutiesIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserOrgDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const org_module_id = 5;
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

export default UserOrgDashboard;
