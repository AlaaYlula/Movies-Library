'use strict';

require('dotenv').config(); // For the Kye and port# & databaseName
const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Read From API

const pg = require('pg'); // 1st

//2nd create database

const client = new pg.Client(process.env.DATABASE_URL); // 3rd 


const app = express();
app.use(cors());
app.use(express.json()); // to parse the body content to JSON Format

app.get('/trending',handelTrending);
app.get('/search',handelSearch);
app.get('/popular',handlePopular)
app.get('/toprated',handleTopRated)


app.post('/addMovie',handelAddMovie);  // Task13
app.get('/getMovies',handleGetMovies);//Task13
//app.get('/error',handleNotServer)

app.use('*',handelNotFound);
//app.use(errorHandler)

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
   // let name="Riverdance";
    let name = req.query.name;// take the movie name from user in URL as ?query=name
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
///////////////////////// Task 13 
// 5th create a table in database "moviesadded" >> file schema.sql
//connect the table with data base : psql -d moviesadded -f schema.sql
//Then : 
function handelAddMovie(req,res){
    let movie = req.body ; 
    //console.log(req.body);
  let sql = `INSERT INTO favMovies(title,release_date,vote_count,poster_path,overview,comments) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`
  let values=[movie.title,movie.release_date,movie.vote_count,movie.poster_path,movie.overview,movie.comments];
  client.query(sql,values).then(data =>{
      res.status(200).json(data.rows);
  }).catch(error=>{
      errorHandler(error,req,res)
  });

}


function handleGetMovies(req,res){

    let sql = `SELECT * FROM favMovies;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}


/////////////////////////

///////////////////////// Errors Functions ///////////////////

function handelNotFound(req,res){

    let obj = new Error(404,"Sorry, something went wrong, page not found error");
    res.status(404).send(obj)
    
}
function errorHandler(err,req,res) /// Handle 500 Eroor 500 /////
{
    
        let obj = new Error(500,`${err}`);
        res.status(500).send(obj)
      
}
////////////////////////////////// Server
client.connect().then(()=>{ // 4th Connect to client
 app.listen(PORT, ()=>{
    console.log(`listinig to port ${PORT}`);
  
}) ;
});

