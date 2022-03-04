import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { FaCar as CarIcon } from "react-icons/fa";
import {
  MdOutlineCategory as TypeIcon,
  MdOutlineBrandingWatermark as BrandIcon,
  MdModelTraining as ModelIcon,
} from "react-icons/md";
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
    case 55:
      link = "vehicle-types";
      icon = <TypeIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 56:
      link = "vehicle-brands";
      icon = <BrandIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 57:
      link = "vehicle-models";
      icon = <ModelIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 58:
      link = "vehicles";
      icon = <CarIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const TransmissionDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const transmission_module_id = 7;
    const accessiblePages = await modulesService.accessiblePages(
      transmission_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`transmission/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TransmissionDashboard;
