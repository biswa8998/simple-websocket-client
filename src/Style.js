import { makeStyles } from "@material-ui/core/styles";

const AppStyles = makeStyles(theme => ({
  appTitle: {
    color: "#ff8d3a !important",
    paddingTop: 4,
    paddingLeft: 12
  },
  columnHeaderIcon: {
    float: "right",
    color: "#fff"
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#f1f1f1",
    padding: 0
  },
  listItems: {
    paddingLeft: 10,
    paddingRight: 10
  },
  listEllipsisText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  buttonDelete: {
    color: "#d44e4e"
  },
  buttonEdit: {
    color: "#409dca"
  },
  buttonConnect: {
    position: "absolute !important",
    right: 22,
    padding: "16px !important"
  },
  urlErrorText: {
    marginLeft: 20
  },
  messageItem: {
    maxWidth: "100%"
  },
  messageFontSize: {
    fontSize: 12
  },
  receivedMessage: {
    backgroundColor: "#b3dcc1",
    borderRadius: 4,
    marginBottom: 4,
    padding: 8
  },
  sentMessage: {
    backgroundColor: "#ff9c9c",
    borderRadius: 4,
    marginBottom: 4,
    padding: 8
  },
  messageHeaderIcons: {
    width: "14px !important",
    height: "18px !important",
    marginTop: -4,
    color: "black"
  }
}));

export default AppStyles;
