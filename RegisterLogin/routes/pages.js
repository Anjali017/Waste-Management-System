const express = require('express');
const mysql = require('mysql');
const sellerController = require('../controllers/authseller');
const buyerController = require('../controllers/authbuyer');
const muncipalityController = require('../controllers/authmuncipality');

const router = express.Router();

router.get('/',sellerController.isLoggedIn,(req,res)=> {
    res.render('index', {
        user: req.user
    });
});

router.get('/sellerhome',sellerController.isLoggedIn,(req,res)=> {
    res.render('sellerhome', {
        user: req.user
    });
});

// SELLER

router.get('/seller', sellerController.view);
router.post('/seller', sellerController.find);
router.get('/editseller/:id', sellerController.edit);
router.post('/editseller/:id', sellerController.update);
router.get('/seller/:id',sellerController.delete);


router.get('/sellerregister',(req,res)=> {
    res.render('sellerregister');
});
router.get('/sellerlogin',(req,res)=> {
    res.render('sellerlogin');
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// View Seller




exports.view1 = (req, res) => {
    // Seller - connection 
    const sellerId = req.user.id;
    db.query('SELECT * FROM seller WHERE status = "active"', (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        let removedUser = req.query.removed;
        res.render('seller', { rows, removedUser });
      } else {
        console.log(err);
      }
      console.log('The data from seller table: \n', rows);
    });
  }

router.get('/sellerrecord', sellerController.isLoggedIn, async (req, res) => {
    try {
      const sellerId = req.user.id;

      db.query('SELECT * FROM seller WHERE id = ?', [sellerId],(err, rows) => {
        // When done with the connection, release it
        if (!err) {
            res.render('sellerrecord', { rows });
        } else {
          console.log(err);
        }
        console.log('The data from seller table: \n', rows);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  


  

router.get('/sellerprofile', sellerController.isLoggedIn, (req,res) =>{
    if (req.user ) {

        res.render('sellerprofile', {
            user: req.user
        });
    }
    else {
        res.redirect('/sellerlogin');
    }
});

// BUYER


router.get('/buyerregister',(req,res)=> {
    res.render('buyerregister');
});
router.get('/buyerlogin',(req,res)=> {
    res.render('buyerlogin');
});

router.get('/buyerprofile', buyerController.isLoggedIn, (req,res) =>{
    if (req.user ) {

        res.render('buyerprofile', {
            user: req.user
        });
    }
    else {
        res.redirect('/buyerlogin');
    }
});

// MUNCIPALITY

router.get('/muncipality', muncipalityController.view);
router.post('/muncipality', muncipalityController.find);
router.get('/editmuncipality/:id', muncipalityController.edit);
router.post('/editmuncipality/:id', muncipalityController.update);
router.get('/muncipality/:id',muncipalityController.delete);


router.get('/muncipalityregister',(req,res)=> {
    res.render('muncipalityregister');
});
router.get('/muncipalitylogin',(req,res)=> {
    res.render('muncipalitylogin');
});

router.get('/muncipalityprofile', muncipalityController.isLoggedIn, (req,res) =>{
    if (req.user ) {

        res.render('muncipalityprofile', {
            user: req.user
        });
    }
    else {
        res.redirect('/muncipalitylogin');
    }
});


router.get('/muncipalityrecord', muncipalityController.isLoggedIn, async (req, res) => {
    try {
      const muncipalityId = req.user.id;

      db.query('SELECT * FROM muncipality WHERE id = ?', [muncipalityId],(err, rows) => {
        // When done with the connection, release it
        if (!err) {
            res.render('muncipalityrecord', { rows });
        } else {
          console.log(err);
        }
        console.log('The data from muncipality table: \n', rows);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  

module.exports = router;