const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const apiUrl = "http://play.grafana.org";
const app = express();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/dashboards/:uid", async (request, response) => {
  let uid = request.params.uid;
  const responseObject = {};

  if (uid?.length <= 40) {
    await axios
      .get(apiUrl + "/api/dashboards/uid/" + uid)
      .then((res) => {
        const data = res.data;

        responseObject.uid = data.dashboard.uid;
        responseObject.title = data.dashboard.title;
        responseObject.url = apiUrl + data.meta.url;
        responseObject.folderName = data.meta.folderTitle;
        responseObject.datasources = [];

        data.dashboard.panels.forEach((panel) => {
          let datasourceName = panel.datasource;
          if (datasourceName !== null) {
            datasourceCreated = false;
            responseObject.datasources.forEach((item) => {
              console.log(datasourceName + " == " + item.name);
              if (datasourceName == item.name) {
                datasourceCreated = true;
              }
            });
            if (!datasourceCreated) {
              responseObject.datasources.push({
                name: datasourceName,
                panels: [],
              });
            }
            responseObject.datasources.forEach((item) => {
              if (item.name === datasourceName) {
                item.panels.push({
                  id: panel.id,
                  title: panel.title,
                });
              }
            });
          }
        });
      })
      .catch((error) => {
        response.status(404);
        responseObject.error = "uid not found";
      });
  } else {
    response.status(400);
    responseObject.error = "uid longer than 40";
  }
  response.set("Access-Control-Allow-Origin", "*");
  response.json(responseObject);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
