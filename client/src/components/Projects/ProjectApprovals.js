import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../../EditableStuff/Config";
import "./Projects.css";
import ProjectSpace from "./ProjectSpace";
import Loading from "../Loading";
import Error from "../Error";
import { NavLink } from "react-router-dom";
import { Context } from "../../Context/Context";

const ProjectApprovals = () => {
  const { user, logged_in } = useContext(Context);
  const [projects, setProjects] = useState([]);
  const [load, setLoad] = useState(0);

  const getProjectApprovals = () => {
    try {
      axios.get(`${SERVER_URL}/getpendingProjApprovals`).then((data) => {
        setProjects(data.data);
      }).catch(err => {
        setLoad(-1)
      });
    } catch (err) {
      console.log(err);
      setLoad(-1);
    }
  };

  useEffect(() => {
    if (logged_in === 1) {
      if (user.isadmin) {
        getProjectApprovals();
        setLoad(1)
      }
      else {
        setLoad(-1)
      }
    }
    else if (logged_in === -1) {
      setLoad(-1);
    }
  }, [logged_in]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="project-container container">
          <div>
            <div className="row py-4 align-items-center">
              <div className="col-4 text-header text-center text-md-start">
                Requires Approval
              </div>
              <div className="col-8  text-center text-md-end">
                {user ? (
                  <>
                    <NavLink
                      rel="noreferrer"
                      to="/projects"
                      className="btn btn-sm btn-primary mx-1"
                    >
                      All Projects
                    </NavLink>
                    &nbsp;&nbsp;
                    <NavLink
                      rel="noreferrer"
                      to="/addproject"
                      className="btn btn-sm btn-success"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-plus-circle-fill"
                        viewBox="0 0 16 18"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>{" "}
                      Add Project
                    </NavLink>
                  </>
                ) : null}
              </div>
            </div>
            <div className="row">
              {projects.map((project, i) => {
                return (
                  <div className="col-12 col-sm-6 col-lg-4 pb-5 px-3" key={i}>
                    <ProjectSpace project={project} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default ProjectApprovals;
