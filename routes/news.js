module.exports = function(app, conn, upload) {
  var express = require('express');
  var router = express.Router();
  var category = require('../lib/category.js');

  /* 목록 */
  router.get('/', (req, res) => {
    var selectedCategory = req.query.category;
    if (!selectedCategory) {
      selectedCategory = "";
    }

    category.get(conn, function(categoryList) {

      var sql = "SELECT a.*, c.title as `category_title` "
                + "FROM study a "
                + "INNER JOIN category c on a.category = c.id "
      var sqlParam = []

      if (selectedCategory) {
        sql += "WHERE a.category = ? "
        sqlParam.push(selectedCategory);
      }

      conn.query(sql, sqlParam, function(err, news, fields){
        if(err){
          res.status(500).send('Internal Server Error: ' + err);
        } else {
          res.render('news/index', {
            news:news,
            category: categoryList,
            selectedCategory: selectedCategory
          });
        }
      });
    });
  });

  /* 추가 */
  router.get('/add', (req, res) => {
    category.get(conn, function(categoryList) {
      res.render('news/add', {
        category: categoryList
      });
    });
  });

  /* Form 데이터 DB INSERT */
  router.post('/add', upload.single('upload'), (req, res) => {
    console.log("study add 0001");
    var title = req.body.title;
    var category = (req.body.category == 'Select category' ? 1 : req.body.category);
    var desc = req.body.desc;
    var author = req.body.author;
    var upload = req.file.filename;
    var people = req.body.people;
    var date = req.body.date;
    var username = req.body.username;
    console.log("study add 0002");

    var sql = 'INSERT INTO study (`title`, `category`, `desc`, `price`, `upload`, `maxpeople`, `people`, `startdate`, `registered`) VALUES(?, ?, ?, ?, ?, ?, 0, ?, now())';
    conn.query(sql, [title, category, desc, author, upload, people, date], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);
      } else {
        var studyId= 'select * from study where title = ?';
        conn.query(studyId, [title], function(err, study, fields){
          if(err){
            console.log(err);
          } else {
            var participate = 'INSERT INTO participate (`username`, `study_id`, `registered`) VALUES(?, ?, now())';
            conn.query(participate, [username, study[0].id], function(err, result, fields){
              if(err){
                console.log(err);
              } else {
                var update= 'update study set people = people + 1 where id = ?';
                conn.query(update, [study[0].id], function(err, rew, fields){
                  if(err){
                    console.log(err);
                  } else {
                    res.redirect('/news/' + study[0].id);
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  /* 수정 */
  router.get('/:id/edit', (req, res) => {
    var id = req.params.id;

    category.get(conn, function(categoryList) {
      var sql = "SELECT a.*, c.title as `category_title` "
                + "FROM study a "
                + "INNER JOIN category c on a.category = c.id "
                + "WHERE a.id=?";

      conn.query(sql, [id], function(err, news, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error: ' + err);
        } else {
          res.render('news/edit', {news:news[0], category: categoryList});
        }
      });
    });
  });

  /* Form 데이터 DB UPDATE */
  router.post('/:id/edit', upload.single('upload'), (req, res) => {
    var id = req.params.id;
    var category = req.body.category;
    var title = req.body.title;
    var desc = req.body.desc;
    var author = req.body.author;
    var people = req.body.people;
    var date = req.body.date;

    if (typeof req.file !== 'undefined') {
      var sql = 'UPDATE study SET title = ?, `category` = ?, `desc`= ?, `author` = ?, `updated` = now(), `upload` = ? WHERE id = ?, `people` = ?,`date` = ?;';
      var sqlParam = [title, category, desc, author, req.file.filename, id, people, date]
    } else {
      var sql = 'UPDATE study SET title = ?, `category` = ?, `desc`= ?, `author` = ?, `updated` = now() WHERE id = ?, `people` = ?,`date` = ?;';
      var sqlParam = [title, category, desc, author, id, people, date]
    }

    conn.query(sql, sqlParam, function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);
      } else {
        res.redirect('/news/' + id);
      }
    });
  });

  /* Delete confirmation */
  router.get('/:id/delete', (req, res) => {
    var id = req.params.id;
    var sql = 'SELECT * FROM study WHERE id=?';
    conn.query(sql, [id], function(err, news, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);
      } else {
        res.render('news/delete', {news:news[0]});
      }
    });
  });

  /* DELETE DB row */
  router.post('/:id/delete', (req, res) => {
    var id = req.params.id;

    var sql = 'DELETE FROM study WHERE id = ?';
    conn.query(sql, [id], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);
      } else {
        res.redirect('/news/');
      }
    });
  });

  /* 상세보기 */
  router.get('/:id', (req, res) => {
    var id = req.params.id;
    var sql = "SELECT a.*, c.title as `category_title` "
              + "FROM study a "
              + "INNER JOIN category c on a.category = c.id "
              + "WHERE a.id=?";

    conn.query(sql, [id], function(err, news, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);

      } else {
        if(req.session.user){
          var already= "select * from participate where username=? and study_id=?";
          console.log("user name : " + req.session.user['username']);
          conn.query(already, [req.session.user['username'], id], function(err, result, fields){
            if(err){
  
            } else {
              res.render('news/detail', {
                news: news[0],
                already: (result.length > 0 ? true : false)
              });
            }
          });
        } else {
          res.render('news/detail', {
            news: news[0],
            already: false
          });
        }

        // var commentSql = "SELECT * FROM checkstudy WHERE study_id = ?";
        // conn.query(commentSql, [id], function(err, comments, fields){
        //   if(err){
        //     console.log(err);
        //     res.status(500).send('Internal Server Error: ' + err);
        //   } else {
            
        //   }
        // });
      }
    });
  });

  /* COMMENT 데이터 DB INSERT */
  router.post('/:id/comment', upload.single('upload'), (req, res) => {
    var articleId = req.params.id;
    var author = req.body.author;
    console.log(req.file);
    var picture= req.file.filename;
    var desc = req.body.desc;
    
    var sql = 'INSERT INTO checkstudy (`study_id`, `author`, `desc`, `picture`, `registered`) VALUES(?, ?, ?, ?, now())';
    conn.query(sql, [articleId, author, desc, picture], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error: ' + err);
      } else {
        res.redirect('/news/study/' + articleId);
      }
    });
  });

  router.get('/delete/:id/:comment', (req, res) => {
    var id= req.params.id;
    var comment= req.params.comment;
    
    var sql= 'delete from checkstudy where id=?';
    conn.query(sql, [comment], function(err, result, fields){
      if(err){

      } else {
        res.redirect('/news/study/' + id);
      }
    });
  });

  router.get('/study/:id', (req, res) => {
    var id = req.params.id;
    var user= req.session.user['username'];

    var already= 'select * from participate where study_id=? and username=?';

    conn.query(already, [id, user], function(err, isalready, fields){
      if(err){

      } else {
        if(isalready.length > 0){
          var sql = "SELECT * FROM checkstudy WHERE study_id=?";
            conn.query(sql, [id], function(err, comment, fields){
              if(err){
                console.log(err);
                res.status(500).send('Internal Server Error: ' + err);

              } else {
                res.render('news/study', {
                  studyid: id,
                  comment: comment
                });
              }
            });
        } else {
          var participate = 'INSERT INTO participate (`username`, `study_id`, `registered`) VALUES(?, ?, now())';
          conn.query(participate, [user, id], function(err, result, fields){
            if(err){
              console.log(err);
            } else {
              var update= 'update study set people = people + 1 where id = ?';
              conn.query(update, [id], function(err, rew, fields){
                if(err){
                  console.log(err);
                } else {
                  var sql = "SELECT * FROM checkstudy WHERE study_id=?";
                  conn.query(sql, [id], function(err, comment, fields){
                    if(err){
                      console.log(err);
                      res.status(500).send('Internal Server Error: ' + err);
      
                    } else {
                      res.render('news/study', {
                        studyid: id,
                        comment: comment
                      });
                    }
                  });
      
      
                  // res.redirect('/news/' + result.insertId);
                }
              });
            }
          });
        }
      }
    });
  });


  return router;
};
