import _ from "lodash";
export function parseChartData(data) {
  let languages = [];
  let numberOfCommitLanguages = [];
  let color = [];

  for (let oneRepos of data) {
    if (!_.includes(languages, oneRepos.primaryLanguage.name)) {
      languages.push(oneRepos.primaryLanguage.name);
      numberOfCommitLanguages.push(oneRepos.ref.target.history.totalCount);
      color.push(oneRepos.primaryLanguage.color);
    } else {
      let id = languages.indexOf(`${oneRepos.primaryLanguage.name}`);
      numberOfCommitLanguages[id] =
        numberOfCommitLanguages[id] + oneRepos.ref.target.history.totalCount;
    }
  }

  return {
    color,
    numberOfCommitLanguages,
    languages
  };
}
