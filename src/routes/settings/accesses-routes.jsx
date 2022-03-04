import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import AccessesDashboard from "../../components/app-modules/settings/accesses/accesses-dashboard";
import PageAccessesPage from "../../components/app-modules/settings/accesses/page-accesses-page";
//---

const modulePath = "settings/accesses";

const AccessesRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={AccessesDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/page-accesses`}
        exact
        render={() => <PageAccessesPage pageName="PageAccesses" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default AccessesRoutes;
