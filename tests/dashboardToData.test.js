const dash = require("../utils/dashboardToData");

const oneDataOnePanel = {
  meta: {
    url: "url",
    folderTitle: "folderTitle",
  },
  dashboard: {
    uid: "uid",
    title: "title",
    panels: [
      {
        datasource: "datasource",
        id: 1,
        title: "panel-title-1",
      },
    ],
  },
};
const oneDataMulPanel = {
  meta: {
    url: "url",
    folderTitle: "folderTitle",
  },
  dashboard: {
    uid: "uid",
    title: "title",
    panels: [
      {
        datasource: "datasource",
        id: 1,
        title: "panel-title-1",
      },
      {
        datasource: "datasource",
        id: 2,
        title: "panel-title-2",
      },
    ],
  },
};
const mulDataOnePanel = {
  meta: {
    url: "url",
    folderTitle: "folderTitle",
  },
  dashboard: {
    uid: "uid",
    title: "title",
    panels: [
      {
        datasource: "datasource-1",
        id: 1,
        title: "panel-title-1",
      },
      {
        datasource: "datasource-2",
        id: 2,
        title: "panel-title-2",
      },
    ],
  },
};
const mulDataMulPanel = {
  meta: {
    url: "url",
    folderTitle: "folderTitle",
  },
  dashboard: {
    uid: "uid",
    title: "title",
    panels: [
      {
        datasource: "datasource-1",
        id: 1,
        title: "panel-title-1",
      },
      {
        datasource: "datasource-1",
        id: 2,
        title: "panel-title-2",
      },
      {
        datasource: "datasource-2",
        id: 3,
        title: "panel-title-3",
      },
      {
        datasource: "datasource-2",
        id: 4,
        title: "panel-title-4",
      },
    ],
  },
};

const resOneDataOnePanel = {
  uid: "uid",
  title: "title",
  url: "url",
  folderName: "folderTitle",
  datasources: [
    {
      name: "datasource",
      panels: [
        {
          id: 1,
          title: "panel-title-1",
        },
      ],
    },
  ],
};
const resOneDataMulPanel = {
  uid: "uid",
  title: "title",
  url: "url",
  folderName: "folderTitle",
  datasources: [
    {
      name: "datasource",
      panels: [
        {
          id: 1,
          title: "panel-title-1",
        },
        {
          id: 2,
          title: "panel-title-2",
        },
      ],
    },
  ],
};
const resMulDataOnePanel = {
  uid: "uid",
  title: "title",
  url: "url",
  folderName: "folderTitle",
  datasources: [
    {
      name: "datasource-1",
      panels: [
        {
          id: 1,
          title: "panel-title-1",
        },
      ],
    },
    {
      name: "datasource-2",
      panels: [
        {
          id: 2,
          title: "panel-title-2",
        },
      ],
    },
  ],
};
const resMulDataMulPanel = {
  uid: "uid",
  title: "title",
  url: "url",
  folderName: "folderTitle",
  datasources: [
    {
      name: "datasource-1",
      panels: [
        {
          id: 1,
          title: "panel-title-1",
        },
        {
          id: 2,
          title: "panel-title-2",
        },
      ],
    },
    {
      name: "datasource-2",
      panels: [
        {
          id: 3,
          title: "panel-title-3",
        },
        {
          id: 4,
          title: "panel-title-4",
        },
      ],
    },
  ],
};

describe("dashboardToData", () => {
  beforeAll(() => {});

  afterAll(() => {});

  describe("transformation", () => {
    beforeEach(() => {});

    it("one datasource one panel", () => {
      expect(JSON.stringify(dash.dashboardToData(oneDataOnePanel, ""))).toBe(
        JSON.stringify(resOneDataOnePanel)
      );
    });

    it("one datasource multiple panels", () => {
      expect(JSON.stringify(dash.dashboardToData(oneDataMulPanel, ""))).toBe(
        JSON.stringify(resOneDataMulPanel)
      );
    });

    it("multiple datasources one panel", () => {
      expect(JSON.stringify(dash.dashboardToData(mulDataOnePanel, ""))).toBe(
        JSON.stringify(resMulDataOnePanel)
      );
    });

    it("multiple datasources multiple panels", () => {
      expect(JSON.stringify(dash.dashboardToData(mulDataMulPanel, ""))).toBe(
        JSON.stringify(resMulDataMulPanel)
      );
    });

    it("multiple datasources multiple panels", () => {
      expect(JSON.stringify(dash.dashboardToData({random: "malformation"}, ""))).toBe(
        JSON.stringify({ message: "dashboard is malformed"})
      );
    });
  });
});
