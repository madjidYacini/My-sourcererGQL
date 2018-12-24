import _ from "lodash";
export function summaryLanguages(repositories) {
  let languages = [];
  let numberOfCommitLanguages = [];
  let color = [];
  let nbLineLanguage = [];
  repositories.forEach(oneRepos => {
    if (!_.includes(languages, oneRepos.primaryLanguage.name)) {
      languages.push(oneRepos.primaryLanguage.name);
      numberOfCommitLanguages.push(oneRepos.ref.target.history.totalCount);
      color.push(oneRepos.primaryLanguage.color);
      let nbLine = oneRepos.defaultBranchRef.target.history.nodes;
      let ress = 0;
      nbLine.forEach(element => {
        let diff = element.additions - element.deletions;
        ress = ress + diff;
      });

      nbLineLanguage.push(ress);
    } else {
      let id = languages.indexOf(`${oneRepos.primaryLanguage.name}`);
      numberOfCommitLanguages[id] =
        numberOfCommitLanguages[id] + oneRepos.ref.target.history.totalCount;
      let nbLine = oneRepos.defaultBranchRef.target.history.nodes;
      let ress = 0;
      nbLine.forEach(element => {
        let diff = element.additions - element.deletions;
        ress = ress + diff;
      });

      nbLineLanguage[id] = nbLineLanguage[id] + ress;
    }
  });
  return {
    languages,
    numberOfCommitLanguages,
    color,
    nbLineLanguage
  };
}
