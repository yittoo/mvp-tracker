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
        <div className={classes.LeftColumn}>
          <p className={classes.Paragraph}>
            Currently this website consists of a MvP TimeTracker that is in beta
            testing phase. All you have to do is register with an email(used in
            case you forget your password), and that's it no activation
            required.
          </p>
          <p className={classes.Paragraph}>
            If you are a server owner and want a customized tracker for your
            players contact me on suggest@mvp-ro.com with details.
          </p>
          <p className={classes.Paragraph}>
            Our website is fully responsive so that you are capable of using
            wherever you like whether it's on laptop, tablet or phone. It always
            syncronizes itself so you are able to share it even among your guild
            mates and friends.
          </p>
          <p className={classes.Paragraph}>
            Edit your notification settings, decide whether to be warned 10
            minutes before, on minimum time or on maximum time! Save your
            settings either on account or single device. This allows different
            people using same account have custom notifications each. You can
            also choose specific MvPs that you want to recieve notifications
            from. All in click of a button in your control panel.
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
              <span className={colors.LightGray}>
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
          <p>18.04.2019 - Tombstones with maps added. If your list is among defaults, click map name then click on map to drop a tombstone. Simple as that.</p>
          <p>15.04.2019 - Two themes added, change from Control Panel. Fixed a major bug where newly created accounts' initial trackers were failed to be written to DB.</p>
          <p>13.04.2019 - Notifications (Beta) Implemented</p>
          <p>10.04.2019 - Initial (Beta) Launch</p>
          <hr />
          <h4 className={classes.MiniHeader}>Updates to come:</h4>
          <p>All around visual improvements</p>
          <p>Custom themes - including dark mode</p>
          <p>Customized server pages</p>
          <p>
            Ragnarok Online Guides{" "}
            <span className={colors.LightGray}>
              Content still not decided, if there is specific guide you'd like
              contact us
            </span>
          </p>
          <hr />
          <h4 className={classes.MiniHeader}>Known bugs:</h4>
          <p>-All known bugs have been fixed-</p>
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
