const express = require('express');
const router = express.Router();
const { pool, poolusr } = require('./database.js');
const passw = require('./news_modules.js');

let view = "signin";
let message = "";
let nuser = "";
let search = "N";
let orderby = "date_created ASC";

// The first time SIGNIN
router.get('/', (req, res) => {
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

// SIGNIN
router.get('/signin', (req, res) => {
    view = "signin";
    nuser = "";
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

router.post('/signin', (req, res) => {
    const { user, password } = req.body;
    poolusr.query('SELECT * FROM user WHERE user_id = ?', user, (err, rows) => {
        if (rows.length > 0) {
            pool.query('SELECT * FROM user_enabled WHERE user_enabled_id = ?', user, (err, rowusr) => {
                if (rowusr.length > 0) {
                    hash = passw.cryptpass(password);
                    if (rows[0].user_password == hash) {
                        nuser = user.toUpperCase();
                        orderby = "date_created ASC";
                        res.redirect('/list');
                    } else {
                        message = "Invalid Password";
                        res.redirect('/signin');
                    }
                } else {
                    message = "User not enabled to this application, " +
                        "please contact the administrator";
                    res.redirect('/signin');
                }
            });
        } else {
            message = "User does not exist";
            res.redirect('/signin');
        }
    });
});

// SIGNUP
router.get('/signup', (req, res) => {
    view = "signup";
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

router.post('/signup', (req, res) => {
    const { firstname, lastname, email, user, password, } = req.body;
    poolusr.query('SELECT * FROM user WHERE user_id = ?', user, (err, rows) => {
        if (rows.length == 0) {
            hash = passw.cryptpass(password);
            poolusr.query('INSERT INTO user SET ?', {
                user_first_name: firstname,
                user_last_name: lastname,
                user_email: email,
                user_id: user,
                user_password: hash
            });
            message = "User successfully registered, " +
                "please contact the administrator to use this app";
            res.redirect('/signin');
        } else {
            message = "User Already Exists";
            res.redirect('/signup');
        }
    });
});

// CHGPWD
router.get('/chgpwd', (req, res) => {
    view = "chgpwd";
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

router.post('/chgpwd', (req, res) => {
    const { userchg, pwdold, pwdnew1, pwdnew2 } = req.body;
    if (pwdnew1 == pwdnew2) {
        poolusr.query('SELECT * FROM user WHERE user_id = ?', userchg, (err, rows) => {
            if (rows.length > 0) {
                hash1 = passw.cryptpass(pwdold);
                if (rows[0].user_password == hash1) {
                    hash2 = passw.cryptpass(pwdnew1);
                    if (hash2 != hash1) {
                        poolusr.query('UPDATE user SET user_password = ? WHERE user_id = ?', [hash2, userchg]);
                        message = "Password changed successfully, login with your new password";
                        res.redirect('/signin');
                    } else {
                        message = "The password to change is the same as the original";
                        res.redirect("/chgpwd");
                    }
                } else {
                    message = "Invalid password";
                    res.redirect("/chgpwd");
                }
            } else {
                message = "Invalid user name or password";
                res.redirect('/chgpwd');
            }
        });
    } else {
        message = "New passwords are different";
        res.redirect('/chgpwd');
    }
});

// LIST News
router.get('/list', (req, res) => {
    let sql = 'SELECT id_news, title, news, DATE_FORMAT(date_created, "%d/%m/%y") AS date, ' +
              'DATE_FORMAT(date_created, "%h:%i:%s") AS time FROM news ' +
              'ORDER BY ' + orderby;
    pool.query(sql, (err, result) => {
            view = "list";
            search = "N";
            res.render("main.ejs", { view: view, news: result, nuser: nuser, search: search });
        });
});

router.get('/listtitle', (req, res) => {
    if (orderby == "title ASC") {
        orderby = "title DESC";
    } else {
        orderby = "title ASC";
    }
    res.redirect('/list');
});

router.get('/listdate', (req, res) => {
    if (orderby == "date_created ASC") {
        orderby = "date_created DESC";
    } else {
        orderby = "date_created ASC";
    }
    res.redirect('/list');
});

// SEARCH News
router.get('/search', (req, res) => {
    view = "search";
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

router.post('/search', (req, res) => {
    const { title } = req.body;
    pool.query('SELECT id_news, title, news, DATE_FORMAT(date_created, "%d/%m/%y") AS date, ' + 
               'DATE_FORMAT(date_created, "%h:%i:%s") AS time ' +
               'FROM news WHERE title = ?', title, (err, rows) => {
        if (rows.length > 0) {
            view = "list";
            search = "Y";
            res.render("main.ejs", { view: view, news: rows, nuser: nuser, search: search });
        } else {
            message = "Title does not exist";
            res.redirect('/search');
        }
    });
});

// ADD News
router.get('/add', (req, res) => {
    view = "add";
    res.render("main.ejs", { view: view, message: message, nuser: nuser });
    message = "";
});

router.post('/add', (req, res) => {
    const { title, news } = req.body;
    pool.query('SELECT * FROM news WHERE title = ?', title, (err, rows) => {
        if (rows.length == 0) {
            pool.query('INSERT INTO news SET ?', {
                title: title,
                news: news
            }, (err, result) => {
                res.redirect('/list');
            });
        } else {
            message = "News with this Title already exist";
            res.redirect('/add');
        }
    });
});

// EDIT News
router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM news WHERE id_news = ?', id, (err, rows) => {
        if (!err) {
            view = "edit";
            res.render("main.ejs", { view: view, rows: rows[0], nuser: nuser });
        } else {
            console.log(err);
        }
    });
});

router.post('/edit', (req, res) => {
    const title = req.body.title;
    const news = req.body.news;
    pool.query('UPDATE news SET news = ? WHERE title = ?', [news, title], (err, result) => {
        res.redirect('/list');
    });
});

// DELETE News 
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM news WHERE id_news = ?', id, (err, result) => {
        res.redirect('/list');
    });
});

module.exports = router;