import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import BasicInfoDashboard from "../../components/app-modules/settings/basic-info/basic-info-dashboard";
import ProvincesPage from "../../components/app-modules/settings/basic-info/provinces-page";
import CitiesPage from "../../components/app-modules/settings/basic-info/cities-page";
import EduLevelsPage from "../../components/app-modules/settings/basic-info/edu-levels-page";
import EduFieldsPage from "../../components/app-modules/settings/basic-info/edu-fields-page";
import UniversitiesPage from "../../components/app-modules/settings/basic-info/universities-page";
import EmploymentTypesPage from "../../components/app-modules/settings/basic-info/employment-types-page";
import EmploymentStatusesPage from "../../components/app-modules/settings/basic-info/employment-statuses-page";
import WorkPlacesPage from "../../components/app-modules/settings/basic-info/work-places-page";
//---

const modulePath = "settings/basic-info";

const BasicInfoRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={BasicInfoDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/provinces`}
        exact
        render={() => <ProvincesPage pageName="Provinces" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cities`}
        exact
        render={() => <CitiesPage pageName="Cities" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/edu-levels`}
        exact
        render={() => <EduLevelsPage pageName="EduLevels" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/edu-fields`}
        exact
        render={() => <EduFieldsPage pageName="EduFields" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/universities`}
        exact
        render={() => <UniversitiesPage pageName="Universities" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/employment-types`}
        exact
        render={() => <EmploymentTypesPage pageName="EmploymentTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/employment-statuses`}
        exact
        render={() => <EmploymentStatusesPage pageName="EmploymentStatuses" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/work-places`}
        exact
        render={() => <WorkPlacesPage pageName="WorkPlaces" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default BasicInfoRoutes;
