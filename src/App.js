import {BrowserRouter, Route, Switch, useHistory, useLocation} from "react-router-dom"
import { useEffect } from "react"

import Navbar from './components/navbar'
import Home from "./components/screens/home"
import Login from "./components/screens/login"
import Profile from "./components/screens/profile"
import Signup from "./components/screens/signup"
import CreatePost from "./components/screens/createPost"
import UserProfile from "./components/screens/userProfile"
import FollowingPosts  from './components/screens/followingPosts'
import Reset from "./components/screens/reset"
import UpdatePassword from "./components/screens/updatePassword"

import './App.css';

import {initialState,userReducer} from './reducers/userReducer'
import {useDataLayerValue} from './context/index'
import {DataLayer} from './context/index'

const Routing = () =>{
  const history = useHistory()
  const location = useLocation()
  
  // eslint-disable-next-line
  const [state,dispatch] = useDataLayerValue()

   useEffect(()=>{
     const user = JSON.parse(localStorage.getItem("user"))
     if(user){
       dispatch({type:"USER",payload:user})
       if(['/login','/signup'].includes(location.pathname)) { history.replace("/") }
     }
     else if(['/','/profile','/create'].includes(location.pathname)){
       history.replace("/login")
     }
     // eslint-disable-next-line
   },[])

  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:id">
        <UserProfile />
      </Route>
      <Route path="/following">
        <FollowingPosts />
      </Route>
      <Route path="/reset">
        <Reset />
      </Route>
      <Route path="/change-password/:token">
        <UpdatePassword />
      </Route>
    </Switch>
  )
}

const App = () => {
  return (
    <DataLayer initialState={initialState} reducer={userReducer}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </div>
    </DataLayer>
  );
}

export default App;
