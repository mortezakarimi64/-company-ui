import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { BiRepeat as RepeatIcon } from "react-icons/bi";
import { FiUserCheck as PersonCheckIcon } from "react-icons/fi";
import {
  BsUiChecks as DoneListIcon,
  BsFillPersonLinesFill as SupervisonIcon,
} from "react-icons/bs";
import { FaTags as TagsIcon, FaListUl as MyTasksIcon } from "react-icons/fa";
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
    case 76:
      link = "task-tags";
      icon = <TagsIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 77:
      link = "my-tasks";
      icon = <MyTasksIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 78:
      link = "interval-tasks";
      icon = <RepeatIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 79:
      link = "employees-tasks";
      icon = <PersonCheckIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 80:
      link = "done-tasks";
      icon = <DoneListIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 81:
      link = "task-supervisions";
      icon = <SupervisonIcon {...iconProps} />;
      backColor = Colors.red[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserTasksDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const tasks_module_id = 9;
    const accessiblePages = await modulesService.accessiblePages(
      tasks_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`tasks/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserTasksDashboard;
