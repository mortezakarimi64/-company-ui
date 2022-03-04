import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
import UserOfficialDashboard from "../../components/app-modules/official/user-official-dashboard";
import UserOrgRoutes from "./user-org-routes";
import UserTimexRoutes from "./user-timex-routes";
import UserTransmissionRoutes from "./user-transmission-routes";
import UserTasksRoutes from "./user-tasks-routes";
//---

const UserOfficialRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/official`}
        exact
        component={UserOfficialDashboard}
      />
      <ProtectedRoute
        path={`${path}/official/org`}
        render={() => <UserOrgRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/official/timex`}
        render={() => <UserTimexRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/official/transmission`}
        render={() => <UserTransmissionRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/official/tasks`}
        render={() => <UserTasksRoutes path={path} />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserOfficialRoutes;
