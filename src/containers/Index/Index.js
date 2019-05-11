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
      <HeaderBar marginTop>Welcome</HeaderBar>
      <div className={classes.Index}>
        <h1 className={classes.Header}>MvP RO Tracker</h1>
        <h2 className={classes.Header}>
          A boss time tracker for Ragnarok Online
        </h2>
        <div className={classes.LeftColumn}>
          <p className={classes.Paragraph}>
            Currently this website consists of a MvP tracker for Ragnarok
            Online. All you have to do is register with an email(used in case
            you forget your password), and that's it no activation required.
          </p>
          <p className={classes.Paragraph}>
            Our website is fully responsive so that you are capable of using
            wherever you like whether it's on laptop, tablet or phone. It always
            syncronizes itself so you are able to share it even among your guild
            mates and friends. It keeps track of last 100 actions with your
            given nickname.
          </p>
          <p className={classes.Paragraph}>
            Edit your notification settings, decide whether to be warned 10
            minutes before, on minimum time or on maximum time! Save your
            settings either on account or single device. This allows different
            people using same account have custom notifications each. You can
            also choose specific MvPs that you want to recieve notifications
            from. All in click of a button in your control panel.
          </p>
          <p className={classes.Paragraph}>
            Like my work and want to support me? (Server costs are next to
            nothing so, it is not necessary to keep this site running. But being
            supported really feels appreciated.)
            <br />
            <a
              className={classes["bmc-button"]}
              target="_blank"
              href="https://www.buymeacoffee.com/yigitsozer"
            >
              <span style={{ marginRight: 5 }}>Buy me a</span>
              <img
                src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                alt="Buy me a coffee"
              />
            </a>
          </p>

          <div className={classes.HeadBanner}>
            <img
              src="https://i.postimg.cc/ZRdhpDVZ/detaletrans.png"
              alt="detale site banner"
            />
          </div>
          <h4 className={classes.MiniHeader}>Default notification settings:</h4>
          <ul>
            <li>
              Play notification sound enabled{" "}
              <span className={colors.Gray}>
                (Volume level adjustable at control panel)
              </span>
            </li>
            <li>
              It will warn you on minimum time, but you need to enable
              notification on maximum time and 10 minutes till minimum spawn if
              you want to.
            </li>
            <li>It will notificate on all MvPs</li>
          </ul>
          <p className={classes.Paragraph}>
            Please if you do find any bugs or want to advice contact us on
            suggest@mvp-ro.com
          </p>
        </div>
        <div className={classes.RightColumn}>
          <h3 className={classes.MiniHeader}>Change Log:</h3>
          <hr />
          <p>
            11.05.2019 - With the feedback, the way MvPs are ordered got changed
            a little bit. Some other minor improvements added.
          </p>
          <p>
            04.05.2019 - Full release, We are officially out of beta. Thanks for
            all the feedback, we are little over 100 users and keep growing
            every day.
          </p>
          <p>10.04.2019 - Initial (Beta) Launch</p>
          <hr />
          <h4 className={classes.MiniHeader}>Known issues:</h4>
          <p>All known issues are fixed.</p>
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
