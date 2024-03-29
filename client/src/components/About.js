import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SERVER_URL } from "../EditableStuff/Config";
import { Context } from "../Context/Context";
import { alertContext } from "../Context/Alert";
import Error from "./Error";
import Loading from "./Loading";
import { editorConfig } from "./Params/editorConfig";
import { editorPreviewConfig } from "./Params/editorConfig";

const About = () => {
  const editor = useRef(null);
  const { user } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [preview, setPreview] = useState(true);
  const [about, setAbout] = useState("");
  const [load, setLoad] = useState(0);
  const [save, setSave] = useState(false);
  const [desc, setDesc] = useState("");
  const getAbout = () => {
    axios.get(`${SERVER_URL}/getAbout/`).then((data) => {
      if (data.status === 200) {
        setAbout(data.data);
        setDesc(data.data.about);
        setLoad(1);
      } else {
        setLoad(-1);
      }
    });
  };
  useEffect(() => {
    getAbout();
    setPreview(true);
  }, [user]);

  const handleValue = (value) => {
    setAbout({ ...about, ['about']: value });
  };
  const showPreview = () => {
    if (desc !== about.about) {
      setSave(true);
    }
    else {
      setSave(false);
    }
    setPreview(true);
  };
  const showEdit = () => {
    setPreview(false);
  };
  const cancelIt = () => {
    setAbout({ ...about, ['about']: desc });
    setSave(false);
    setPreview(true);
  };
  const saveIt = async () => {
    await axios.put(`${SERVER_URL}/updateAbout/${about._id}`,
      about,
      {
        withCredentials:true,
        headers: { "Content-Type": "application/json" },
      });
    showAlert("Saved", "success");
    setSave(false);
    setPreview(true);
  };

  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 ? (
        <div className="about-container">
          <div className="adjust pb-4">
            <div className="d-flex justify-content-between align-items-center py-4">
              <div className=" text-center text-md-start text-header">
                About
              </div>
              <div className="text-center text-md-end ">
                {user && user.isadmin ? (
                  preview ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm mx-1"
                        onClick={showEdit}
                      >
                        Edit
                      </button>
                      {save && <button
                        className="btn btn-success btn-sm mx-1"
                        onClick={saveIt}
                      >Save</button>}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm mx-1"
                        onClick={cancelIt}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm mx-1"
                        onClick={showPreview}
                      >
                        Preview
                      </button>
                      <button
                        className="btn btn-success btn-sm mx-1"
                        onClick={saveIt}
                      >
                        Save
                      </button>
                    </>
                  )
                ) : null}
              </div>
            </div>
            {preview ? (
              <div>
                <JoditEditor
                  name="content"
                  ref={editor}
                  value={about.about}
                  config={editorPreviewConfig}
                />
              </div>
            ) : (
              <JoditEditor
                className="jodit-editor-border"
                name="content"
                ref={editor}
                value={about.about}
                config={editorConfig}
                onChange={handleValue}
              />
            )}
            <div className="py-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.179525211182!2d75.93149181532856!3d11.321585291953028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2bb691caf%3A0xe14dc0a5771fd2ce!2sCentral%20Computer%20Center!5e0!3m2!1sen!2sin!4v1674127152405!5m2!1sen!2sin"
                width="100%"
                height="600"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default About;
