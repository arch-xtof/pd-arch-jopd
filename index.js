const express = require("express");
const axios = require("axios");
const redis = require("redis");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const apiUrl = "http://play.grafana.org";
const app = express();
const client = redis.createClient({
  host: '172.28.1.1',
  port: 6379
});

client.on("error", () => console.log("error"));

client.ping();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/old/dashboards/:uid", async (request, response) => {
  let uid = request.params.uid;
  const responseObject = {};

  if (uid?.length <= 40) {
    await axios
      .get(`${apiUrl}/api/dashboards/uid/${uid}`)
      .then((res) => {
        transformDashboardJson(res.data, responseObject);
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

app.get("/api/dashboards/:uid", async (request, response) => {
  try {
    let uid = request.params.uid;
    if (uid?.length >= 40) {
      return response.status(400).send({
        message: `uid can't be longer than 40 characters`,
      });
    }

    client.get(uid, async (err, dashboardInfo) => {
      console.log("---yle---");
      if (dashboardInfo) {
        return response.status(200).send(JSON.parse(dashboardInfo));
      } else {
        const dashboardInfo = {};
        await axios
          .get(`${apiUrl}/api/dashboards/uid/${uid}`)
          .then((axiosResponse) => {
            transformDashboardJson(axiosResponse.data, dashboardInfo);
          })
          .catch((error) => {
            return response.status(404).send({
              message: error,
            });
          });

        client.setex(uid, 1440, JSON.stringify(dashboardInfo));

        return response.status(200).send(JSON.parse(dashboardInfo));
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function transformDashboardJson(data, responseObject) {
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
}

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
