import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CompetitionSpace = ({competition}) => {
  const [status, setStaus] = useState("");
  const [timeStatus, setTimeStaus] = useState("");


  useEffect(() => {
    let present = new Date();
    let start = new Date(competition.CompetitionStart);
    let end = new Date(competition.CompetitionEnd);
    var s = {
      days: 86400, // feel free to add your own row
      hour: 3600,
      min: 60,
      sec: 1,
    };
    var r = {};
    if (present.getTime() < start.getTime()) {
      setStaus("UpComing");
      var d = Math.abs(start - present) / 1000;
      Object.keys(s).every((key) => {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
        if (r[key] !== 0) {
          if (r[key] === 1) {
            setTimeStaus(`Starts in ${r[key]} ${key.slice(0, -1)}`);
          } else {
            setTimeStaus(`Starts in ${r[key]} ${key}`);
          }
          return false;
        }
        return true;
      });
    } else if (
      present.getTime() > start.getTime() &&
      present.getTime() < end.getTime()
    ) {
      setStaus("OnGoing");
      var d = Math.abs(end - present) / 1000;
      Object.keys(s).every((key) => {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
        if (r[key] !== 0) {
          if (r[key] === 1) {
            setTimeStaus(`${r[key]} ${key.slice(0, -1)} to go`);
          } else {
            setTimeStaus(`${r[key]} ${key} to go`);
          }
          return false;
        }
        return true;
      });
    } else {
      setStaus("Completed");
    }
  }, [competition]);

  return (
    <div className="card">
      <img
        src={competition.headerPhoto}
        alt={competition.title}
        className="card-img-top"
        style={{ height: "100px" }}
      />
      <div className="card-body border-bottom p-3">
        <h5
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            lineClamp: 2,
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {competition.title}
        </h5>
        {competition.subtitle && <p className="text-secondary">{competition.subtitle}</p>}
        <p className="text-secondary">{status}</p>
        <p className="card-text text-secondary">
          {competition.participantCount} Teams
        </p>
      </div>
      <div className="d-flex justify-content-between align-items-center p-3">
        <NavLink
          rel="noreferrer"
          to={`/competitions/${competition.url}`}
          className="btn btn-sm btn-dark rounded"
        >
          View More
        </NavLink>
        <div className="card-text text-secondary">{timeStatus}</div>
      </div>
    </div>
  );
};

export default CompetitionSpace;
