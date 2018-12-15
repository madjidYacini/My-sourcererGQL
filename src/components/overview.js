import React from "react";
import { Query } from "react-apollo";
import { GET_REPOS_COMMITS } from "../models/gqlQueries";
import { Line } from "react-chartjs-2";
import "antd/dist/antd.css";

function formatData(repositories) {
  console.log(repositories);

  let datasets = [];
  let labels = [];
  repositories.map((oneRepo, id) => {
    let { defaultBranchRef, primaryLanguage } = repositories[id];
    let name = primaryLanguage.name;
    let found = datasets.some(obj => obj.label === name);
    if (!found) {
      datasets.push({
        label: name,
        data: [],
        lineTension: 0.1,
        backgroundColor: primaryLanguage.color
      });
    }
    if (defaultBranchRef.target !== null) {
      let index = datasets.findIndex(obj => obj.label === name);
      datasets[index].data.push(defaultBranchRef.target.history.totalCount);
      let date = new Date(defaultBranchRef.target.pushedDate);
      let yyyy = date.getFullYear();
      let mm = date.getMonth();
      let dd = date.getDate();
      if (labels.indexOf(`${dd}-${mm}-${yyyy}`) === -1) {
        labels.push(`${dd}-${mm}-${yyyy}`);
      }
    }
  });

  return {
    labels,
    datasets
  };
}

export default () => {
  return (
    <Query query={GET_REPOS_COMMITS}>
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
              options={{ backgroundColor: "white" }}
            />
          </>
        );
      }}
    </Query>
  );
};
