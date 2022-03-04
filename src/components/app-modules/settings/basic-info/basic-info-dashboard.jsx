import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import {
  FaMapMarkerAlt as MapIcon,
  FaUniversity as UniversityIcon,
} from "react-icons/fa";
import { GiModernCity as CityIcon } from "react-icons/gi";
import {
  MdCastForEducation as EduLevelIcon,
  MdMergeType as EmploymentTypeIcon,
  MdOutlineModelTraining as EmploymentStatusIcon,
} from "react-icons/md";
import { BiSelectMultiple as EduFieldIcon } from "react-icons/bi";
import { HiOutlineOfficeBuilding as WorkPlaceIcon } from "react-icons/hi";
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
    case 1:
      link = "provinces";
      icon = <MapIcon {...iconProps} />;
      backColor = Colors.red[3];
      break;

    case 2:
      link = "cities";
      icon = <CityIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 33:
      link = "edu-levels";
      icon = <EduLevelIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 34:
      link = "edu-fields";
      icon = <EduFieldIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 35:
      link = "universities";
      icon = <UniversityIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 36:
      link = "employment-types";
      icon = <EmploymentTypeIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    case 37:
      link = "employment-statuses";
      icon = <EmploymentStatusIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 38:
      link = "work-places";
      icon = <WorkPlaceIcon {...iconProps} />;
      backColor = Colors.geekblue[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const BasicInfoDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const basic_info_module_id = 2;
    const accessiblePages = await modulesService.accessiblePages(
      basic_info_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`basic-info/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default BasicInfoDashboard;
