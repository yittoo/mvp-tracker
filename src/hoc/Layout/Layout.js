import React, { Component } from "react";
import classes from "./Layout.css";
import Ad from "../../components/Ad/Ad";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
  state = {
    showSideDrawer: false,
    showSideAds: false,
    bottomAdFixed: false
  };

  componentDidMount() {
    this.updateDimentions();
    window.addEventListener("resize", this.updateDimentions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimentions);
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  updateDimentions = () => {
    const sideAdsState = window.innerWidth <= 500 ? false : true;
    console.log(window.innerHeight)
    console.log(document.getElementsByTagName("body")[0].clientHeight)
    // const fixedBottomAdState =
    //   window.innerHeight - 100 <
    //   document.getElementsByTagName("body")[0].clientHeight
    //     ? false
    //     : true;
    this.setState({
      ...this.state,
      showSideAds: sideAdsState,
      bottomAdFixed: false // TODO FIX THIS
    });
  };

  render() {
    let isAuth = false;

    const bottomStyle = this.state.bottomAdFixed
      ? { position: "fixed", bottom: "5%" }
      : null;

    const contentToShow = this.state.showSideAds ? (
      <React.Fragment>
        <Ad type="horizontal" alignment="top" />
        <Ad type="vertical" alignment="left" />
        {this.props.children}
        <Ad type="vertical" alignment="right" />
        <Ad style={bottomStyle} type="horizontal" alignment="bottom" />
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
        <div className={classes.Content}>{contentToShow}</div>
        {/* footer TODO */}
      </div>
    );
  }
}

export default Layout;
