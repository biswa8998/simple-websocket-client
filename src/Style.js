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
  }
}));

export default AppStyles;
