import React, { Component } from "react";
import Chart from "chart.js";
import { parseChartData } from "../services/chart-service";

class ChartComponent extends Component {
  componentDidMount() {
    const { data } = this.props;
    let repositories = data.viewer.repositories.nodes;
    let parsedData = parseChartData(repositories);
    setTimeout(function() {
      new Chart(document.getElementById("pie-chart"), {
        type: "pie",
        data: {
          labels: parsedData.languages,
          datasets: [
            {
              label: "languages (commits)",
              backgroundColor: parsedData.color,
              data: parsedData.numberOfCommitLanguages
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
  }
  render() {
    return (
      <>
        <canvas id="pie-chart" width="300" height="150" />
      </>
    );
  }
}

// export default ;
export default ChartComponent;
