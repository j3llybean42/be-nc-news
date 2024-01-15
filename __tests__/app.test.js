const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const endpointsFile = require("../endpoints.json")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
    test("200 - responds with array of topic objects that have keys of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(Array.isArray(topics)).toBe(true);
          topics.forEach((topic) => {
            expect(topic.hasOwnProperty("slug")).toBe(true);
            expect(topic.hasOwnProperty("description")).toBe(true);
          });
       });
    });
})

describe("GET /api", () => {
    test("200 - responds with array of endpoint objects", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;         
            expect(typeof endpoints).toBe("object")          
            for(const item in endpoints){
                const itemObj = endpoints[item]
                expect(itemObj.hasOwnProperty("description")).toBe(true);
                expect(itemObj.hasOwnProperty("queries")).toBe(true);
                expect(itemObj.hasOwnProperty("exampleRequestBody")).toBe(true);
                expect(itemObj.hasOwnProperty("exampleResponse")).toBe(true);
            }
       });
    });
    test("endpoints query result matches endpoints.json file", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const { endpoints } = body;
            expect(endpoints).toEqual(endpointsFile)
        })
    })
})