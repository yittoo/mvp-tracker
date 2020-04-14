import React from "react";
import classes from "./Index.css";
import { connect } from "react-redux";
import HeaderBar from "../../components/UI/HeaderBar/HeaderBar";
import Spinner from "../../components/UI/Spinner/Spinner";
import colors from "../../components/UI/Colors/Colors.css";

const Index = (props) => {
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
            <span className={classes.Announcement}>Announcement:</span> I hope
            everyone is safe from Covid-19. I am glad that the usage of this
            site I made going up even though it is for a sad reason which is the
            lockdown. I try to focus on the positive which is people like what I
            built. We have alot of users using this tracker now especially this
            month that I have to disable the auto updater that syncronizes every
            60 second with what your guildies might have done. I'm doing this
            because the traffic increased <strong>4 times this month</strong>{" "}
            and I do not want to spend alot of money for server costs. I hope
            you guys are safe and well, I'm not expecting an outage in this site
            but if it does, it is because the limit we have is reached. It will
            reset 1st of May. I'm sorry I had to cut the autoupdate feature, I'm
            also working full time so will try to make time to optimize network
            usage next month and enable it again. If you want to force refresh
            the MvP timers on tracker you can always refresh the page.
          </p>
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
          {/* <p className={classes.Paragraph}>
            Like my work and want to support me? (Server costs are next to
            nothing so, it is not necessary to keep this site running. But being
            supported really feels appreciated.)
            <br />
            <a
              className={classes["bmc-button"]}
              target="_blank"
              href="https://www.buymeacoffee.com/yigitsozer"
              rel="noopener noreferrer"
            >
              <span style={{ marginRight: 5 }}>Buy me a</span>
              <img
                src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                alt="Buy me a coffee"
              />
            </a>
          </p> */}
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
            14.04.2020 - Removed auto updator due to high traffic that recently
            begun to happen due to Covid quarentene.
          </p>
          <p>
            21.05.2019 - Performance improvements. Should run better on older
            smartphones. Other minor update.
          </p>
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

const mapStateToProps = (state) => {
  return {
    authLoading: state.auth.loading,
  };
};

export default connect(mapStateToProps)(Index);
