import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import AvatarComp from "./components/avatar";
import Languages from "./components/languages";
// import Repositories from "./views/repositories";
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
      data: {},
      isReady: false
    };
  }
  componentDidMount() {
    client
      .query({
        query: gql`
          query {
            viewer {
              avatarUrl
              login
              createdAt

              repositories(first: 50, isFork: false) {
                totalCount
                nodes {
                  nameWithOwner
                  name
                  url
                  primaryLanguage {
                    name
                    color
                  }
                  languages(last: 5) {
                    nodes {
                      name
                    }
                  }
                  collaborators(first: 10, affiliation: ALL) {
                    totalCount
                    edges {
                      permission
                      node {
                        id
                        login
                        name
                      }
                    }
                  }
                  ref(qualifiedName: "master") {
                    target {
                      ... on Commit {
                        history {
                          totalCount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
      })
      .then(result => {
        this.setState({ data: result.data.viewer, isReady: true });
      });
    // console.log(result.data);
  }

  render() {
    const { data, isReady } = this.state;
    return (
      <ApolloProvider client={client}>
        <div style={{ justify: "center" }}>
          <div className="App">{isReady && <AvatarComp data={data} />}</div>
          <div>{isReady && <Languages />}</div>
          <div style={{ paddingTop: 20 }}>{isReady && <Overview />}</div>

          {/* <div>{isReady && <Repositories />}</div> */}
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
