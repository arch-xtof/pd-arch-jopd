const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/dashboards/:uid", async (request, response) => {
  let uid = request.params.uid;
  const responseObject = {};

  if (uid?.length <= 40) {
    await axios
      .get("http://play.grafana.org/api/dashboards/uid/" + uid)
      .then((res) => {
        const dashboard = res.data;

        responseObject.status = "success";
        responseObject.data = dashboard;
      })
      .catch((error) => {
        responseObject.status = "error";
        responseObject.error = "uid not found";
      });
  } else {
    responseObject.status = "error";
    responseObject.error = "uid longer than 40";
  }
  response.json(responseObject);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
