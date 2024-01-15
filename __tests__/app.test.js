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
    test("404 - responds with error if invalid endpoint used", () => {
        return request(app)
        .get("/cheese")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Endpoint does not exist")
        })
    })
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
describe("GET /api/articles/:article_id", () => {
    test("200 - responds with article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body
          expect(article.article_id).toBe(1)
          expect(article.hasOwnProperty("author")).toBe(true)
          expect(article.hasOwnProperty("title")).toBe(true)
          expect(article.hasOwnProperty("article_id")).toBe(true)
          expect(article.hasOwnProperty("body")).toBe(true)
          expect(article.hasOwnProperty("topic")).toBe(true)
          expect(article.hasOwnProperty("created_at")).toBe(true)
          expect(article.hasOwnProperty("votes")).toBe(true)
          expect(article.hasOwnProperty("article_img_url")).toBe(true)
       });
    });
    test("400 - responds with error message when passed bad article id", () => {
        return request(app)
          .get("/api/articles/one")
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
      });
      test("404 - responds with error message when passed valid article_id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/52")
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe("Article not found")
        })
      });
})