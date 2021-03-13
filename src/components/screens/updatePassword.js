import {useState} from "react"
import {Link, useHistory, useParams} from "react-router-dom"
import M from "materialize-css"

import Loader from "../misc/loader"

const UpdatePassword = () =>{

    const history = useHistory()
    const params = useParams()
 
    const [password,setPassword] = useState("")
    const [showLoader,setShowLoader] = useState(false)
    const [disable,setDisable] = useState(false)

    const clearForm = () =>{
       setPassword("")
    }

    const handleSubmit = async (e) =>{
        try{
            e.preventDefault()
            M.Toast.dismissAll()
            setDisable(true)
            setShowLoader(true)
            const res = await fetch('https://insta-clone-backend-app.herokuapp.com/api/change-password',{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    password,
                    token: params.token
                })
            })
            const resData = await res.json()
            setDisable(false)
            setShowLoader(false)
            if(res.status===200){
                clearForm()
                M.toast({html: resData.message, classes:'#2e7d32 green darken-3', displayLength:1000})
                setTimeout(()=>{
                    history.push("/login")
                },1000)
            }
            else{
                M.toast({html: resData.message, classes:'#d50000 red accent-4'})
            }
        }
        catch(err){
            M.toast({html: 'Connection timeout!', classes:'#d50000 red accent-4'})
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                {showLoader && <Loader />}
                <h2> Instagram </h2>
                <form onSubmit={handleSubmit}>
                    <input type="password" placeholder="New password" disabled={disable} required
                    value={password} onChange={e=>setPassword(e.target.value)} />
                    <button className="btn reset-btn waves-effect #64b5f6 blue darken-2" type="submit"
                    disabled={disable}> 
                        Change Password
                    </button>
                </form>
                <h6> <Link to="/login"> Go back to Login </Link> </h6>
            </div>
        </div>
    )
}

export default UpdatePassword