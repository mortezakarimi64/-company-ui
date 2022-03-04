import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
import { BiRepeat as RepeatIcon } from "react-icons/bi";
import { FiUserCheck as PersonCheckIcon } from "react-icons/fi";
import {
  BsUiChecks as DoneListIcon,
  BsFillPersonLinesFill as SupervisonIcon,
} from "react-icons/bs";
import { FaTags as TagsIcon, FaListUl as MyTasksIcon } from "react-icons/fa";
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
    case 76:
      link = "task-tags";
      icon = <TagsIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 77:
      link = "my-tasks";
      icon = (
        <MyTasksIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 78:
      link = "interval-tasks";
      icon = <RepeatIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 79:
      link = "employees-tasks";
      icon = (
        <PersonCheckIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 80:
      link = "done-tasks";
      icon = <DoneListIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 81:
      link = "task-supervisions";
      icon = (
        <SupervisonIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserTasksMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const tasks_module_id = 9;
    const accessiblePages = await modulesService.accessiblePages(
      tasks_module_id
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

  const tasks_module_path_name = "tasks";
  const isEndsWithModuleName = useLocation().pathname.endsWith(
    `/${tasks_module_path_name}`
  );
  const prePath = isEndsWithModuleName ? `${tasks_module_path_name}/` : "";

  return (
    <Menu mode="inline" theme="light" selectedKeys={[lastPathKey]}>
      <Menu.Item
        key="settings"
        icon={
          <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
        }
      >
        <Link to={`/home/tasks`}>{Words.official}</Link>
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

export default UserTasksMenu;
