import React from "react";

import NavigationItem from "./NavigationItem/NavigationItem";
import classes from "./NavigationItems.css";
import { connect } from "react-redux";

const navigationItems = props => {
  let varNavItems = props.isAuthenticated ? (
    <React.Fragment>
      <NavigationItem link="/tracker">My Tracker</NavigationItem>
      <NavigationItem link="/logout">Logout</NavigationItem>
    </React.Fragment>
  ) : (
    <NavigationItem link="/auth">Authenticate</NavigationItem>
  );
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/">Home</NavigationItem>
      {varNavItems}
    </ul>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default connect(mapStateToProps)(navigationItems);
