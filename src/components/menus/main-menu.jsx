import React, { useState } from "react";
import { Menu } from "antd";
import { AiOutlineDatabase as OfficialIcon } from "react-icons/ai";
import { FiSettings as SettingsIcon } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../services/app/modules-service";
import Colors from "../../resources/colors";

const mapper = (categoryID) => {
  let link = "";
  let icon = null;

  switch (categoryID) {
    case 1:
      link = "settings";
      icon = <SettingsIcon style={{ color: Colors.grey[6] }} size={20} />;
      break;

    case 2:
      link = "official";
      icon = <OfficialIcon style={{ color: Colors.green[6] }} size={20} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const MainMenu = () => {
  const [accessibleModuleCategories, setAccessibleModuleCategories] = useState(
    []
  );

  useMount(async () => {
    const accessibleModuleCategories =
      await modulesService.accessibleModuleCategories();

    setAccessibleModuleCategories(accessibleModuleCategories);
  });

  return (
    <Menu mode="inline" theme="light">
      {accessibleModuleCategories.map((category) => (
        <Menu.Item
          key={category.CategoryID}
          icon={mapper(category.CategoryID).icon}
        >
          <Link to={`home/${mapper(category.CategoryID).link}`}>
            {category.CategoryTitle}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MainMenu;
