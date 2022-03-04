import React from "react";
import "./styles/App.css";
import { Route, Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "./components/common/protected-route";
import LoginPage from "./pages/login-page";
import LogoutPage from "./pages/logout-page";
import HomePage from "./pages/home-page";
import InvalidAccessPage from "./pages/invalid-access-page";
import NotFoundPage from "./pages/not-found-page";
import { PageContextProvider } from "./components/contexts/page-context";
import { ModalContextProvider } from "./components/contexts/modal-context";
import composeComponents from "react-component-composer";

const Providers = composeComponents(PageContextProvider, ModalContextProvider);

const App = () => {
  return (
    <Providers>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/logout" component={LogoutPage} />
        <ProtectedRoute path="/home" component={HomePage} />
        <Redirect from="/" exact to="/home" />
        <Route from="/invalid-access" component={InvalidAccessPage} />
        <Route path="/not-found" component={NotFoundPage} />
        <Redirect to="/not-found" />
      </Switch>
    </Providers>
  );
};

export default App;
