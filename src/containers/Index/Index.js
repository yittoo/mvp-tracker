import React from "react";
import classes from "./Index.css";
import { connect } from "react-redux";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import Spinner from "../../components/UI/Spinner/Spinner";
import colors from "../../components/UI/Colors/Colors.css";

const Index = props => {
  const dataToRender = props.authLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <HeaderBar>Welcome</HeaderBar>
      <div className={classes.Index}>
        <h1 className={classes.Header}>Hey everyone!</h1>
        <h1 style={{ display: "none" }}> TODO STYLING</h1>
        <div className={classes.LeftColumn}>
          <p className={classes.Paragraph}>
            Currently this website consists of a MvP TimeTracker that is in beta
            testing phase. More functionalities will be coming as well as other
            content.
          </p>
          <p className={classes.Paragraph}>
            Our website is fully responsive so that you are capable of using
            wherever you like whether it's on laptop, tablet or phone. It always
            syncronizes itself so you are able to share it even among your guild
            mates and friends.
          </p>
          <p className={classes.Paragraph}>
            Edit your notification settings, decide whether to be warned
            10minutes before, on minimum time or on maximum time! Save your
            settings either on account or device. This allows different people
            using same account have custom notifications each. You can also
            choose specific MvPs that you want to recieve notifications from.
            All in click of a button!
          </p>
          <p className={classes.Paragraph}>
            Please if you do find any bugs or want to advice contact us on
            suggest@mvp-ro.com
          </p>
        </div>
        <div className={classes.RightColumn}>
          <h3>Change Log:</h3>
          <hr />
          <p>10.04.2019 - Initial (open beta) launch</p>
          <hr />
          <h4>Known bugs:</h4>
          <p>
            After 1 hour into "Keep me signed in" there is a mvp update bug,
            simply refresh page if "Last Updated" passes 60seconds,
            notifications <em>should</em> still work even if the new times are
            not fetched.
          </p>
        </div>
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
