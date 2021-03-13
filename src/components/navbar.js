import { useEffect, useRef } from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"

import {useDataLayerValue} from '../context/index'

const Navbar = () =>{

  const [state,dispatch] = useDataLayerValue()

  const slideoutRef = useRef('')

  const history = useHistory()

  useEffect(()=>{
    M.Sidenav.init(slideoutRef.current);
  },[])

  const handleLogout = () =>{
    localStorage.clear()
    dispatch({type:"CLEAR"})
    history.replace("/login")
  }

  const renderList = () =>{
    if(state){
      return [
        {link: "/profile", text: "Profile"},
        {link: "/create", text: "Post"},
        {link:"/following", text:"Following"}
      ]
    }
    else{
      return[
        {link: "/login", text: "Login"},
        {link: "/signup", text: "Signup"}
      ]
    }
  }

  return(
    <nav>
      <div className="nav-wrapper nav white">
        <Link to={state?"/":"/login"} className="brand-logo black-text left">Instagram</Link>
        <a href="#!" data-target="slide-out" className="sidenav-trigger hide-on-med-and-up black-text right"><i className="material-icons">menu</i></a>
        <ul id="nav-mobile" className="right hide-on-small-and-down">
          {renderList().map((item,idx)=>(
            <li key={idx}><Link className="black-text" to={item.link}>{item.text}</Link></li>
          ))}
          { state && 
            <button className="btn-small logout-btn waves-effect red" type="button"
            onClick={handleLogout}>
              Logout 
            </button>
          }
        </ul>
        <ul id="slide-out" className="sidenav sidenav-close right" ref={slideoutRef}>
          {renderList().map((item,idx)=>(
            <li key={idx}><Link className="black-text" to={item.link}>{item.text}</Link></li>
          ))}
          { state && 
            <button className="btn-small logout-btn waves-effect red" type="button"
            onClick={handleLogout}>
              Logout 
            </button>
          }
        </ul>
      </div>
    </nav>
  )
}

export default Navbar