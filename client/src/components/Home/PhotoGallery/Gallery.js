import React from "react";
import { useContext, useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import './gallery.css';
import { Context } from "../../../Context/Context";
import {  SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";
import { getImageSize } from 'react-image-size';
import { NavLink } from 'react-router-dom';

const PhotoGallery = () => {
    const { user } = useContext(Context);
    const [index, setIndex] = useState(-1);
    const [image,setImage] = useState();
    const [caption,setCaption] =useState("");
    const [photos,setPhotos]=useState([]);

    const handlePhoto = (e) => {
      setImage(e.target.files[0]);
    }

    const postImage = async (e) => {
      e.preventDefault();

      const data = new FormData();
      const photoname = Date.now() + image.name;
      data.append("name", photoname);
      data.append("photo", image);
      let imageurl;
      try {
        const img = await axios.post(`${SERVER_URL}/imgupload`, data);
        imageurl = img.data;
        console.log("final image", imageurl);
      } catch (err) {
        console.log("photoerr", err);
      }

      const { width, height } = await getImageSize(imageurl);
      let imageDetails = {
        imgurl:imageurl,
        caption:caption,
        width:width,
        height:height,
      }
      console.log('ImageDetails ', imageDetails);
      try {
        const imagedata = await axios.post(`${SERVER_URL}/gallery/addPhoto`, imageDetails, {
          headers: { "Content-Type": "application/json" },
        });

        if (imagedata.status === 422 || !imagedata) {
          window.alert("Posting failed");
          console.log("Posting failed");
        } else {
          console.log("data");
          console.log(imagedata);
          console.log("Posting Successfull");
        }
      } catch (err) {
        console.log("err", err);
      }

    }

    const getHomePhotos = async () => {
      try {
        let imagedata=[];
        const data = await axios.get(`${SERVER_URL}/gallery/getHomepagePhotos`);

        imagedata = data.data;
        console.log("imagedata", imagedata);
        let photoArray = imagedata.map((photo, index) => {
          const width = photo.width * 4;
          const height = photo.height * 4;
          return ({
            src: photo.imgurl,
            key: `${index}`,
            width,
            height,
            title:photo.caption,
          })
        });
        setPhotos(photoArray);
        console.log("photos ",photos);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(()=>{
      getHomePhotos();
    },[]);

    return (
      <div className="gallery-container adjust">
        <div>
          <h4>Image Gallery</h4>
          <div className="col-8 text-end">
              {user && user.isadmin ? (
                <form onSubmit={postImage} method='POST'>
                  <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                  <input
                    type="text"
                    name="title"
                    value={caption}
                    onChange={(e)=>setCaption(e.target.value)}
                    className="form-control"
                    id="caption"
                    aria-describedby="title"
                    placeholder="Enter caption"
                    required
                  />
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="btn btn-primary"
                  >Add Image
                  </button>
                </div>
                </form>
              ) : null}
            </div>
            
        </div>
        
        <PhotoAlbum
          layout="rows"
          photos={photos}
          targetRowHeight={200}
          onClick={({ index }) => setIndex(index)}
        />
  
        <Lightbox
          styles={{ container: { backgroundColor: "rgba(240,240,240,.9)" } }}
          className = 'lightbox'
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={photos}
          plugins={[Captions]}
        />
        <p><NavLink to='/gallery'>View all Images<span className='small'> ❯</span></NavLink></p>
      </div>
    );
  };
  
  export default PhotoGallery;
  