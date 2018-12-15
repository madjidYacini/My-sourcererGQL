import React, { Component } from "react";

import Chart from "chart.js";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import { GET_USER_RC } from "../models/gqlQueries";

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
            return <span>WAIT</span>;
          }

          let repositories = data.viewer.repositories.nodes;
          let languages = [];
          let numberOfCommitLanguages = [];
          let color = [];
          let nbLineLanguage = [];
          repositories.map(oneRepos => {
            if (!_.includes(languages, oneRepos.primaryLanguage.name)) {
              languages.push(oneRepos.primaryLanguage.name);
              numberOfCommitLanguages.push(
                oneRepos.ref.target.history.totalCount
              );
              color.push(oneRepos.primaryLanguage.color);
              let nbLine = oneRepos.defaultBranchRef.target.history.nodes;
              let ress = 0;
              nbLine.map(element => {
                let diff = element.additions - element.deletions;
                ress = ress + diff;
              });

              nbLineLanguage.push(ress);
            } else {
              let id = languages.indexOf(`${oneRepos.primaryLanguage.name}`);
              numberOfCommitLanguages[id] =
                numberOfCommitLanguages[id] +
                oneRepos.ref.target.history.totalCount;
              let nbLine = oneRepos.defaultBranchRef.target.history.nodes;
              let ress = 0;
              nbLine.map(element => {
                let diff = element.additions - element.deletions;
                ress = ress + diff;
              });

              nbLineLanguage[id] = nbLineLanguage[id] + ress;
            }
          });

          setTimeout(function() {
            new Chart(document.getElementById("pie-chart"), {
              type: "pie",
              data: {
                labels: languages,
                datasets: [
                  {
                    label: "languages (commits)",
                    backgroundColor: color,
                    data: numberOfCommitLanguages
                  }
                ]
              },
              options: {
                title: {
                  display: false,
                  text: "languages by commits"
                }
              }
            });
          }, 200);

          return (
            <div className={classes.root} styles={{}}>
              <h1> Languages by commits</h1>
              {/* <Card className={classes.card}> */}
              <Grid container justify="center" spacing={1}>
                <Grid item xs={6}>
                  <canvas id="pie-chart" width="300" height="150" />
                </Grid>
              </Grid>
              <h5 style={{ textAlign: "left" }}>
                repos:{this.state.totalRepos}
              </h5>
              <Grid container spacing={Number(40)} justify="center" xs={12}>
                <br />
                {languages.map((language, i) => {
                  return (
                    <Grid className={classes.grid} item xs={3}>
                      <Paper className={classes.paper}>
                        Language : <strong>{language}</strong>
                      </Paper>
                      <Divider variant="middle" />
                      <Paper className={classes.paper}>
                        commits : <strong>{numberOfCommitLanguages[i]}</strong>
                      </Paper>
                      <Divider variant="middle" />
                      <Paper className={classes.paper} justify="center">
                        line Of Code : <strong>{nbLineLanguage[i]}</strong>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
              {/* </Card> */}
            </div>
          );
        }}
      </Query>
    );
  }

  //   render() {

  //     const { classes } = this.props;
  //     const { isReady, languages, numberOfCommitLanguages } = this.state;
  //     return (
  //       <div className={classes.root} styles={{}}>
  //         <h1> Languages by commits</h1>
  //         {/* <Card className={classes.card}> */}
  //         <Grid container justify="center" spacing={1}>
  //           <Grid item xs={6}>
  //             <canvas id="pie-chart" width="300" height="150" />
  //           </Grid>
  //         </Grid>
  //         <h5 style={{ textAlign: "left" }}>repos:{this.state.totalRepos}</h5>
  //         <Grid container spacing={Number(40)} justify="center" xs={12}>
  //           <br />
  //           {isReady &&
  //             languages.map((language, i) => {
  //               return (
  //                 <Grid
  //                   className={classes.grid}
  //                   styles={{ color: "red" }}
  //                   item
  //                   xs={2}
  //                 >
  //                   <Paper className={classes.paper}>{language}</Paper>
  //                   <Divider variant="middle" />
  //                   <Paper className={classes.paper}>
  //                     commits :{numberOfCommitLanguages[i]}
  //                   </Paper>
  //                 </Grid>
  //               );
  //             })}
  //         </Grid>
  //         {/* </Card> */}
  //       </div>
  //     );
  //   }
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
