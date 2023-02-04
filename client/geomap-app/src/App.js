import './App.css';
import * as React from 'react';
import  { Map, Marker, NavigationControl, Popup }  from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import {format} from 'timeago.js'

import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from './Components/Register/Register';
import Login from './Components/Login/Login';

const pinAddSuccess = () => {
  toast.success("Added Pin!")
}

const userNotLoggedIn = () => {
  toast.warning("Login to set Pins.")
}

const userLoggedOut = (userS) => {
  toast.warn("Logged out from " + userS)
}

const pinAddFailure = () => {
  toast.error("Failed to add pin. Fill all requirements.")
}


function App() {

  const [pins, setPins] = React.useState([])
  const [newPlace, setNewPlace] = React.useState(null)
  const [title, setTitle] = React.useState(null)
  const [desc, setDesc] = React.useState(null)
  const [currentUser, setCurrentUser] = React.useState(null)
  const [showRegister, setShowRegister] = React.useState(false)
  const [showLogin, setShowLogin] = React.useState(false)

  const [rating, setRating] = React.useState(1)

  const [viewPort, setViewPort] = React.useState({
    longitude : 12.4,
    latitude : 37.8,
    zoom : 14
  })

  const [currentPlaceId, setCurrentPlaceId] = React.useState(null)

  const handleAddClick = (e) => {
    console.log(e)
    let lat = e.lngLat.lat
    let long = e.lngLat.lng

    setNewPlace({
      lat : lat,
      lng : long
    })
  }

  const handleMarkerClicked = (id, lat, long) => {
    setCurrentPlaceId(id)
  }

  const handleLogout = () => {
    userLoggedOut(currentUser)
    setCurrentUser(null)
    
  }

  const handlePinSubmit = async(e) => {
    e.preventDefault()

    const newPin = {
      userName : currentUser,
      title : title,
      rating : rating,
      desc : desc,
      lat : newPlace.lat,
      long : newPlace.lng
    }

    try{
      if(!currentUser){
        //ERROR
        userNotLoggedIn()
      }else{
        const response = await axios.post("/pins", newPin)
        setPins([...pins, response.data])
        setNewPlace(null)
        //notify success
        pinAddSuccess()

        setRating(1)
        setDesc(null)
        setTitle(null)
      }
    }catch (err){
      console.log(err)
      pinAddFailure()
    }
  }

  React.useEffect(() =>{
    const getPins = async() => {
      try {
        const response = await axios.get("/pins")
        setPins(response.data)

      } catch (err) {
        console.log(err)
      }
    }

    getPins()
  }, [])

  return (
    <div >

      <Map
      container = {'map'}
      projection = {'globe'}
      initialViewState ={{viewPort}}
      mapboxAccessToken = {process.env.REACT_APP_TOKEN}
      style = {{width: "100vw", height: "100vh"}}
      mapStyle = "mapbox://styles/aadilb-cs/cldi19vi3001m01savyzyvrj5"
      onDblClick={handleAddClick}
      >
        <ToastContainer
        position='top-left'
        theme='dark'
        />

        <NavigationControl/>

        {
          pins.map(p => (
            <>
              <Marker
              longitude = {p.long}
              latitude = {p.lat}
              anchor = "center">
                <PlaceIcon
                className='icon'
                onClick = {() => handleMarkerClicked(p._id, p.lat, p.long)}
                style = {{fontSize : viewPort.zoom * 2, color : p.userName === currentUser ? "red" : "blue"}}
                />

              </Marker>

              {
                p._id === currentPlaceId &&
                (
                  <Popup
                  longitude = {p.long}
                  latitude = {p.lat}
                  closeOnClick = {false}
                  closeOnMove = {false}
                  anchor = "left"
                  >
                  
                      <div className='popCard'>
                        <label>Place</label>
                          <h4 className='place'>{p.title}</h4>
                        <label>Review</label>
                          <h4 className='desc'>{p.desc}</h4>
                        <label>Rating</label>
                          <div className='starRating'>
                            {Array(p.rating).fill(<StarIcon className='star'/>)}
                          </div>
                        <label>Information</label>
                        <div className='info'>
                            <span className='username'> Created by <b>{p.userName}</b> </span>
                            <span className='date'>{format(p.createdAt)}</span>
                        </div>
                  
                      </div>
                  </Popup>
                )
              }
            </>
          ))
        }

        {
          newPlace && 
          <Popup
          longitude={newPlace.lng}
          latitude={newPlace.lat}
          closeOnClick={false}
          closeOnMove={false}
          onClose = {() => setNewPlace(null)}
          anchor = "left"
          >
            <div>
              <form onSubmit={handlePinSubmit}>
                <label> Title </label>
                <input placeholder='Enter a title'
                onChange={(e) => setTitle(e.target.value)}/>

                <label> Review </label>
                <textarea placeholder='Write a review'
                onChange={(e) => setDesc(e.target.value)}/>

                <label> Rating </label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value = "1">1</option>
                  <option value = "2">2</option>
                  <option value = "3">3</option>
                  <option value = "4">4</option>
                  <option value = "5">5</option>
                </select>

                <button className='submitButton' type='submit'>Set Pin!</button>
              </form>

              

            </div>
            

          </Popup>
        }


      </Map>

      <div className='footer'>

        <div className='footer-down'>
          {
            currentUser ? (<button className='logout button' onClick={handleLogout}>Log out</button>) :
            (
              <div>
                <button className='login button'
                onClick={() => {setShowLogin(true)}}>
                  Login
                </button>

                <button className='register button'
                onClick={() => {setShowRegister(true)}}>
                  Register 
                </button>


              </div>
            )
          }
        </div>

      </div>

      {showRegister && <Register setShowRegister={setShowRegister}/>} 

      {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser = {setCurrentUser}/>}

    </div>
  );
}

export default App;
