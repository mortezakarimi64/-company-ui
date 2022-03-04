import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
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
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "./../../../resources/colors";
import Words from "./../../../resources/words";
import { useLocation } from "react-router-dom";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 1:
      link = "provinces";
      icon = <MapIcon style={{ color: Colors.red[6] }} size={iconSize} />;
      break;

    case 2:
      link = "cities";
      icon = <CityIcon style={{ color: Colors.cyan[7] }} size={iconSize} />;
      break;

    case 33:
      link = "edu-levels";
      icon = (
        <EduLevelIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 34:
      link = "edu-fields";
      icon = (
        <EduFieldIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 35:
      link = "universities";
      icon = (
        <UniversityIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 36:
      link = "employment-types";
      icon = (
        <EmploymentTypeIcon
          style={{ color: Colors.volcano[6] }}
          size={iconSize}
        />
      );
      break;

    case 37:
      link = "employment-statuses";
      icon = (
        <EmploymentStatusIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 38:
      link = "work-places";
      icon = (
        <WorkPlaceIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const BasicInfoMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const basic_info_module_id = 2;
    const accessiblePages = await modulesService.accessiblePages(
      basic_info_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
      .replace("-", "")
      .toLocaleLowerCase();
    setLastPathKey(_lastPathKey);
  }, [currentLocation.pathname]);

  const basic_info_module_path_name = "basic-info";
  const isEndsWithModuleName = useLocation().pathname.endsWith(
    `/${basic_info_module_path_name}`
  );
  const prePath = isEndsWithModuleName ? `${basic_info_module_path_name}/` : "";

  return (
    <>
      <Menu mode="inline" theme="light" selectedKeys={[lastPathKey]}>
        <Menu.Item
          key="settings"
          icon={
            <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
          }
        >
          <Link to={`/home/settings`}>{Words.admin_panel}</Link>
        </Menu.Item>
        <Menu.Divider />
        {accessiblePages.map((page) => (
          <Menu.Item
            key={page.PageName.replace("-", "").toLocaleLowerCase()}
            icon={mapper(page.PageID).icon}
          >
            <Link to={`${prePath}${mapper(page.PageID).link}`}>
              {page.PageTitle}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default BasicInfoMenu;
