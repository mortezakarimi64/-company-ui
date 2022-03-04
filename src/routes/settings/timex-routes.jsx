import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TimexDashboard from "../../components/app-modules/settings/timex/timex-dashboard";
import SecurityGuardsPage from "../../components/app-modules/settings/timex/security-guards-page";
import SecurityGuardRegedCardsPage from "../../components/app-modules/settings/timex/security-guard-reged-cards-page";
import VacationTypesPage from "../../components/app-modules/settings/timex/vacation-types-page";
import MissionTypesPage from "../../components/app-modules/settings/timex/mission-types-page";
import MissionTargetsPage from "../../components/app-modules/settings/timex/mission-targets-page";
import HolidaysPage from "../../components/app-modules/settings/timex/holidays-page";
import DepartmentExtraWorkCapacitiesPage from "../../components/app-modules/settings/timex/department-extra-work-capacities-page";
import ExtraWorkCommandSourcesPage from "../../components/app-modules/settings/timex/extra-work-command-sources-page";
import WorkShiftsPage from "../../components/app-modules/settings/timex/work-shifts-page";
import GroupShiftsPage from "../../components/app-modules/settings/timex/group-shifts-page";
import EmployeeShiftsPage from "../../components/app-modules/settings/timex/employee-shifts-page";
import RegedCardsPage from "../../components/app-modules/settings/timex/reged-cards-page";
import OfficialExpertsPage from "../../components/app-modules/settings/timex/official-experts-page";
import VacationRequestsPage from "../../components/app-modules/settings/timex/vacation-requests-page";
//---

const modulePath = "settings/timex";

const TimexRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TimexDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/security-guards`}
        exact
        render={() => <SecurityGuardsPage pageName="SecurityGuards" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/security-guard-reged-cards`}
        exact
        render={() => (
          <SecurityGuardRegedCardsPage pageName="SecurityGuardRegedCards" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vacation-types`}
        exact
        render={() => <VacationTypesPage pageName="VacationTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/mission-types`}
        exact
        render={() => <MissionTypesPage pageName="MissionTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/mission-targets`}
        exact
        render={() => <MissionTargetsPage pageName="MissionTargets" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/holidays`}
        exact
        render={() => <HolidaysPage pageName="Holidays" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/department-extra-work-capacities`}
        exact
        render={() => (
          <DepartmentExtraWorkCapacitiesPage pageName="DepartmentExtraWorkCapacities" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/extra-work-command-sources`}
        exact
        render={() => (
          <ExtraWorkCommandSourcesPage pageName="ExtraWorkCommandSources" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/work-shifts`}
        exact
        render={() => <WorkShiftsPage pageName="WorkShifts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/group-shifts`}
        exact
        render={() => <GroupShiftsPage pageName="GroupShifts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/employee-shifts`}
        exact
        render={() => <EmployeeShiftsPage pageName="EmployeeShifts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/reged-cards`}
        exact
        render={() => <RegedCardsPage pageName="RegedCards" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/official-experts`}
        exact
        render={() => <OfficialExpertsPage pageName="OfficialExperts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/vacation-requests`}
        exact
        render={() => <VacationRequestsPage pageName="VacationRequests" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default TimexRoutes;
