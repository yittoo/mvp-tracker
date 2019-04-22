import React, { Component } from "react";
import classes from "./Layout.css";
// import Ad from "../../components/Ad/Ad";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import Footer from "../../components/Footer/Footer";
import BackgroundManager from '../../components/BackgroundManager/BackgroundManager';

class Layout extends Component {
  state = {
    showSideDrawer: false,
    showSideAds: false
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
      return { ...this.state, showSideDrawer: !prevState.showSideDrawer };
    });
  };

  updateDimentions = () => {
    const sideAdsState = window.innerWidth <= 500 ? false : true;
    this.setState({
      ...this.state,
      showSideAds: sideAdsState
    });
  };

  render() {
    let isAuth = false;

    // const bottomStyle = this.state.bottomAdFixed
    //   ? { position: "fixed", bottom: "5%" }
    //   : null;

    // const contentToShow = this.state.showSideAds ? (
    //   <React.Fragment>
    //     <Ad type="horizontal" alignment="top" />
    //     <Ad type="vertical" alignment="left" />
    //     {this.props.children}
    //     <Ad type="vertical" alignment="right" />
    //     <Ad style={bottomStyle} type="horizontal" alignment="bottom" />
    //   </React.Fragment>
    // ) : (
    //   <React.Fragment>
    //     <Ad type="horizontal" alignment="top" />
    //     {this.props.children}
    //     <Ad type="horizontal" alignment="bottom" />
    //   </React.Fragment>
    // );

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
        <BackgroundManager theme={this.props.theme} />
        <div className={classes.Content}>{this.props.children}</div>
        <Footer onLegal={this.props.onLegal} />
      </div>
    );
  }
}

export default Layout;
