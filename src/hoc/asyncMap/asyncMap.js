import React, { Component } from "react";
import classes from "./asyncMap.css";
import Tomb from "../../components/Images/Tomb";

const asyncComponent = mapName => {
  return class extends Component {
    listenerFunc = event => {
      const ele = document.getElementById("mapImgInModal");
      if (
        ele.offsetLeft !== this.state.x ||
        ele.offsetTop !== this.state.y ||
        event.clientX !== this.state.mouseX ||
        event.clientY !== this.state.mouseY
      ) {
        this.setState({
          ...this.state,
          x: ele.offsetLeft,
          y: ele.offsetTop,
          mouseX: event.clientX,
          mouseY: event.clientY
        });
      }
    };

    constructor(props) {
      super(props);
      this.state = {};
      window.addEventListener("mousemove", this.listenerFunc);
    }

    writeToState(url) {
      this.setState({
        ...this.state,
        url: url
      });
    }

    componentWillMount() {
      setTimeout(() => {
        const ele = document.getElementById("mapImgInModal");
        this.setState({
          ...this.state,
          x: ele.offsetLeft,
          y: ele.offsetTop
        });
      }, 310);
    }

    componentWillUnmount() {
      window.removeEventListener("mousemove", this.listenerFunc);
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState !== this.state && this.state.x) {
        this.props.onCoordChange(
          this.state.x,
          this.state.y,
          this.state.mouseX,
          this.state.mouseY
        );
      }
    }

    componentDidMount() {
      switch (mapName) {
        case "abbey02":
          return this.writeToState("https://i.postimg.cc/dVH1FW5K/abbey02.gif");
        case "abyss_03":
          return this.writeToState(
            "https://i.postimg.cc/hGXGt9YQ/abyss-03.gif"
          );
        case "ama_dun03":
          return this.writeToState(
            "https://i.postimg.cc/1zb3n8xC/ama-dun03.gif"
          );
        case "anthell02":
          return this.writeToState(
            "https://i.postimg.cc/85WPhTN1/anthell02.gif"
          );
        case "ayo_dun02":
          return this.writeToState(
            "https://i.postimg.cc/d3jsxnhp/ayo-dun02.gif"
          );
        case "beach_dun":
          return this.writeToState(
            "https://i.postimg.cc/sfYgxfTm/beach-dun.gif"
          );
        case "bra_dun02":
          return this.writeToState(
            "https://i.postimg.cc/L5p4DG8j/bra-dun02.gif"
          );
        case "c_tower3_":
          return this.writeToState(
            "https://i.postimg.cc/NG892kdW/c-tower3.gif"
          );
        case "dew_dun01":
          return this.writeToState(
            "https://i.postimg.cc/CLJMCPTf/dew-dun01.gif"
          );
        case "dic_dun02":
          return this.writeToState(
            "https://i.postimg.cc/htjD2LcZ/dic-dun02.gif"
          );
        case "dic_dun03":
          return this.writeToState(
            "https://i.postimg.cc/28C8ZpJD/dic-dun03.gif"
          );
        case "ein_dun02":
          return this.writeToState(
            "https://i.postimg.cc/Z5MT2Wqb/ein-dun02.gif"
          );
        case "gef_dun01":
          return this.writeToState(
            "https://i.postimg.cc/25LzDCq4/gef-dun01.gif"
          );
        case "gef_dun02":
          return this.writeToState(
            "https://i.postimg.cc/LXdm4GfG/gef-dun02.gif"
          );
        case "gef_fild02":
          return this.writeToState(
            "https://i.postimg.cc/cL2STPD6/gef-fild02.gif"
          );
        case "gef_fild03":
          return this.writeToState(
            "https://i.postimg.cc/LsZh9tqQ/gef-fild03.gif"
          );
        case "gef_fild10":
          return this.writeToState(
            "https://i.postimg.cc/Dw8hr7Pt/gef-fild10.gif"
          );
        case "gef_fild14":
          return this.writeToState(
            "https://i.postimg.cc/c4DZtvwR/gef-fild14.gif"
          );
        case "gl_cas02_":
          return this.writeToState(
            "https://i.postimg.cc/3JnknJ51/gl-cas02.gif"
          );
        case "gld2_ald":
          return this.writeToState(
            "https://i.postimg.cc/cHMGxCd8/gld2-ald.gif"
          );
        case "gld2_gef":
          return this.writeToState(
            "https://i.postimg.cc/VLHQL3P4/gld2-gef.gif"
          );
        case "gld2_pay":
          return this.writeToState(
            "https://i.postimg.cc/cLgqKXsW/gld2-pay.gif"
          );
        case "gld2_prt":
          return this.writeToState(
            "https://i.postimg.cc/xj5VBXsw/gld2-prt.gif"
          );
        case "gld_dun01":
          return this.writeToState(
            "https://i.postimg.cc/x8nYMH6R/gld-dun01.gif"
          );
        case "gld_dun01_2":
          return this.writeToState(
            "https://i.postimg.cc/025PNYM5/gld-dun01-2.gif"
          );
        case "gld_dun02":
          return this.writeToState(
            "https://i.postimg.cc/QNJjs4Mn/gld-dun02.gif"
          );
        case "gld_dun02_2":
          return this.writeToState(
            "https://i.postimg.cc/d36FB1XK/gld-dun02-2.gif"
          );
        case "gld_dun03":
          return this.writeToState(
            "https://i.postimg.cc/zfh1QpM7/gld-dun03.gif"
          );
        case "gld_dun03_2":
          return this.writeToState(
            "https://i.postimg.cc/B6GGfHf0/gld-dun03-2.gif"
          );
        case "gld_dun04":
          return this.writeToState(
            "https://i.postimg.cc/Hn6GMNcY/gld-dun04.gif"
          );
        case "gld_dun04_02":
          return this.writeToState(
            "https://i.postimg.cc/BbS9X3v7/gld-dun04-2.gif"
          );
        case "gl_chyard":
          return this.writeToState(
            "https://i.postimg.cc/W3MTdSwz/gl-chyard.gif"
          );
        case "gon_dun03":
          return this.writeToState(
            "https://i.postimg.cc/c4JGWd2r/gon-dun03.gif"
          );
        case "in_sphinx5":
          return this.writeToState(
            "https://i.postimg.cc/52Zh8L0C/in-sphinx5.gif"
          );
        case "iz_dun05":
          return this.writeToState(
            "https://i.postimg.cc/g08fsjXB/iz-dun05.gif"
          );
        case "jupe_core":
          return this.writeToState(
            "https://i.postimg.cc/4dGjSGp4/jupe-core.gif"
          );
        case "kh_dun02":
          return this.writeToState(
            "https://i.postimg.cc/3RZzMqZX/kh-dun02.gif"
          );
        case "lhz_dun02":
          return this.writeToState(
            "https://i.postimg.cc/PJr9dM6B/lhz-dun02.gif"
          );
        case "lhz_dun03":
          return this.writeToState(
            "https://i.postimg.cc/7PmjmphD/lhz-dun03.gif"
          );
        case "lhz_dun04":
          return this.writeToState(
            "https://i.postimg.cc/L65w7NgP/lhz-dun04.gif"
          );
        case "lou_dun03":
          return this.writeToState(
            "https://i.postimg.cc/cC9jC826/lou-dun03.gif"
          );
        case "mjolnir_04":
          return this.writeToState(
            "https://i.postimg.cc/hGL5xY6k/mjolnir-04.gif"
          );
        case "moc_fild17":
          return this.writeToState(
            "https://i.postimg.cc/mDVppHbV/moc-fild17.gif"
          );
        case "moc_fild22":
          return this.writeToState(
            "https://i.postimg.cc/cHd5cmNr/moc-fild22.gif"
          );
        case "moc_pryd04":
          return this.writeToState(
            "https://i.postimg.cc/RVYyzKwD/moc-pryd04.gif"
          );
        case "moc_pryd06":
          return this.writeToState(
            "https://i.postimg.cc/Z5ygYncK/moc-pryd06.gif"
          );
        case "moc_prydn2":
          return this.writeToState(
            "https://i.postimg.cc/HLDNrmZ0/moc-prydn2.gif"
          );
        case "mosk_dun03":
          return this.writeToState(
            "https://i.postimg.cc/90n8CHw7/mosk-dun03.gif"
          );
        case "niflheim":
          return this.writeToState(
            "https://i.postimg.cc/7PsQg0tZ/niflheim.gif"
          );
        case "odin_tem03":
          return this.writeToState(
            "https://i.postimg.cc/vTBqJZTy/odin-tem03.gif"
          );
        case "pay_dun04":
          return this.writeToState(
            "https://i.postimg.cc/sDMHKxb9/pay-dun04.gif"
          );
        case "pay_fild11":
          return this.writeToState(
            "https://i.postimg.cc/bvh6zTr3/pay-fild11.gif"
          );
        case "prt_maze03":
          return this.writeToState(
            "https://i.postimg.cc/8zWKQ3p7/prt-maze03.gif"
          );
        case "prt_sewb4":
          return this.writeToState(
            "https://i.postimg.cc/gk1S7dW9/prt-sewb4.gif"
          );
        case "ra_fild02":
          return this.writeToState(
            "https://i.postimg.cc/qRBjKv8K/ra-fild02.gif"
          );
        case "ra_fild03":
          return this.writeToState(
            "https://i.postimg.cc/zBZvVyKz/ra-fild03.gif"
          );
        case "ra_fild04":
          return this.writeToState(
            "https://i.postimg.cc/52r6W7tF/ra-fild04.gif"
          );
        case "ra_san05":
          return this.writeToState(
            "https://i.postimg.cc/TPJthDWG/ra-san05.gif"
          );
        case "thana_boss":
          return this.writeToState(
            "https://i.postimg.cc/8cG7n7zK/thana-boss.gif"
          );
        case "thor_v03":
          return this.writeToState(
            "https://i.postimg.cc/3RL9FQBc/thor-v03.gif"
          );
        case "treasure02":
          return this.writeToState(
            "https://i.postimg.cc/RhNdPppV/treasure02.gif"
          );
        case "tur_dun04":
          return this.writeToState(
            "https://i.postimg.cc/j2mXB6B6/tur-dun04.gif"
          );
        case "ve_fild01":
          return this.writeToState(
            "https://i.postimg.cc/xTNgM7b6/ve-fild01.gif"
          );
        case "ve_fild02":
          return this.writeToState(
            "https://i.postimg.cc/kgrsccQq/ve-fild02.gif"
          );
        case "xmas_dun02":
          return this.writeToState(
            "https://i.postimg.cc/gcTNwdrw/xmas-dun02.gif"
          );
        case "xmas_fild01":
          return this.writeToState(
            "https://i.postimg.cc/FHjZnLpc/xmas-fild01.gif"
          );
        default:
          return this.writeToState(
            "https://i.postimg.cc/nz0jsHkC/mapnotfound.gif"
          );
      }
    }

    render() {
      const url = this.state.url;
      const TombToRender = url ? (
        <Tomb
          x={
            this.props.tombCoordinates ? this.props.tombCoordinates.tombX : 142
          }
          y={
            this.props.tombCoordinates ? this.props.tombCoordinates.tombY : -500
          }
        />
      ) : null;
      return url ? (
        <React.Fragment>
          <img
            className={classes.AsyncMap}
            id={this.props.id}
            src={this.state.url}
            alt="map picture"
            onClick={this.props.onSaveTomb}
          />
          {TombToRender}
        </React.Fragment>
      ) : null;
    }
  };
};

export default asyncComponent;
