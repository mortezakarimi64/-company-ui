import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
import { FaCar as CarIcon } from "react-icons/fa";
import {
  MdOutlineCategory as TypeIcon,
  MdOutlineBrandingWatermark as BrandIcon,
  MdModelTraining as ModelIcon,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";
import { useLocation } from "react-router-dom";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 55:
      link = "vehicle-types";
      icon = <TypeIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 56:
      link = "vehicle-brands";
      icon = <BrandIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 57:
      link = "vehicle-models";
      icon = <ModelIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 58:
      link = "vehicles";
      icon = <CarIcon style={{ color: Colors.volcano[6] }} size={iconSize} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const TransmissionMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const transmission_module_id = 7;
    const accessiblePages = await modulesService.accessiblePages(
      transmission_module_id
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

  const transmission_module_path_name = "transmission";
  const isEndsWithModuleName = useLocation().pathname.endsWith(
    `/${transmission_module_path_name}`
  );
  const prePath = isEndsWithModuleName
    ? `${transmission_module_path_name}/`
    : "";

  return (
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
  );
};

export default TransmissionMenu;
