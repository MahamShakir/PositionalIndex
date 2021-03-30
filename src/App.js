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
import { WrapText } from '@material-ui/icons';
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
    let i,j;
    let inter_result = []
    setResult("...processing")

    /* ***tokenise query similar to that for dictionary*** */
    let query = input.toLowerCase().split(" ");
    for(i in query){
      query[i] = query[i].replace(/[.,'—’‘ªã©¯\/#!@?$%\^&\*;:{}=\-_`~]/g,"");
      query[i] = query[i].replace(/\s{2,}/g," ");
      query[i] = query[i].replace(/[(]/g, "( ");
      query[i] = query[i].replace(/[)]/g, " )");
      query[i] = pluralize.singular(query[i])
    }
    //remove empty spaces
    query = query.filter(e => e != "")
    //split "(" and ")" for expression handling
    for (i in query){
      query[i] = query[i].split(" ")
    }
    //flatten [ [], [] ..] to [ ]
    query = query.flat(1);
    //remove redundancies
    query = query.filter(e => e != "")

    /* ***Query Processing*** */
    //start with building postfix expression of the query
    let operators = {}; //object to store boolean precedence
    operators['('] = 0;
    operators[')'] = 0;
    operators['or'] = 1;
    operators['and'] = 2;
    operators['not'] = 3;

    let complement = []; //helper for NOT query
    for (i=1;i<=50;i++){
      complement[i-1] = i;
    }

    let curr_op; //helpers for postfix notation
    let inter_query = []; 
    let result_stack = [];
    let postfix_query = []; //final result of postfix

    for(i of query){
      if(i == '('){
        inter_query.push(i);
      }

      else if(i == ')'){
        curr_op = inter_query.pop();
        while( curr_op != '('){
          postfix_query.push(curr_op);
          curr_op = inter_query.pop();
        }
      }

      else if(i in operators){
        if(inter_query){
          curr_op = inter_query[inter_query.length - 1]
          while(inter_query && operators[curr_op] > operators[i]){
            postfix_query.push(inter_query.pop());
            if(inter_query){
              curr_op = inter_query[inter_query.length - 1];
            }
          }
        }
        inter_query.push(i);
      }

      else{
        postfix_query.push(i);
      }
    }

    while(inter_query.length != 0){
      postfix_query.push(inter_query.pop());
    }      

    //postfix_query now has the updated form of original query in postfix notation
    console.log(postfix_query);

    //process the postfix notation
    while(postfix_query.length != 0){
      inter_result = []; //re-initialise it empty
      let element = postfix_query.shift();
      
      if(element == 'not'){
        let word = result_stack.pop();
        inter_result = complement.filter(value =>  !word.includes(value))
      }

      else if(element == 'and'){
        let word1 = result_stack.pop();
        let word2 = result_stack.pop();
        inter_result = word1.filter(value => word2.includes(value));
      }

      else if(element == 'or'){
        let word1 = result_stack.pop();
        let word2 = result_stack.pop();
        inter_result = [...new Set([...word1, ...word2])];
      }

      else if(typeof parseInt(postfix_query[1]) ==='number' && (parseInt(postfix_query[1]%1))===0){
        let element2 = postfix_query.shift();
        let proximity = parseInt(postfix_query.shift()) + 1;
        let word1 = pos_index[element];
        let word2 = pos_index[element2];
        if(word1 && word2){
          for(i of word1){
            for(j of word2){
              if(i[0] != j[0])  continue;
              
              let distance = Math.abs(i[1] - j[1]);
              if(distance && distance == proximity){
                inter_result.push(i[0]);
              }
            }
          }
        }
        inter_result = [...new Set(inter_result)];
      }

      else {
        let word = pos_index[element]
        if(word){
          for(i of word){
            if(!inter_result.includes(i[0]))
              inter_result.push(i[0]);
          }
        }
      }
      result_stack.push(inter_result);
    }

    if(result_stack.length != 1)  setResult("Invalid Query, Please Rephrase with Proper Operators");
    else if(result_stack[0].length == 0) setResult("No Documents Available, Please Rephrase Query")
    else{
      result = result_stack[0].sort((a,b) => a - b).join(" , ");
      setResult(result);
    }  
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <Grid container spacing={3} alignItems="center" justify="center" style={{margin:"auto"}}>
        <Typography variant="h3" style={{textAlign:"center" , color:"#3f51b5" , marginTop: "20%" }} >Story Retriever</Typography>
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
          <TextField id="search-field" label="Enter Query" fullWidth="true" onChange={handleInput} onKeyPress={(e) => { if(e.key === 'Enter') handleClick()}} />
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
            <CardContent style={{overflowWrap:"break-word"}}>
              <Typography variant="button" style={{fontSize:"18px"}} >{result}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
