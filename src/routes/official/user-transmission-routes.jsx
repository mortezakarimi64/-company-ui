import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserTransmissionDashboard from "../../components/app-modules/official/transmission/user-transmission-dashboard";
import UserTransmissionRequestsPage from "../../components/app-modules/official/transmission/user-transmission-requests-page";
//---

const modulePath = "official/transmission";

const UserTransmissionRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserTransmissionDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/transmission-requests`}
        exact
        render={() => (
          <UserTransmissionRequestsPage pageName="user-TransmissionRequests" />
        )}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTransmissionRoutes;
