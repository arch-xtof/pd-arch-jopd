const index = require("../../index");
const request = require("supertest")(index.server);

const uidExists = "000000012";
const uidNotExists = "notfound";
const uidTooLong = "12345678901234567890123456789012345678901234567890";

describe("API Integration", () => {
  it("dashboard exists", (done) => {
    request
      .get(`/api/dashboards/${uidExists}`)
      .expect("Content-Type", /json/)
      .end((err, response) => {
        if (err) done(err);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text).uid).toBe(uidExists);
        done();
      });
  });

  it("dashboard does not exist", (done) => {
    request
      .get(`/api/dashboards/${uidNotExists}`)
      .expect("Content-Type", /json/)
      .end((err, response) => {
        if (err) done(err);
        expect(response.statusCode).toBe(404);
        done();
      });
  });

  it("dashboard uid too long", (done) => {
    request
      .get(`/api/dashboards/${uidTooLong}`)
      .expect("Content-Type", /json/)
      .end((err, response) => {
        if (err) done(err);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(
          JSON.stringify({
            message: "uid can't be longer than 40 characters",
          })
        );
        done();
      });
  });

  it("redis does not break api", (done) => {
    request
      .get(`/api/dashboards/${uidExists}`)
      .expect("Content-Type", /json/)
      .end((err, response) => {
        if (err) done(err);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text).uid).toBe(uidExists);
        done();
      });
  });
});

afterAll(() => {
  index.server.close();
  index.client.quit();
});
