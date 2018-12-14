import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

import { Mutation } from "react-apollo";
import { Line } from "react-chartjs-2";
import "antd/dist/antd.css";

function formatData(repositories) {
  let datasets = [];
  let labels = [];
  let color = [
    "rgba(75,192,192,0.4)",
    "rgb(8, 122, 108)",
    "rgb(193, 241, 46)",
    "rgb(110, 76, 19)",
    "rgb(227, 76, 38)"
  ];
  for (let repos in repositories) {
    console.log("-----");
    let { languages, defaultBranchRef } = repositories[repos];
    for (let node in languages.nodes) {
      let { name } = languages.nodes[node];

      let found = datasets.some(function(el) {
        return el.label === name;
      });
      //  language doesn't exist ?
      if (!found) {
        datasets.push({
          label: name,
          data: [],
          lineTension: 0.1,
          backgroundColor: color.shift()
        });
      }
      if (defaultBranchRef.target != null) {
        console.log(defaultBranchRef.target.history.totalCount);

        datasets[node].data.push(defaultBranchRef.target.history.totalCount);
        let date = new Date(defaultBranchRef.target.pushedDate);
        let yyyy = date.getFullYear();
        let mm = date.getMonth();
        let dd = date.getDate();

        if (labels.indexOf(`${dd}-${mm}-${yyyy}`) === -1) {
          labels.push(`${dd}-${mm}-${yyyy}`);
        }
      }
    }
  }
  console.log(datasets);
  return {
    labels,
    datasets
  };
}

export default () => {
  return (
    <Query
      query={gql`
        {
          viewer {
            repositories(last: 15) {
              nodes {
                languages(last: 15) {
                  nodes {
                    name
                  }
                  totalCount
                }

                defaultBranchRef {
                  target {
                    ... on Commit {
                      history {
                        totalCount
                      }
                      pushedDate
                    }
                  }
                }
              }
              totalCount
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <span>WAIT</span>;
        }

        return (
          <>
            <h2>Overview</h2>
            <Line
              data={formatData(data.viewer.repositories.nodes)}
              width={100}
              height={50}
              options={{
                backgroundColor: "white"
              }}
            />
          </>
        );
      }}
    </Query>
  );
};
