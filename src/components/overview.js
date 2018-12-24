import React from "react";
import { Query } from "react-apollo";
import { GET_REPOS_COMMITS } from "../models/gqlQueries";
import { Line } from "react-chartjs-2";
import "antd/dist/antd.css";
import { formatData } from "../services/overview-service";
export default () => {
  return (
    <Query query={GET_REPOS_COMMITS}>
      {({ loading, error, data }) => {
        if (loading) {
          return <span />;
        }
        return (
          <>
            <h1 style={{ textAlign: "center", fontFamily: "serif" }}>
              Overview
            </h1>
            <Line
              data={formatData(data.viewer.repositories.nodes)}
              width={100}
              height={50}
              options={{ backgroundColor: "white", showLine: false }}
            />
          </>
        );
      }}
    </Query>
  );
};
