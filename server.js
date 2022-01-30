'use strict';

const express = require('express');
const cors = require('cors');
const movieData = require('./Movie Data/data.json');
const { status } = require('express/lib/response');

const app = express();
app.use(cors());


app.get('/',handelHomePage);
app.get('/favorite',handelfavorite);
app.get('*',handelNotFound);

function Favorite(title,poster_path, overview){
    this.title= title;
    this.poster_path = poster_path;
    this.overview=overview;
    
 }
 
 function Error(status,responseText){
     this.status = status ;
     this.responseText = responseText
 }

function handelHomePage(req,res){
   
    let obj =  new Favorite(movieData.title,movieData.poster_path,movieData.overview);
    res.status(200).json(obj);
}

function handelfavorite(req,res){
    
    res.status(200).send("Welcome to Favorite Page ");

}

function handelNotFound(req,res){

    let obj = new Error(404,"Sorry, something went wrong,page not found error");
    res.status(404).send(obj)
}


app.listen(3500, ()=>{
    console.log("listinig to port 3500");
})