import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Navbar } from "react-bootstrap";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton } from "@material-ui/core";

import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";

import data from "./data";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#eb3737",
      dark: "#002884",
      contrastText: "#fff",
      hover: "#fff"
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000"
    }
  }
});

const useStyles = makeStyles(theme => ({
  columnHeaderIcon: {
    float: "right"
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
  }
}));

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Simple WebSocket Client</Navbar.Brand>
    </Navbar>
  );
}

function AppColumnHeaders(props) {
  const classes = useStyles();
  return (
    <div className="project-column-header">
      <div className="project-column-title">
        {props.title}
        <IconButton
          className={classes.columnHeaderIcon}
          disableFocusRipple
          component="span"
          size="small"
        >
          {props.icon}
        </IconButton>
      </div>
    </div>
  );
}

function AppProjects(props) {
  const classes = useStyles();
  const nProjects = props.projects.length;
  const ListOfProjects = props.projects.map((e, i) => {
    return (
      <React.Fragment key={i}>
        <ListItem
          button
          classes={{
            gutters: classes.listItems
          }}
        >
          <ListItemText
            primary={e.Name}
            classes={{
              primary: classes.listEllipsisText
            }}
            title={e.Name}
          />
          <IconButton
            className={classes.columnHeaderIcon}
            disableFocusRipple
            component="span"
            size="small"
            classes={{
              root: classes.buttonEdit
            }}
            title={`Edit ${e.Name}`}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            className={classes.columnHeaderIcon}
            disableFocusRipple
            component="span"
            size="small"
            classes={{
              root: classes.buttonDelete
            }}
            title={`Delete ${e.Name}`}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
        {nProjects - 1 === i ? null : <Divider light />}
      </React.Fragment>
    );
  });

  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Projects" icon={<RemoveIcon />} />
        <div className="project-lister">
          <List className={classes.list} aria-label="projects">
            {ListOfProjects}
          </List>
        </div>
      </div>
    </Grid>
  );
}

function AppProjectRequests() {
  const classes = useStyles();
  return (
    <Grid item lg={2} xs={12} className="app-columns">
      <div className="project-column-wrapper">
        <AppColumnHeaders title="Requests" icon={<RemoveIcon />} />
        <div className="project-lister">
          <List className={classes.list} aria-label="mailbox folders">
            <ListItem button>
              <ListItemText primary="Inbox" />
            </ListItem>
            <Divider />
            <ListItem button divider>
              <ListItemText primary="Drafts" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Trash" />
            </ListItem>
            <Divider light />
            <ListItem button>
              <ListItemText primary="Spam" />
            </ListItem>
          </List>
        </div>
      </div>
    </Grid>
  );
}

function App() {
  const [projects, setProject] = useState([]);
  const [requests, setRequests] = useState([]);

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppNavbar></AppNavbar>
        <Grid container>
          {/* List all the projects */}
          <AppProjects projects={data.App.Projects} />
          {/* List all the requests of selected project */}
          <AppProjectRequests />
          {/* Request and response */}
          <Grid item lg={8} xs={12} className="app-columns">
            <Grid className="project-column-wrapper">
              {/* <div className="project-column-header">
            <p>
              Projects
              <span>
                <i className="fas fa-minus"></i>
              </span>
            </p>
          </div> */}
              <Grid className="app-request-wrapper">
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-basic"
                    label="Websocket URL"
                    variant="outlined"
                    type="text"
                    fullWidth={true}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    classes={{ root: classes.buttonConnect }}
                  >
                    CONNECT
                  </Button>
                </Grid>
                <p className="save-this-request">
                  <Button color="primary" variant="outlined" size="small">
                    SAVE
                  </Button>
                </p>
              </Grid>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
                className="app-payload-wrapper"
              >
                <Grid container className="input-request-payload">
                  <TextField
                    id="outlined-multiline-static"
                    label="Payload"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth={true}
                  />
                  <p className="save-this-request">
                    <Button variant="contained" color="primary" size="small">
                      SEND
                    </Button>
                  </p>
                </Grid>
                <br />
                <Grid className="divider" />
                <Grid container className="input-request-payload">
                  Messages will appear here
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
