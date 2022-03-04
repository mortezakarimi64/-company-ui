import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../common/dashboard-tile";
import { FaCar as CarIcon, FaTasks as TasksIcon } from "react-icons/fa";
import {
  AiOutlineFieldTime as TimexSettingsIcon,
  AiFillBank as OrgIcon,
} from "react-icons/ai";
import Colors from "../../../resources/colors";
import modulesService from "../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (moduleID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (moduleID) {
    case 5:
      link = "org";
      icon = <OrgIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 6:
      link = "timex";
      icon = <TimexSettingsIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 7:
      link = "automation";
      icon = <TimexSettingsIcon {...iconProps} />;
      backColor = Colors.red[3];
      break;

    case 8:
      link = "transmission";
      icon = <CarIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 9:
      link = "tasks";
      icon = <TasksIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserOfficialDashboard = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const user_official_category_id = 2;
    const accessibleModules = await modulesService.accessibleModules(
      user_official_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessibleModules.map((module) => (
        <Col xs={24} md={8} lg={6} key={module.ModuleID}>
          <DashboardTile
            to={`official/${mapper(module.ModuleID).link}`}
            icon={mapper(module.ModuleID).icon}
            backColor={mapper(module.ModuleID).backColor}
            title={module.ModuleTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserOfficialDashboard;
