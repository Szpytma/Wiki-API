const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const app = express();
const localDbUrl = "mongodb://localhost:27017/wikiDB";
const dbUrl =
  "mongodb+srv://admin:1239875@cluster0.wer1qxy.mongodb.net/todolistDB";

app.set("view engine", ejs);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(3000 || process.env.PORT);
mongoose.connect(dbUrl);

const articleSchema = { title: String, content: String };
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  /// Request targeting all articles
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  // Posting new dosuemnt to collection
  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const newArticle = new Article({ title: title, content: content });
    newArticle.save(function (err) {
      if (!err) {
        res.send("sucesfully added a new article" + newArticle);
      } else {
        res.send(err);
      }
    });
  })

  /// targeting all articles to delete
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("All articles removed");
      } else {
        res.send(err);
      }
    });
  });

/// Request targeting specific article

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, result) {
        if (result && !err) {
          res.send("Article was updated" + result);
        } else {
          res.send("something went wrong");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } },
      function (err, result) {
        if (result && !err) {
          res.send("Article was updated" + result);
        } else {
          res.send("something went wrong");
        }
      }
    );
  })

  /// targeting specific article to delete
  .delete(function (req, res) {
    Article.findOneAndDelete(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle + "was deleted");
        } else {
          res.send("No articles matching that title was found");
        }
      }
    );
  });
