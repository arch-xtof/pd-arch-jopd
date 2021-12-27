const express = require("express");
const axios = require("axios");
const redis = require("redis");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const client = redis.createClient({
  url: `${process.env.REDIS_URL}`,
});

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
})();

const apiUrl = "http://play.grafana.org";
const app = express();

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

    // TODO add logging
    let dashboardInfo = await client.get(uid);

    if (dashboardInfo) {
      response.status(200).send(JSON.parse(dashboardInfo));
    } else {
      try {
        const axiosResponse = await axios.get(
          `${apiUrl}/api/dashboards/uid/${uid}`
        );
        dashboardInfo = transformDashboardJson(axiosResponse.data);
        response.status(200).send(dashboardInfo);
        await client.set(uid, JSON.stringify(dashboardInfo));
      } catch (error) {
        dashboardInfo = error.response.data;
        response.status(error.response.status).send(error.response.data);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function transformDashboardJson(data) {
  // TODO implement maps
  const responseObject = {};
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
  return responseObject;
}
