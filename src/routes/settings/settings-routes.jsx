import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
import SettingsDashboard from "../../components/app-modules/settings/settings-dashboard";
//---
import AccessesRoutes from "./accesses-routes";
import BasicInfoRoutes from "./basic-info-routes";
import OrgRoutes from "./org-routes";
import TimexRoutes from "./timex-routes";
import TransmissionRoutes from "./transmission-routes";
//---

const SettingsRoute = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/settings`}
        exact
        component={SettingsDashboard}
      />
      <ProtectedRoute
        path={`${path}/settings/accesses`}
        render={() => <AccessesRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/settings/basic-info`}
        render={() => <BasicInfoRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/settings/org`}
        render={() => <OrgRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/settings/timex`}
        render={() => <TimexRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/settings/transmission`}
        render={() => <TransmissionRoutes path={path} />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default SettingsRoute;
