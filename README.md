# Northcoders News API

I have created this as a back-end project while doing the Software Development Bootcamp with [Northcoders](https://northcoders.com/). The NC News API uses psql to set up a database representing a social media platform where users can post and discuss a wide variety of content covering many topics (similar to Reddit). In a few weeks' time I wil be making the front-end for this project, so keep your eyes peeled for that! The server is now live, and [hosted here!](https://nc-news-3uh0.onrender.com/api) :smile: :partying_face:


## To install:
```
# Clone
git clone https://github.com/j3llybean42/be-nc-news.git

# Install dependencies
npm install
```

## Instructions:
1. Create 2 files, ".env.test" and ".env.development"
2. In the .env.development file, add "PGDATABASE=database_name"
3. In the .env.test file, add "PGDATABASE=database_name_test"
4. Add your .env files to the .gitignore file, or use ".env.*"
### Create the databases
```
npm run setup-dbs
```
### Testing
```
npm test
```
### Running Locally
```
npm run seed
npm run start
```
### Open http://localhost:9090 in your browser
```
open http://localhost:9090
```

## Software requirements:
Project created with:
* Node version: v21.5.0
* Postgres version: v14.10
