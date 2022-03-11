import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserTasksDashboard from "../../components/app-modules/official/tasks/user-tasks-dashboard";
import UserTaskTags from "../../components/app-modules/official/tasks/user-tags-page";
import UserMyTasksPage from "../../components/app-modules/official/tasks/user-my-tasks-page";
//---

const modulePath = "official/tasks";

const UserTasksRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserTasksDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/task-tags`}
        exact
        render={() => <UserTaskTags pageName="user-TaskTags" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/my-tasks`}
        exact
        render={() => <UserMyTasksPage pageName="user-MyTasks" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTasksRoutes;
