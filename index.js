const express = require("express");
const axios = require("axios");
const redis = require("redis");
const cors = require("cors");
const { dashboardToData } = require("./utils/dashboardToData");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const client = redis.createClient({
  url: `${process.env.REDIS_URL}`,
});

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("connect", (err) => console.log("Redis Connected"));
  await client.connect();
})();

const apiUrl = process.env.API_URL;
const app = express();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

app.get("/api/dashboards/:uid", async (request, response) => {
  try {
    let uid = request.params.uid;
    if (uid?.length >= 40) {
      return response.status(400).send({
        message: "uid can't be longer than 40 characters",
      });
    }

    let dashboardInfo = await client.get(uid);

    if (dashboardInfo) {
      response.status(200).send(JSON.parse(dashboardInfo));
    } else {
      try {
        const axiosResponse = await axios.get(
          `${apiUrl}/api/dashboards/uid/${uid}`
        );
        dashboardInfo = dashboardToData(axiosResponse.data);
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
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = {
  server: server,
  client: client,
};
