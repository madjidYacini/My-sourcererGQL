import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import AvatarComp from "./components/avatar";
import Languages from "./components/languages";
import Loader from "./components/loader";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
import Overview from "./components/overview";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: operation => {
    const { REACT_APP_GITHUB_TOKEN } = process.env;

    operation.setContext(context => ({
      headers: {
        ...context.headers,
        Authorization: `Bearer ${REACT_APP_GITHUB_TOKEN}`
      }
    }));
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTime: false
    };
  }

  scrollTo(value) {
    var offsetHeight = document.getElementById(value).clientHeight;

    if (value === "Overview") {
      window.scroll(0, offsetHeight - 450);
    } else if (value === "Avatar") {
      console.log(offsetHeight);
      window.scroll(0, offsetHeight - 100);
    } else {
      console.log(offsetHeight);
      window.scroll(0, offsetHeight + 150);
    }
  }

  render() {
    const { displayTime } = this.state;
    setTimeout(() => {
      this.setState({
        displayTime: true
      });
    }, 3000);
    if (!displayTime) {
      return (
        <ApolloProvider client={client}>
          <div className="loader" justify="center">
            <Grid container xs={6}>
              <Loader />
            </Grid>
          </div>
        </ApolloProvider>
      );
    } else {
      return (
        <ApolloProvider client={client}>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" onClick={() => this.scrollTo("Avatar")}>
                Avatar
              </Button>

              <Button color="inherit" onClick={() => this.scrollTo("Language")}>
                Language
              </Button>
              <Button color="inherit" onClick={() => this.scrollTo("Overview")}>
                Overview
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ justify: "center" }}>
            <div id="Avatar">
              {" "}
              <AvatarComp />
            </div>
            <div id="Overview" style={{ paddingTop: 20 }}>
              <Overview />
            </div>
            <div id="Language">
              {" "}
              <Languages />
            </div>

            {/* <Repositories /> */}
            {/* <div>{isReady && <Repositories />}</div> */}
          </div>
        </ApolloProvider>
      );
    }
  }
}

export default App;
