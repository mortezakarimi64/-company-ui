import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TransmissionDashboard from "../../components/app-modules/settings/transmission/transmission-dashboard";
import VehicleTypesPage from "../../components/app-modules/settings/transmission/vehicle-types-page";
import VehicleBrandsPage from "../../components/app-modules/settings/transmission/vehicle-brands-page";
import VehicleModelsPage from "../../components/app-modules/settings/transmission/vehicle-models-page";
import VehiclesPage from "../../components/app-modules/settings/transmission/vehicles-page";
//---

const modulePath = "settings/transmission";

const TransmissionRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TransmissionDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vehicle-types`}
        exact
        render={() => <VehicleTypesPage pageName="VehicleTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vehicle-brands`}
        exact
        render={() => <VehicleBrandsPage pageName="VehicleBrands" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vehicle-models`}
        exact
        render={() => <VehicleModelsPage pageName="VehicleModels" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vehicles`}
        exact
        render={() => <VehiclesPage pageName="Vehicles" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default TransmissionRoutes;
