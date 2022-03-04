import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from "../components/common/protected-route";
import MainMenu from "../components/menus/main-menu";
//---
import SettingsMenu from "../components/menus/settings/settings-menu";
import AccessesMenu from "../components/menus/settings/accesses-menu";
import BasicInfoMenu from "../components/menus/settings/basic-info-menu";
import OrgMenu from "../components/menus/settings/org-menu";
import TimexMenu from "../components/menus/settings/timex-menu";
import TransmissionMenu from "../components/menus/settings/transmission-menu";
//---
import UserOfficialMenu from "../components/menus/official/user-official-menu";
import UserOrgMenu from "../components/menus/official/user-org-menu";
import UserTimexMenu from "../components/menus/official/user-timex-menu";
import UserTransmissionMenu from "../components/menus/official/user-transmission-menu";
import UserTasksMenu from "../components/menus/official/user-tasks-menu";
//---

const MenuRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/settings`}
        exact
        component={SettingsMenu}
      />
      <ProtectedRoute
        path={`${path}/settings/accesses`}
        component={AccessesMenu}
      />
      <ProtectedRoute
        path={`${path}/settings/basic-info`}
        component={BasicInfoMenu}
      />
      <ProtectedRoute path={`${path}/settings/org`} component={OrgMenu} />
      <ProtectedRoute path={`${path}/settings/timex`} component={TimexMenu} />
      <ProtectedRoute
        path={`${path}/settings/transmission`}
        component={TransmissionMenu}
      />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/official`}
        exact
        component={UserOfficialMenu}
      />
      <ProtectedRoute path={`${path}/official/org`} component={UserOrgMenu} />
      <ProtectedRoute
        path={`${path}/official/timex`}
        component={UserTimexMenu}
      />
      <ProtectedRoute
        path={`${path}/official/transmission`}
        component={UserTransmissionMenu}
      />
      <ProtectedRoute
        path={`${path}/official/tasks`}
        component={UserTasksMenu}
      />
      {/* ----------- */}

      <ProtectedRoute path={`${path}/`} exact component={MainMenu} />
    </Switch>
  );
};

export default MenuRoutes;
