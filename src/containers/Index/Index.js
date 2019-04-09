import React from "react";
import classes from "./Index.css";
import { connect } from "react-redux";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import Spinner from "../../components/UI/Spinner/Spinner";
import colors from '../../components/UI/Colors/Colors.css'

const Index = props => {
  const dataToRender = props.authLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <HeaderBar>Welcome</HeaderBar>
      <div className={classes.Index}>
        <h1 style={{ display: "none" }}> TODO STYLING</h1>
        <h1 className={classes.Header}>Hey everyone!<span className={colors.LightGray}>I know index page right now is ugly but functionality is all set!</span></h1>
        <p className={classes.Paragraph}>
          Currently this website consists of a MvP TimeTracker that is in alpha
          testing phase. More functionalities will be coming, entirity of
          service will be free with Ads or membership with Ads removed. You, me
          and every other person on street hate ads I know but it is necessary
          to provide such free content for precompile, so because of that I hope
          you disable your adblocker. I promise I'll not pop them up in your
          screen and keep them on sides.
        </p>
        <p className={classes.Paragraph}>
          Our website is fully responsive so that you are capable of using
          wherever you like whether it's on laptop, tablet or phone. It always
          syncronizes itself so you are able to share it even among your
          guildmates.
        </p>
        <p className={classes.Paragraph}>
          Please if you do find any bugs or want to advice contact us on
          suggest@mvp-ro.com
        </p>
      </div>
    </React.Fragment>
  );
  return <React.Fragment>{dataToRender}</React.Fragment>;
};

const mapStateToProps = state => {
  return {
    authLoading: state.auth.loading
  };
};

export default connect(mapStateToProps)(Index);
