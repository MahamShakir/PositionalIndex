import React , {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FindInPage from '@material-ui/icons/FindInPage';
import Search from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography';
import 'fontsource-roboto';

function App() {
  let [input, setInput] = useState("");
  let [result, setResult] = useState("");
  let [pos_index, setPosIndex] = useState({})

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
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setPosIndex(myJson)
      });
  }

  function handleInput(e){
    setInput(e.target.value)
  }

  function handleClick(){
    console.log(input);
    getData()
  }


  return (
    <div className="App">
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
        </Grid>
      </div>
      
    </div>
  );
}

export default App;
