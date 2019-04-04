import React, { Component } from "react";
import classes from "./Layout.css";
import Ad from "../../components/Ad/Ad";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";


class Layout extends Component {
  state = {
    showSideDrawer: false,
    showSideAds: false
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  updateDimensions = () => {
    window.innerWidth <= 500
      ? this.setState({
          ...this.state,
          showSideAds: false
        })
      : this.setState({
          ...this.state,
          showSideAds: true
        });
  }

  render() {
    let isAuth = false;

    const contentToShow = this.state.showSideAds ? (
      <React.Fragment>
        <Ad type="horizontal" alignment="top" />
        <Ad type="vertical" alignment="left" />
        {this.props.children}
        <Ad type="vertical" alignment="right" />
        <Ad type="horizontal" alignment="bottom" />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Ad type="horizontal" alignment="top" />
        {this.props.children}
        <Ad type="horizontal" alignment="bottom" />
      </React.Fragment>
    );

    return (
      <div className={classes.Layout}>
        <Toolbar
          isAuth={isAuth}
          drawerToggleClicked={this.sideDrawerToggleHandler}
        />
        <SideDrawer
          isAuth={isAuth}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <div className={classes.Content}>
          {contentToShow}
        </div>
      </div>
    );
  }
}

export default Layout;
