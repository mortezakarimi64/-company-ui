import { Component } from "react";
import authService from "./../services/auth-service";

class Logout extends Component {
  componentDidMount() {
    authService.logout();

    window.location = "/login";
  }

  render() {
    return null;
  }
}

export default Logout;
