const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


// View Seller
exports.view = (req, res) => {
    // Seller - connection 
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
  
  // Find seller by Search
  exports.find = (req, res) => {
    let searchTerm = req.body.search;
    // seller - connection
   db.query('SELECT * FROM seller WHERE (name LIKE ? OR address LIKE ?) AND status = ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', 'active'], (err, rows) => {
      if (!err) {
        res.render('seller', { rows });
      } else {
        console.log(err);
      } 
      console.log('The data from seller table: \n', rows);
    });
  }
  

// Edit seller
exports.edit = (req, res) => {
    // seller - connection
    db.query('SELECT * FROM seller WHERE id = ?', [req.params.id], (err, rows) => {
      if (!err) {
        res.render('seller-edit', { rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }
  
  
  // Update User
  exports.update = (req, res) => {
    const { name, email, wastetype, quantity, address, phone } = req.body;
    // seller - connection
    db.query('UPDATE seller SET name = ?, email = ?, wastetype =?, quantity =?, address = ?, phone = ? WHERE id = ?', [name, email, wastetype, quantity, address, phone, req.params.id], (err, rows) => {
  
      if (!err) {
        // Seller - connection
        db.query('SELECT * FROM seller WHERE id = ?', [req.params.id], (err, rows) => {
          // When done with the connection, release it
          
          if (!err) {
            res.render('seller-edit', { rows, alert: `${name} has been updated.` });
          } else {
            console.log(err);
          }
          console.log('The data from user table: \n', rows);
        });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }
  
  


// Delete User
exports.delete = (req, res) => {

    //Delete a record

  // Buyer - connection
  db.query('DELETE FROM seller WHERE id = ?', [req.params.id], (err, rows) => {

    if(!err) {
      res.redirect('/sellerregister');
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);

  });


}
    


exports.login = async (req,res) => {

    try {
        const { email,password } = req.body;
        if (!email || !password) {
            return res.status(400).render('sellerlogin', {
                message: 'Please provide an email and password'
            })
        }
       
        db.query('SELECT * from seller where email = ?', [email] ,async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password ))) {
               res.status(401).render('sellerlogin', {
                    message: 'Email or password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({id},process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24* 60 * 60 *1000


                    ),
                    httpOnly: true

                }
                res.cookie('jwt', token , cookieOptions );
                res.status(200).redirect("/sellerprofile");
            }
        })

    } catch (error) {
        console.log(error);
    }
}




exports.register = (req,res) => {
    console.log(req.body);

    const { name,email,wastetype,quantity,address,phone,password,passwordConfirm } = req.body;

    
    db.query('SELECT email FROM seller WHERE email = ?',[email], async (error,results) =>{
        if(error) {
            console.log(error);
        }
        if(results.length >0) {
            return res.render('sellerregister',{
                message: 'That email is already in use'
            })
       }
     if (password !==passwordConfirm) {
            return res.render('sellerregister',{
                message: 'Passwords do not match'
        });

    }


    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
   

    db.query('INSERT INTO seller SET ?', {name: name,email: email,wastetype: wastetype,
        quantity: quantity, address: address,phone: phone, password: hashedPassword}, (error, results) => {

        if(error) {
            console.log(error);

        } else {
            console.log(results);
            return res.render('sellerregister',{
                message: 'User Registered'
            });
        }
    })

    } ) ;
}


exports.isLoggedIn = async (req,res,next) => {

    //console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            // 1) verify the taken
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
                );
                console.log(decoded);
            // 2) Check if the user still exist
            db.query('SELECT * FROM seller WHERE id = ?', [decoded.id], (error,result ) => {
                console.log(result);
                if(!result) {
                    return next();
                }
                req.user = result[0];
                return next()
            })
            
        } catch (error) {
            return next();
        }
    }
    else {
        next(); 
    }
   

} 

exports.logout = async (req,res) => {
    res.cookie('jwt', 'logout' , {
        expires: new Date(Date.now() + 2*1000), 
        httpOnly: true
    });

res.status(200).redirect('/sellerregister');
}