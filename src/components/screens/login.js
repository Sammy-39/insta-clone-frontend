import {useState} from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"

import {useDataLayerValue} from '../../context/index'

import Loader from "../misc/loader"

const Login = () =>{

    const history = useHistory()
 
    // eslint-disable-next-line
    const [state,dispatch] = useDataLayerValue()

    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [showLoader,setShowLoader] = useState(false)
    const [disable,setDisable] = useState(false)

    const clearForm = () =>{
       setPassword("")
       setEmail("")
    }

    const handleSubmit = async (e) =>{
        try{
            e.preventDefault()
            M.Toast.dismissAll()
            setDisable(true)
            setShowLoader(true)
            const res = await fetch('/api/signin',{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const resData = await res.json()
            setDisable(false)
            setShowLoader(false)
            if(res.status===200){
                clearForm()
                localStorage.setItem("token",resData.token)
                localStorage.setItem("user",JSON.stringify(resData.user))
                dispatch({type:"USER", payload: resData.user})
                M.toast({html: resData.message, classes:'#2e7d32 green darken-3', displayLength:1000})
                setTimeout(()=>{
                    history.push("/")
                },1000)
            }
            else{
                M.toast({html: resData.message, classes:'#d50000 red accent-4'})
            }
        }
        catch(err){
            setDisable(false)
            M.toast({html: 'Connection timeout!', classes:'#d50000 red accent-4'})
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                {showLoader && <Loader />}
                <h2> Instagram </h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="email" disabled={disable}
                    value={email} onChange={e=>setEmail(e.target.value)} />
                    <input type="password" placeholder="password" disabled={disable}
                    value={password} onChange={e=>setPassword(e.target.value)} />
                    <button className="btn waves-effect #64b5f6 blue darken-2" type="submit"
                    disabled={disable}> 
                        Login
                    </button>
                </form>
                <h6> <Link to="/reset"> Forgot Password? </Link> </h6>
                <h6> <Link to="/signup"> Dont have an account? Signup </Link> </h6>
            </div>
        </div>
    )
}

export default Login