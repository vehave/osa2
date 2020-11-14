import React from 'react'

    const Course = (props) => {
    return (
      <div>
        <Header name={props.course.name}/>
        <Content parts={props.course.parts} />
        <Total arvot={props.course.parts.map(arvo => arvo.exercises)}/>
      </div>
    )
  }
  const Content = (props) => {
    return (
      <div>
        <ul>
          {props.parts.map(part => 
            <li key={part.id}>{part.name}: {part.exercises} tehtävää         
            </li>       
            )}
        </ul>
      </div>
    )
  }
  
  const Total = (props) => {
    let total = props.arvot.reduce( (s, p) => s+p,0 )
    return (
      <div>
        <p>
          Yhteensä {total} tehtävää
        </p>
      </div>
    )
  }
  
  
  const Header = (props) => {
    return (
      <div>
        <h2>
          {props.name}
        </h2>
      </div>
    )
  }

export default Course  
  