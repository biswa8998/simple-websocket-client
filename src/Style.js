import { makeStyles } from "@material-ui/core/styles";

const AppStyles = makeStyles(theme => ({
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
    position: "absolute",
    right: 23,
    padding: 16
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
    width: 14,
    height: 18,
    marginTop: -4,
    color: "black"
  }
}));

export default AppStyles;
