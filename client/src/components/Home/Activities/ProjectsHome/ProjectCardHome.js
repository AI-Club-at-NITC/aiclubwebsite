import React from 'react';
import { NavLink } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import 'html-to-text'

const ProjectCardHome = ({project}) => {
  return (
        <div className='project-card-home-container mt-3'>
          <div id='title'>
            <h5>{project.title}</h5>
          </div>
          <div className='speakers'>
            <p>by {project.authors.join(', ')} </p>
            <NavLink to={`/projects/${project.url}`}><p>Learn More<span className='small'> ❯</span></p></NavLink>
          </div>
        </div>
  )
}

export default ProjectCardHome