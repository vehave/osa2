import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Countries = (props) => {    
  if(props.countries.length>10){
    return(
      <div>
       Too many matches, specify another filter
      </div>  
    )
  }

  if(props.countries.length>1 && props.countries.length<=10){
    return(
      <div>
              {props.countries.map(country =>           
              <Country key={country.id} country={country} />       
               )}
      
      
    </div>   
    )
  }

  if(props.countries.length===1){
    return(
      <div>
              {props.countries.map(country =>           
              <CountryFull key={country.id} country={country} />       
               )}
      
      
    </div>   
    )
  }
  else{
    return(
     <div>No matches</div>
    )
  } 
 }

const Country = (props) => {    
  const [showDetails, setShowDetails] = useState(false)

  const handleClick = (event) => {    
    setShowDetails(true)
   
  }
  if(showDetails===false){
    return(
    
      <div>{props.country.name} 
      <button onClick={handleClick}>show</button> 
      
      </div>
      
    ) 
  }
  else{
    return(
    
      <CountryFull  country={props.country} /> 
      
    ) 
  }
  
 } 

const Weather = ({capital}) => {
  const [weather, setWeather] = useState({location:{}, current: {}});
  const [loading, setLoading] = useState(true);
  const key = 'd8c7c833a9ffa26746002ccdec3672a2'
  const url = `http://api.weatherstack.com/current?access_key=${key}&query=${capital}`

  useEffect(() => {
    axios.get(url)
    .then(response => {
      console.log('promise fullfilled')
      setLoading(false);
      setWeather(response.data)
    })
  }, [])

  return loading ? <p>Loading...</p> : (
    <div>
      <h3>Weather in {weather.location.name}</h3>
      <p>temperature: {weather.current.temperature} </p>
      <img src = {weather.current.weather_icons} />
      <p>wind: {weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
    </div>
  )
}

const CountryFull = (props) => {    
  

  return(
      <div>
      <h2>{props.country.name} </h2>
      <p>capital {props.country.capital}</p>
      <p>population {props.country.population}</p>
      <h4>Spoken languages</h4>
      <ul>
        {props.country.languages.map(language =>           
              <li key={language.name}>{language.name}</li>        
               )}
      </ul>
      <img
      src={props.country.flag}
      style={{width:245,height:150}} 
      />
      <Weather capital={props.country.capital}/>
      </div>
     
  ) 
}  

const Filter = (props) => {    
  
  return(
    
      <div>
        {props.text}
        <input 
          onChange={props.onChange}          
          type="text"
          value={props.value}
          
        
          
          
          />
      </div>
     
  ) 
} 



const App = () => {
  
  const [ countries, setCountries] = useState([])

  const [showAll, setShowAll] = useState(true)

  const [ search, setSearch ] = useState('')

  const countriesToShow = showAll
    ? countries
    : countries.filter(country => country.name.includes(search))


  useEffect(() => {    
    console.log('effect')    
    axios      
    .get('https://restcountries.eu/rest/v2/all')      
    .then(response => {        
      console.log('promise fulfilled')        
    setCountries(response.data)      
    })  
  }, 
[])  
  console.log('render', countries.length, 'countries')

  const handleFilter = (event) => {    
    setShowAll(false)
    console.log(event.target.value)    
    setSearch(event.target.value) 
  }

  return (
    <div>
      
      
      <Filter 
      onChange={handleFilter} 
      value={search} 
      text='Filter to show with'  
      />
      
      <Countries
        countries={countriesToShow}        
      />
    </div>
  );
}

export default App;
