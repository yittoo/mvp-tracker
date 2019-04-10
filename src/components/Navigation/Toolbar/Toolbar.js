import React from "react";

import classes from "./Toolbar.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";
import { Link } from "react-router-dom";
import colors from '../../UI/Colors/Colors.css';

const toolbar = props => {
  return (
    <header className={classes.Toolbar + " " + colors.BlueWhiteBackground}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Logo}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAuthenticated={false} />
      </nav>
    </header>
  );
};

export default toolbar;
