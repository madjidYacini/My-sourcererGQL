import React, { Component } from "react";
import { Query } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import { Card } from "antd";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { GET_USER_INFO } from "../models/gqlQueries";

class AvatarComp extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Query query={GET_USER_INFO}>
        {({ loading, error, data }) => {
          if (loading) {
            return <span> </span>;
          }
          const avatar = data.viewer.avatarUrl;
          const followers = data.viewer.followers.totalCount;
          const following = data.viewer.following.totalCount;
          const repositories = data.viewer.repositories.nodes;
          const totalRepos = data.viewer.repositories.nodes.length;
          const login = data.viewer.login;
          let nbOfCommits = 0;
          let lineOfCode = 0;
          for (let oneRepo of repositories) {
            let lOC = oneRepo.defaultBranchRef.target.history.nodes;
            for (let line of lOC) {
              let diff = line.additions - line.deletions;
              lineOfCode = lineOfCode + diff;
            }
            nbOfCommits = nbOfCommits + oneRepo.ref.target.history.totalCount;
          }
          return (
            <Card
              className={styles.numberCard}
              bordered={false}
              bodyStyle={{ padding: 10 }}
              style={{ backgroundColor: "#e3f9f4" }}
            >
              <div className={styles.content}>
                <Grid container spacing={24} style={{ marginBottom: "40px" }}>
                  <Grid item xs={12} justify="center" className={classes.Name}>
                    <h1
                      style={{
                        textAlign: "center",
                        fontFamily: "serif",
                        marginBottom: "20px"
                      }}
                    >
                      Profile
                    </h1>

                    <h2
                      className={styles.title}
                      style={{ textAlign: "center", fontFamily: "serif" }}
                    >
                      {login}
                    </h2>
                  </Grid>

                  <Grid item xs={2}>
                    <Avatar
                      justify="left"
                      alt="Remy Sharp"
                      src={avatar}
                      className={classes.bigAvatar}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Paper
                      className={classes.paper}
                      styles={{ marginLeft: 20 }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontFamily: "serif"
                        }}
                      >
                        repos:
                      </p>

                      <p className={styles.title}> {totalRepos}</p>
                    </Paper>
                  </Grid>
                  <Grid item xs={2} off>
                    <Paper className={classes.paper}>
                      <p style={{ textAlign: "center", fontFamily: "serif" }}>
                        commits:
                      </p>{" "}
                      <p className={styles.title}> {nbOfCommits}</p>
                    </Paper>
                  </Grid>
                  <Grid item xs={2}>
                    <Paper
                      className={classes.paper}
                      styles={{ marginLeft: 20 }}
                    >
                      <p style={{ textAlign: "center", fontFamily: "serif" }}>
                        line Of Code:
                      </p>{" "}
                      <p className={styles.title}> {lineOfCode}</p>
                    </Paper>
                  </Grid>
                  <Grid item xs={2} off>
                    <Paper className={classes.paper}>
                      <p
                        style={{
                          textAlign: "center",
                          fontFamily: "serif"
                        }}
                      >
                        {" "}
                        followers:
                      </p>{" "}
                      <p className={styles.title}> {followers}</p>
                    </Paper>
                  </Grid>
                  <Grid item xs={2} off>
                    <Paper className={classes.paper}>
                      <p
                        style={{
                          textAlign: "center",
                          fontFamily: "serif"
                        }}
                      >
                        following:{" "}
                      </p>

                      <p className={styles.title}> {following} </p>
                    </Paper>
                  </Grid>
                </Grid>
              </div>
            </Card>
          );
        }}
      </Query>
    );
  }
}
const styles = theme => ({
  avatar: {},
  bigAvatar: {
    width: 80,
    height: 80
  },
  content: {
    width: "100%",
    paddingLeft: "78px"
  },
  numberCard: {
    backgroundColor: "cyan"
  },
  root: {
    textAlign: "center"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    paddingTop: 20,
    textAlign: "center"
  },
  Name: {
    textAlign: "left"
  }
});

export default withStyles(styles)(AvatarComp);
