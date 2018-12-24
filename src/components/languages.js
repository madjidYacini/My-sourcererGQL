import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import { GET_USER_RC } from "../models/gqlQueries";
import ChartComponent from "./chart";
import { summaryLanguages } from "../services/languages-service";
class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfCommitLanguages: null,
      languages: null,
      isReady: false,
      totalRepos: null,
      backgroundColor: []
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Query query={GET_USER_RC}>
        {({ loading, error, data }) => {
          if (loading) {
            return <span> </span>;
          }
          let repositories = data.viewer.repositories.nodes;
          let parsedDataL = summaryLanguages(repositories);

          return (
            <div className={classes.root}>
              <h1 style={{ textAlign: "center", fontFamily: "serif" }}>
                {" "}
                Languages by commits
              </h1>
              <Grid container justify="center" spacing={1}>
                <Grid item xs={6}>
                  <ChartComponent data={data} />
                </Grid>
              </Grid>
              <h2 style={{ textAlign: "center", fontFamily: "serif" }}>
                Statistics :
              </h2>
              <Grid container spacing={Number(40)} justify="center" xs={12}>
                <br />
                {parsedDataL.languages.map((language, i) => {
                  return (
                    <Grid className={classes.grid} item xs={3}>
                      <Paper className={classes.paper}>
                        <p style={{ fontFamily: "serif" }}>
                          Language : <strong>{language}</strong>
                        </p>{" "}
                      </Paper>
                      <Divider variant="middle" />
                      <Paper className={classes.paper}>
                        <p style={{ fontFamily: "serif" }}>
                          {" "}
                          commits :
                          <strong>
                            {parsedDataL.numberOfCommitLanguages[i]}
                          </strong>
                        </p>
                      </Paper>
                      <Divider variant="middle" />
                      <Paper className={classes.paper} justify="center">
                        <p style={{ fontFamily: "serif" }}>
                          line Of Code :
                          <strong>{parsedDataL.nbLineLanguage[i]}</strong>
                        </p>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          );
        }}
      </Query>
    );
  }
}
const styles = theme => ({
  root: {
    flexGrow: 2,
    backgroundColor: "#e0e1e2"
  },
  grid: {
    marginBottom: 20
  },

  Name: {
    textAlign: "left"
  },
  card: {
    minWidth: 300,
    display: "contents"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: "30%",
    color: theme.palette.text.secondary
    // marginBottom: 20
  }
});
// export default ;
export default withStyles(styles)(Languages);
