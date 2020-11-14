
import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Succeed = ({ message }) => {
  
  
  if (message === null) {
    return null
  }

  return (
    <div style={{backgroundColor: "lightblue", color: "green", border: "solid"}}>
      {message}
    </div>
  )
}

const Failed = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={{backgroundColor: "lightblue", color: "red", border: "solid"}}>
      {message}
    </div>
  )
}

const Person = ({person, deletePerson}) => {    
  
  return(
    
      <div>
        {person.name} {person.number}
        <button style={{backgroundColor: "pink", color: "white", border: "solid"}} onClick={deletePerson}>delete</button>
        </div>
     
  ) 
  
}  
  

const Filter = (props) => {    
  
  return(
    
      <div>
        {props.text}
        <input 
          style={{backgroundColor: "white", color: "blue", border: "solid"}}
          onChange={props.onChange}          
          type="text"
          value={props.value}
          
        
          
          
          />
      </div>
     
  ) 
} 

const PersonForm = (props) => {    
  
  return(
    
      <div>
        <form onSubmit={props.onSubmit}>
        <div>
          {props.text1} 
          <input 
          style={{backgroundColor: "white", color: "blue", border: "solid"}}
          value={props.value1}
          onChange={props.onChange1}
          />
        </div>
        <div>
          {props.text2}
          <input 
          style={{backgroundColor: "white", color: "blue", border: "solid"}}
          value={props.value2}
          onChange={props.onChange2}
          />
        </div>
        <div>
          <button style={{backgroundColor: "pink", color: "white", border: "solid"}} type="submit">{props.text3}</button>
        </div>
      </form>
      </div>
     
  ) 
}

 const App = () => {
  const [ persons, setPersons] = useState([]) 
  
  const [ newName, setNewName ] = useState('')

  const [ newNumber, setNewNumber ] = useState('')

  const [showAll, setShowAll] = useState(true)

  const [ search, setSearch ] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)

  const [succeedMessage, setSucceedMessage] = useState(null)

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.includes(search))


  useEffect(() => {
      personService      
      .getAll()      
      .then(returnedPersons => {        
        setPersons(returnedPersons)     
       })  
      }, 
    [])  
  console.log('render', persons.length, 'persons')

  const handleChange = (event) => {    
    console.log(event.target.value)    
    setNewName(event.target.value) 
  }

  

  const handleNumberChange = (event) => {    
    console.log(event.target.value)    
    setNewNumber(event.target.value) 
  }

  const handleFilter = (event) => {    
    setShowAll(false)
    console.log(event.target.value)    
    setSearch(event.target.value) 
  }

  const deletePerson = person => {
    const id = person.id
    if(window.confirm(`Delete ${person.name}?`)){
      personService      
        .deletePerson(id)      
        .then(res => {        
          console.log(res)

          const updated = persons.filter(person => person.id !==id)
          setPersons(updated) 
          setSucceedMessage(          
            `Deleted ${person.name}`        
            )        
            setTimeout(() => {          
              setSucceedMessage(null)        
            }, 3000)       
              
      })
    }
    
  }
  

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
      
    }
    let found = false;
    let id = -100;
    for(let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        found = true;
        id = persons[i].id
        break;
      }
    }

    if(found === true){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with the new one`)){
        personService      
        .update(id, person)      
        .then(returnedPerson => {        
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))        
          setSucceedMessage(          
            `The old number of ${newName} has replaced with the new one`        
            )        
            setTimeout(() => {          
              setSucceedMessage(null)        
            }, 3000)
          setNewName('')
          setNewNumber('')     
        })
        .catch(error => {
          setErrorMessage(          
          `Information of ${newName} has already removed from server`        
          )        
          setTimeout(() => {          
            setErrorMessage(null)        
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))
        })
      }
    }
    else{
      personService      
      .create(person)      
      .then(returnedPerson => {        
        setPersons(persons.concat(returnedPerson)) 
        setSucceedMessage(          
          `Added ${newName}`        
          )        
          setTimeout(() => {          
            setSucceedMessage(null)        
          }, 3000)       
        setNewName('')
        setNewNumber('')     
      })
      .catch(error => {
        
        setErrorMessage(          
          error.response.data.error       
          )  
          console.log(errorMessage)      
          setTimeout(() => {          
            setErrorMessage(null)        
          }, 3000)
      })

    }
    
  }

  return (
    <div style={{backgroundColor: "lightblue", color: "white", class: "w3-container"}}>
    <div style={{backgroundColor: "lightblue", color: "white", class: "w3-content"}}>
      <Succeed message={succeedMessage} />
      <Failed message={errorMessage} />
      <h2>Phonebook</h2>
      
      <Filter onChange={handleFilter} value={search} text='Filter to show with'
        
        
      />
    </div>
    <div style={{backgroundColor: "lightblue", color: "white", class: "w3-content"}}>  
      <h2>Add a new</h2>
      <PersonForm onSubmit={addPerson} text1="name:" value1={newName} onChange1={handleChange} text2="number:" value2={newNumber} 
        onChange2={handleNumberChange} text3="add"/>
    </div>
    <div style={{backgroundColor: "lightblue", color: "white", class: "w3-content"}}>  
      <h2>Numbers</h2>
      
      {personsToShow.map(person => 
          <Person
            key={person.id}
            person={person} 
            deletePerson={() => deletePerson(person)} /> )}
      
    </div>
    </div>
  )

}

export default App

