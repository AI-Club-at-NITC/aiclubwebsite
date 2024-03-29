import React, { useState, useContext, useEffect } from "react";
import "../Blogs/Blogs.css";
import { Context } from "../../Context/Context";
import { NavLink } from "react-router-dom";
import { SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import { Helmet } from "react-helmet";
import Loading from "../Loading";
import Error from "../Error";
import CompetitionSpace from "./CompetitionSpace";

const DraftCompetitions = () => {
  const { user,logged_in } = useContext(Context);
  const [competitions, setCompetitions] = useState([]);
  const [load, setLoad] = useState(0);

  const getCompetitionsData = async () => {
    try {
      axios
        .get(`${SERVER_URL}/getDraftCompeteNames/${user._id}`)
        .then((data) => {
          if (data.status === 201) {
            setCompetitions(data.data);
            setLoad(1);
          } else {
            setLoad(-1);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if(logged_in===1){
      getCompetitionsData();
    }
    else if(logged_in===-1){
      setLoad(-1);
    }
  }, [logged_in]);

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="blog-container container">
          <Helmet>
            <title>Draft Competitions - AI Club</title>
          </Helmet>
          <div>
            <div className="row align-items-center py-4">
              <div className="col-md-4 text-center text-md-start">
                <div className="text-header">Draft Competitions</div>
              </div>
              <div className="col-md-8 text-center text-md-end">
                {user ? (
                  <NavLink
                    rel="noreferrer"
                    to="/competitions"
                    className="btn btn-sm btn-primary"
                  >
                    Public
                  </NavLink>
                ) : null}
                {user && user.isadmin ? (
                  <NavLink
                    type="button"
                    className="btn btn-sm btn-success ml-2"
                    to="/create-competition"
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
                    Create
                  </NavLink>
                ) : null}
              </div>
            </div>
            <div className="row">
              {competitions.map((competition, key) => {
                return (
                  <div className="col-12 col-sm-6 col-lg-3 pb-5 px-3" key={key}>
                    <CompetitionSpace competition={competition} />
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

export default DraftCompetitions;
