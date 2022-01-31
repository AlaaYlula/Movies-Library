'use strict';

require('dotenv').config(); // For the Kye and port#
const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Read From API

const app = express();
app.use(cors());


app.get('/trending',handelTrending);
app.get('/search',handelSearch);
app.get('/popular',handlePopular)
app.get('/toprated',handleTopRated)

//app.get('/error',handleNotServer)

app.use('*',handelNotFound);
//app.use(errorHandler)

let name="Riverdance";
let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;

function Trending(id,title,release_date, poster_path,overview){
    this.id= id;
    this.title=title
    this.release_date = release_date;
    this.poster_path=poster_path;
    this.overview = overview;
 }
 
 function Error(status,responseText){
     this.status = status ;
     this.responseText = responseText
 }

function handelTrending(req,res){

    axios.get(url)
    .then(result=>{
       // console.log(result.data); // Array 
        let trendingMovie = result.data.results.map(movie =>{
            return new Trending(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        return res.status(200).json(trendingMovie);  
     }).catch(err=>{
       errorHandler(err)
    })    
}

function handelSearch(req,res){
    
    let url=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${name}`
    axios.get(url)
    .then(result=>{
        let searchMovie = result.data.results.map(movie =>{
            return new Trending(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(searchMovie);  
     }).catch(err=>{
        errorHandler(err)

    })

}

function handlePopular(req,res){
    let url=`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.APIKEY}&language=en-US&page=1`;
    axios.get(url)
    .then(result=>{
        let popularMovie = result.data.results.map(movie =>{
            return new Trending(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(popularMovie);  
     }).catch(err=>{
        errorHandler(err,req,res)

    })
}

function handleTopRated(req,res){
    let url=`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}&language=en-US&page=1`;
    axios.get(url)
    .then(result=>{
        let topratedMovie = result.data.results.map(movie =>{
            return new Trending(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(topratedMovie);  
     }).catch(err=>{
        errorHandler(err,req,res)

    })
}

function handelNotFound(req,res){

    let obj = new Error(404,"Sorry, something went wrong, page not found error");
    res.status(404).send(obj)
    
}
function errorHandler(err,req,res) /// Handle 500 Eroor 500 /////
{
    
        let obj = new Error(500,`${err}`);
        res.status(500).send(obj)
      
}

 app.listen(PORT, ()=>{
    console.log(`listinig to port ${PORT}`);
  
}) 


