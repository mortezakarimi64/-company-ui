import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import modulesService from "./../services/app/modules-service";
import Colors from "./../resources/colors";
import { AiOutlineDatabase as OfficialIcon } from "react-icons/ai";
import { FiSettings as SettingsIcon } from "react-icons/fi";
import DashboardTile from "../components/common/dashboard-tile";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (categoryID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (categoryID) {
    case 1:
      link = "settings";
      icon = <SettingsIcon {...iconProps} />;
      backColor = Colors.grey[3];
      break;

    case 2:
      link = "official";
      icon = <OfficialIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const MainDashboard = () => {
  const [accessibleModuleCategories, setAccessibleModuleCategories] = useState(
    []
  );

  useMount(async () => {
    const accessibleModuleCategories =
      await modulesService.accessibleModuleCategories();

    setAccessibleModuleCategories(accessibleModuleCategories);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessibleModuleCategories.map((category) => (
        <Col xs={24} md={8} lg={6} key={category.CategoryID}>
          <DashboardTile
            to={`home/${mapper(category.CategoryID).link}`}
            icon={mapper(category.CategoryID).icon}
            backColor={mapper(category.CategoryID).backColor}
            title={category.CategoryTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default MainDashboard;
