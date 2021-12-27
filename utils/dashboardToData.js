function dashboardToData(data, apiUrl) {
  try {
    let myMap = new Map(Object.entries(data));
    const responseObject = {};

    responseObject.uid = data.dashboard.uid;
    responseObject.title = data.dashboard.title;
    responseObject.url = apiUrl + data.meta.url;
    responseObject.folderName = data.meta.folderTitle;
    responseObject.datasources = [];

    myMap.get("dashboard").panels.find((e) => {
      if (
        e?.datasource &&
        !responseObject.datasources.some((t) => {
          return t.name === e.datasource;
        })
      ) {
        responseObject.datasources.push({
          name: e.datasource,
          panels: [],
        });
      }

      responseObject.datasources.find((d) => {
        if (d.name === e.datasource) {
          d.panels.push({
            id: e.id,
            title: e.title,
          });
        }
      });
    });

    return responseObject;
  } catch (error) {
    console.log(error);
    return { message: "dashboard is malformed"}
  }
}

module.exports = {
  dashboardToData,
};
