const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const endpointsFile = require("../endpoints.json");

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
        expect(topics.length).not.toBe(0);
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
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint does not exist");
      });
  });
});

describe("GET /api", () => {
  test("200 - responds with array of endpoint objects", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(typeof endpoints).toBe("object");
        for (const item in endpoints) {
          const itemObj = endpoints[item];
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
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual(endpointsFile);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200 - responds with article object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article.hasOwnProperty("author")).toBe(true);
        expect(article.hasOwnProperty("title")).toBe(true);
        expect(article.hasOwnProperty("article_id")).toBe(true);
        expect(article.hasOwnProperty("body")).toBe(true);
        expect(article.hasOwnProperty("topic")).toBe(true);
        expect(article.hasOwnProperty("created_at")).toBe(true);
        expect(article.hasOwnProperty("votes")).toBe(true);
        expect(article.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
  test("400 - responds with error message when passed bad article id", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - responds with error message when passed valid article_id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/52")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("GET /api/articles", () => {
  test("200 - responds with array of article objects that have correct keys sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200 - responds with array of comments for requested article sorted most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).not.toBe(0);
        expect(comments).toBeSortedBy("created_at");
        comments.forEach((comment) => {
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.hasOwnProperty("article_id")).toBe(true);
        });
      });
  });
  test("200 - sends empty array if article_id does exist but no comments are present", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
      });
  });
  test("400 - sends error if invalid article_id used", () => {
    return request(app)
      .get("/api/articles/pickles/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - sends error if valid article_id used but article does not exist", () => {
    return request(app)
      .get("/api/articles/537653/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201 - adds a comment for an article and sends the comment as an object", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "icellusedkars", body: "I like this article" })
      .expect(201)
      .then(({ body }) => {
        const comment = body;
        expect(typeof comment.comment_id).toBe("number");
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe("I like this article");
        expect(comment.hasOwnProperty("created_at")).toBe(true);
        expect(comment.votes).toBe(0);
        expect(comment.article_id).toBe(3);
      });
  });
  test("400 - returns an error if invalid article_id used", () => {
    return request(app)
      .post("/api/articles/chickens/comments")
      .send({ username: "icellusedkars", body: "I like this article" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - sends error if valid article_id used but article does not exist", () => {
    return request(app)
      .get("/api/articles/457439/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400 - sends error if the comment body is empty", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({ username: "icellusedkars", body: "" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Cannot post empty comment");
      });
  });
  test("404 - sends error if user does not exist", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({ username: "steve", body: "I like this article" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("updates article votes and sends updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
        expect(article.votes).toBe(103);
      });
  });
  test("400 - returns error if given invalid votes (i.e. not a number)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cheese" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Votes number not given");
      });
  });
  test("400 - returns an error if invalid article_id used", () => {
    return request(app)
      .patch("/api/articles/hashbrowns")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - sends error if valid article_id used but article does not exist", () => {
    return request(app)
      .get("/api/articles/457439")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("200 - sends updated article object with correct vote count when given a negative number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -53 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
        expect(article.votes).toBe(47);
      });
  });
  test("400 - sends error if inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Votes number not given");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204 - deletes comment with given comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400 - sends error if invalid id used", () => {
    return request(app)
      .delete("/api/comments/cheeseburger")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - sends error if comment id is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/387465")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});
describe("GET /api/users", () => {
  test("200 - sends array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).not.toBe(0);
        users.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true);
          expect(user.hasOwnProperty("name")).toBe(true);
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});
describe("GET /api/articles?topicquery", () => {
  test("200 - sends array of article objects with requested topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("404 - sends error if topic doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=meatballs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
  test("200 - sends empty array if topic exists but no matching articles present", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
});
describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200 - returns requested article, now with comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          comment_count: 11,
        });
      });
  });
  test("200 - returns requested article object with comment_count = 0 when article present but has no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          comment_count: 0,
        });
      });
  });
});
describe("GET /api/articles(sorting queries)", () => {
  test("200 - responds with array of articles sorted by given valid query", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).not.toBe(0);
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("400 - returns error if given invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=pickles")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
});
describe("GET /api/articles(order queries)", () => {
  test("200 - responds with array of articles sorted in order of given order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).not.toBe(0);
        expect(articles).toBeSorted({ descending: false });
      });
  });
  test("400 - returns error if given invalid order query", () => {
    return request(app)
      .get("/api/articles?order=chickens")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("200 - sort_by and order queries work simultaneously", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).not.toBe(0);
        expect(articles).toBeSortedBy("comment_count", { descending: false });
      });
  });
});
describe("GET /api/users/:username", () => {
  test("200 - sends user object for requested username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404 - sends error if username is valid but does not exist", () => {
    return request(app)
      .get("/api/users/steve")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});
describe("PATCH /api/comments/:comment_id", () => {
  test("updates comment votes and sends updated comment object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 7 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(typeof comment).toBe("object");
        expect(comment.votes).toBe(23);
      });
  });
  test("400 - returns error if given invalid votes (i.e. not a number)", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "cheese" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Votes number not given");
      });
  });
  test("400 - returns an error if invalid comment_id used", () => {
    return request(app)
      .patch("/api/comments/hashbrowns")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - sends error if valid comment_id used but comment does not exist", () => {
    return request(app)
      .patch("/api/comments/457434")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("200 - sends updated comment object with correct vote count when given a negative number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(typeof comment).toBe("object");
        expect(comment.votes).toBe(6);
      });
  });
  test("400 - sends error if inc_votes is missing", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Votes number not given");
      });
  });
});
describe("POST /api/articles", () => {
  test("201 - sends object of posted article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "an article",
        body: "words words words",
        topic: "paper",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        console.log(article)
        expect(article).toMatchObject({
          article_id: 14,
          author: "lurker",
          title: "an article",
          body: "words words words",
          topic: "paper",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          comment_count: 0,
        });
        expect(article.hasOwnProperty("created_at")).toBe(true);
      });
  });
  test("404 - sends error if topic doesn't exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "an article",
        body: "words words words",
        topic: "cheese",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
  test("404 - sends error if user doesn't exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "steve",
        title: "an article",
        body: "words words words",
        topic: "paper",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400 - sends error if any required columns are missing from input", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "an article",
        topic: "paper",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Missing required information");
      });
  });
  test("400 - sends error if any required columns are empty", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "",
        body: "words words words",
        topic: "paper",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Missing required information");
      });
  });
});
