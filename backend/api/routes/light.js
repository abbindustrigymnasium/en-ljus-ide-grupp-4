/*const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "ljuside4",
    password:"rakvatten",
    database: "ljuside4"
});

var cron = require('node-cron');
 
cron.schedule('*10 * * * * *', () => {

    var GetLight = function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM lampa", function (err, result){
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    GetLight().then(response =>{
        Values_fromDB= response;
    })
});

con.connect(function (err) {
    if (err) throw err;
});

/*router.get('', (req, res)=> {
    console.log("Hej");
    res.status(200).json({message:"Hej"});
});

router.get('/:lampaNamn', (req, res) => {
    var found=false;
    var Outputvalue
    Values_fromDB.forEach(element => {
        if (element.Namn == req.params.lampaNamn) {
            found = true;
            Outputvalue = element;

        }
    });
    if (found!= true) {
    res.status(200).json({Namn: "none",
    message: "Lampan existerar inte"});
    }
    else
    {
        res.status(200).json(Outputvalue);
        console.log(Outputvalue);
    }  
});


router.post('/', (req, res) => { 
    const ljuspost=[req.body.Namn, req.body.Styrka, req.body.Mode

    ];

    var createProduct = function(){ 
        return new Promise(function(resolve,reject){ 
            console.log(ljuspost);
            con.query('INSERT INTO lampa(Namn, Styrka, Mode) VALUES ?',[[ljuspost]], function(err,result) {
      
              if(err)               
                  return reject(err);
              
              else
                           
                  return resolve(ljuspost);

      
          }); 
        }) 
      }

    createProduct().then( ljuspost => {console.log(ljuspost);
        res.status(200).json({ 
            message: "Ny lampa skapad" 
    });
    
    
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/', (req, res, next) => {



    var UpdateProduct = function(){
        return new Promise(function(resolve,reject){
            
            const ljusupd=[req.body.Namn, req.body.Styrka, req.body.Mode

            ];

            con.query("UPDATE `lampa` SET `Styrka`=? , `Mode`= ? WHERE `Namn` =  ?",[ljusupd.Styrka , ljusupd.Mode, ljusupd.Namn], function (err, result, fields) {
      
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); 
        }); 
      } 

      UpdateProduct().then( result => {
          console.log(result);
        if (result.affectedRows>=1) {
            res.status(200).json(result);
        }
        else
        res.status(200).json({message: "Kan inte uppdatera"}); 
       }).catch(err => {
      res.status(500).json({
          error: err
      });
  });
  
});

router.delete('/:lampaNamn', (req, res, next) => {


    var RemoveProduct = function(){
        return new Promise(function(resolve,reject){
            const Namn = req.params.lampaNamn;
            con.query("DELETE FROM lampa WHERE `Namn` = ?", [Namn], function (err, result, fields) {
      
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
          res.status(200).json({message: "Kan inte radera"}); 
         }).catch(err => {
        res.status(500).json({
            error: err
        });
});

});
var Values_fromDB;
module.exports = router;
*/