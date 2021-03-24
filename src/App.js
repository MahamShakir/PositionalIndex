import React , { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FindInPage from '@material-ui/icons/FindInPage';
import Search from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import 'fontsource-roboto';
var pluralize = require('pluralize')


function App() {
  let [input, setInput] = useState("");
  let [result, setResult] = useState("NaN");
  let [pos_index, setPosIndex] = useState([])

  const getData = () => {
    fetch('data.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(myJson) {
        setPosIndex(myJson)
      });
  }

  function handleInput(e){
    setInput(e.target.value)
  }

  function handleClick(){
    let i;
    setResult("...processing")
    let query = input.toLowerCase().split(" ");
    for(i in query){
      query[i] = query[i].replace(/[.,'—’‘ªã©¯\/#!@?$%\^&\*;:{}=\-_`~()]/g,"");
      query[i] = query[i].replace(/\s{2,}/g," ");
      query[i] = pluralize.singular(query[i])
    }
    console.log(query)

    let inter_result = []

    //search for 1 word query
    if(query.length == 1){
      let word = pos_index[query[0]]
      if(word){
        for(i=0; i<word.length; i++){
          inter_result.push(word[i][0]);
        }
        result = [...new Set(inter_result)]
        setResult(result.join(" ,"))
      }
      else{
        setResult("No Document - Please Rephrase Query")
      }
    }
    //search for proximity query
    else if(typeof parseInt(query[query.length - 1]) ==='number' && (parseInt(query[query.length - 1]%1))===0){
      let word1, word2;
      let proximity = parseInt(query[query.length - 1]);
      if(query.length === 4 && query[1] === "and"){
        word1 = pos_index[query[0]];
        word2 = pos_index[query[2]];
      }
      else{
        word1 = pos_index[query[0]];
        word2 = pos_index[query[1]];
      }
      if(word1 && word2){
        for( i of word1) console.log(i[1])

        for(i=0; i<word1.length; i++){
          inter_result.push(word1[i][0]);
        }
        let set1 = new Set(inter_result);
        inter_result = [];

        for(i=0; i<word2.length; i++){
          inter_result.push(word2[i][0]);
        }
        let set2 = new Set(inter_result);
        inter_result = [];

        let intersect = new Set();
        for(i of set1){
          if(set2.has(i)){
            intersect.add(i);
          } 
        } 

        // for( i in intersect){
          
        // }

      }
      else{
        setResult("No Document - Please Rephrase Query")
      }
    }


  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <Grid container spacing={3} alignItems="center" justify="center" style={{margin:"auto"}}>
        <Typography variant="h3" style={{textAlign:"center" , color:"#3f51b5" , marginTop: "20%" }} >Boolean Retrieval Model</Typography>
        <div style={{ marginTop:10 ,height:"1px" , width:"100%", backgroundColor:"gray"}}>
        </div>
        <Grid item xs={12} >
        </Grid>
        <Grid item xs={12} >
        </Grid>
        <Grid item  >
          <FindInPage/>
        </Grid>
        <Grid item alignItems="center" justify="center" xs={8}>
          <TextField id="search-field" label="Enter Query" fullWidth="true" onChange={handleInput} />
        </Grid>
        <Grid item xs={12} >
        </Grid>
        <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        size="medium"
        startIcon={<Search />}>
        Search
        </Button>
        <div style={{ marginTop:20 , height:"1px" , width:"100%", backgroundColor:"gray"}}>
        </div>

        <Grid item xs={11} style={{marginTop:15}}>
          <Typography variant="button" style={{color:"#3f51b5", fontWeight:"bold"}}>Result Set:</Typography>
          <Card variant="outlined" style={{backgroundColor:"#e0e0e6"}}>
            <CardContent>
              <Typography variant="button" style={{fontSize:"18px"}} >{result}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
