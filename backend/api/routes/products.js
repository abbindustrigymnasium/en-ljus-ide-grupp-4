const express = require('express');
const  router = express();

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store"
});
con.connect(function(err) {
    if (err) throw err;
    else
    console.log("Fungerar");

});

router.get('/', (req, res, next) => {

    console.log(req.body);

    con.query("SELECT * FROM products", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.status(200).json({
        message: 'Tar in värden',
        result: result});
    });

 	
});





router.post('/', (req, res) => { 
    const product={
        name: req.body.name,
        price: req.body.price
    }
console.log(req.body);
console.log(req.body.name);
    if(req.body.name==null){ 
        
    product.name= req.body[0].name; 
    product.price= req.body[0].price; 
    }
    console.log(req.body); 
    var createProduct = function(){ 
        return new Promise(function(resolve,reject){ 
           
            con.query('INSERT INTO products (name, price) VALUES ?',[[[product.name,product.price]]], function(err,result) {
      
              if(err){                
                  return reject(err);
              }
              else
              {              
                  return resolve(product);
              }
      
          }); 
        }); 
      } 

      createProduct().then( Theproduct => {
        res.status(200).json({ 
            message: "New product created" 
    });
    
    
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.get('/:productName', (req, res, next) => {
 
                    
    const Name = req.params.productName;
 
    var getProduct = function(){
        return new Promise(function(resolve,reject){
            con.query("SELECT * FROM products  WHERE `name` = ?", [Name], function (err, result, fields) {
      
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); 
        }); 
      } 

    getProduct().then( result => {
        if(result.length!=0)
        res.status(200).json(result);
        else
        res.status(404).json({message: 'No such value exist'});

    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
    
});

router.patch('/:productName', (req, res, next) => {



    var UpdateProduct = function(){
        return new Promise(function(resolve,reject){
            
            const product={
                name: req.body.name,
                price: req.body.price
            }
            con.query("UPDATE `products` SET `price`= ? WHERE `name` =  ?",[product.price , product.name], function (err, result, fields) {
      
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); 
        }); 
      } 

      UpdateProduct().then( result => {
        if (result.affectedRows>=1) {
            res.status(200).json(result);
        }
        else
        res.status(200).json({message: "Update imposible"}); 
       }).catch(err => {
      res.status(500).json({
          error: err
      });
  });
  
});

router.delete('/:productName', (req, res, next) => {


    var RemoveProduct = function(){
        return new Promise(function(resolve,reject){
            const Name = req.params.productName;
            con.query("DELETE FROM products WHERE `name` = ?", [Name], function (err, result, fields) {
      
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); 
        });
      } 


      
      RemoveProduct().then( result => {
          if (result.affectedRows>=1) {
              res.status(200).json(result);
          }
          else
          res.status(200).json({message: "Delete impossible"}); 
         }).catch(err => {
        res.status(500).json({
            error: err
        });
});


});

module.exports = router;