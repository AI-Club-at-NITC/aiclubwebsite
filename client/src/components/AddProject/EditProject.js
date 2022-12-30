import React, { useRef, useState, useMemo, useContext, useEffect } from 'react';
import './AddProject.css';
import JoditEditor from 'jodit-react';
import { Context } from '../../Context/Context';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { editorConfig } from './Params/editorConfig';
import Error from '../Error';
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';
import Loading from '../Loading';

const EditProject = () => {
  const {url} = useParams();
  const editor = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(Context);
    
  const [ add, setAdd ] = useState('Save as Draft');
  const [ add2, setAdd2 ] =useState();
  const [ xauthor,setXAuthor ] = useState('');
  const [ xtag,setXTag ] = useState('');
  const [ proj, setProj ] = useState();
  const [ load, setLoad ] = useState(0);
  const [ preview, setPreview ] = useState(false);
  const [ teams, setTeams ] = useState([]);
  let team=[];
  let project=null;
  const getProject = async () =>{
    // getTeams
    try{
      axios.get(`${SERVER_URL}/getTeams`)
      .then(data=>{
        team=data.data;
        setTeams(team);
      })
    }catch(err){
      console.log(err);
    }
    // getProject
    try{
      axios.get(`${SERVER_URL}/getProjectEdit/${url}`)
      .then(async data => {
        if(data.status===200){
          project=data.data;
          if(user && project.authors.indexOf(user.username)>-1){
            await Promise.all(project.authors.map((author)=>{
              team = team.filter(t=>t!==author);
            }));
            setTeams(team);
            setProj(project);
            console.log('project',project);
            console.log('team',team);
            setLoad(1);
          }
          else{
            setLoad(-1);
          }
        }
        else{
          setLoad(-1);
        }
      })
    }catch(err){
      console.log(err);
    }
    
  }

  useEffect(()=>{
    getProject();
  },[user]);

  const handleValue = (e) => {
    setProj({...proj, ['content']:e});
    setPreview(false);
  }
  const handleInputs = (e) => {
    setProj({...proj, [e.target.name]:e.target.value});
    setPreview(false);
  }
  const removeXAuthor = (author) => {
    let current = proj.authors;
    current = current.filter(x => x!==author);
    setProj({...proj,['authors']:current});
    teams.push(author);
    setTeams(teams);
    setXAuthor('');
    setPreview(false);
  }
  const AddXAuthor = () => {
    if(xauthor!==""){
      team = teams.filter(t => t!==xauthor);
      setTeams(team);
      let current = proj.authors;
      current.push(xauthor);
      setProj({...proj,['authors']:current});
      setXAuthor('');
      setPreview(false);
    }
  }
  const removeXTag = (tag) => {
    let current = proj.tags;
    current = current.filter(x => x!==tag);
    setProj({...proj,['tags']:current});
    setXTag('');
    setPreview(false);
  }
  const AddXTag = () => {
    let current = proj.tags;
    current.push(xtag);
    setProj({...proj,['tags']:current});
    setXTag('');
    setPreview(false);
  }
  const UpdateProject = async (e) => {
    e.preventDefault();
    setAdd('Saving ');
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
    try{
      const projdata = await axios.put(`${SERVER_URL}/updateProject/${url}`,
      proj,
        {
            headers:{"Content-Type" : "application/json"}
        }
      );
      console.log('projdata',projdata);
      if(projdata.status===422 || !projdata){
          console.log('Project not found');
      }
      else{    
        setAdd('Save as Draft');
        setAdd2('');
        setPreview(true);
          // navigate('/team');
      }
    }catch(err){
        console.log('err',err);
    }
  }
  console.log('proj',proj);
  console.log('xauthor',xauthor);
  return (
    <>
      {load===0?<Loading />:
      load===1?
        <div className='container addproject-container py-3'>
              <h3 className='text-center'>Add Project</h3>
              <div className='text-center fs-6 pb-1'>
                {
                  preview?
                    <NavLink to={`/projects/${proj.url}`}>Preview</NavLink>
                  :
                    <span className='text-muted'>Save for Preview</span>
                }
              </div>
              
                <form method="POST" onSubmit={UpdateProject} encType="multipart/form-data">
                  <div className='row'>
                    <div className='col-12 col-md-9'>
                        <div className="form-group mb-1">
                          <label for="title">Project Title :</label>
                        </div>
                        <div className="form-group mb-4">
                          <input 
                            type='text' 
                            name="title" 
                            value={proj?proj.title:''} 
                            onChange={handleInputs} 
                            className="form-control" 
                            id="title" 
                            aria-describedby="title" 
                            placeholder="Enter Project Title" 
                          required/>
                        </div>
                        
                        <div className="form-group my-1">
                          <label>Project Tags :</label>
                        </div>
                        <div className="form-group my-2 row">
                          {proj &&
                            (proj.tags).map(a => {
                              return(
                                  <div className='col-12 col-sm-6 col-lg-4 mb-2 row'>
                                    <div className='col-8 paddr'>
                                      <input 
                                          type='text' 
                                          value={a} 
                                          className="form-control" 
                                          id="tag" 
                                          aria-describedby="tag" 
                                        disabled/>
                                    </div>
                                    <div className='col-4 paddl'>
                                      <input type="reset" className='btn btn-danger' onClick={() => removeXTag(a)} value="Remove" />
                                    </div>
                                  </div>
                              )
                            })
                          }
                            <div className='col-12 col-sm-6 col-lg-4 mb-2 row'>
                              <div className='col-8 paddr'>
                                <input 
                                    type='text' 
                                    name="xtag" 
                                    value={xtag} 
                                    onChange={(e) => setXTag(e.target.value)} 
                                    className="form-control" 
                                    id="tags" 
                                    aria-describedby="tags" 
                                    placeholder="Enter Project Title" 
                                  />
                                </div>
                                <div className='col-4 paddl'>
                                  <input type="reset" className='btn btn-success' onClick={AddXTag} value="+Add" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group my-1">
                          <label for="content">Project Content :</label>
                        </div>
                        <div className="form-group mb-4">
                          {/* {
                            useMemo( () => ( 
                              <JoditEditor name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> 
                            ),[proj.content])
                          } */}
                          <JoditEditor name="content" ref={editor} value={proj?proj.content:''} onChange={handleValue} /> 
                          {/* <Jodit name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> */}
                        </div>
                        
                    </div>
                    <div className='col-12 col-md-3'>
                        <div className="form-group my-1">
                          <label>Authors :</label>
                        </div>
                        {proj &&
                          (proj.authors).map(a => {
                            return(
                              <div className="form-group my-2 row">
                                <div className='col col-9'>
                                  <input 
                                      type='text' 
                                      value={a} 
                                      className="form-control" 
                                      id="author" 
                                      aria-describedby="title" 
                                    disabled/>
                                </div>
                                <div className='col col-3'>
                                {(user.username!==a && proj.creator!==a) && <input type="reset" className='btn btn-danger' onClick={() => removeXAuthor(a)} value="Remove" />}
                                </div>
                              </div>
                            )
                          })
                        }
                        <div className="form-group my-2 row">
                          <div className='col col-9'>
                            <select name="xauthor" value={xauthor} onChange={(e) => setXAuthor(e.target.value)} className="form-select" aria-label="authors">
                              <option value="">Select Author</option>
                              {
                                teams.map((t)=>{
                                  return(
                                    <option value={t}>{t}</option>
                                  )
                                })
                              }
                            </select>
                            {/* <input 
                                type='text' 
                                name="xauthor" 
                                value={xauthor} 
                                onChange={(e) => setXAuthor(e.target.value)} 
                                className="form-control" 
                                id="authors" 
                                aria-describedby="authors" 
                                placeholder="Enter Project Title" 
                              /> */}
                          </div>
                          <div className='col col-3'>
                            <input type="reset" className='btn btn-success' onClick={AddXAuthor} value="+Add" />
                          </div>
                          
                        </div>
                        <div>
                          <button type="submit" name="submit" id="submit" className="btn btn-primary my-3">{add}{add2}</button>
                        </div>
                    </div>
                  </div>
                </form>
        </div>
        :<Error />
        }
    </>
  )
}

export default EditProject;