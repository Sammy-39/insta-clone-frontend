import {useState} from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"

import Loader from "../misc/loader"

const Reset = () =>{

    const history = useHistory()
 
    const [email,setEmail] = useState("")
    const [showLoader,setShowLoader] = useState(false)
    const [disable,setDisable] = useState(false)

    const clearForm = () =>{
       setEmail("")
    }

    const handleSubmit = async (e) =>{
        try{
            e.preventDefault()
            M.Toast.dismissAll()
            setDisable(true)
            setShowLoader(true)
            const res = await fetch('/api/reset-password',{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email
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
                    <input type="email" placeholder="Email" disabled={disable} required
                    value={email} onChange={e=>setEmail(e.target.value)} />
                    <button className="btn reset-btn waves-effect #64b5f6 blue darken-2" type="submit"
                    disabled={disable}> 
                        Reset Password
                    </button>
                </form>
                <h6> <Link to="/login"> Go back to Login </Link> </h6>
            </div>
        </div>
    )
}

export default Reset