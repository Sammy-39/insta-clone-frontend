import {useState, useRef} from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"
 
import Loader from "../misc/loader"

const Signup = () =>{

    const history = useHistory()

    var imageNameRef = useRef("")

    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")

    const [showLoader,setShowLoader] = useState(false)
    const [disable,setDisable] = useState(false)

    const clearForm = () =>{
       setName("")
       setPassword("")
       setEmail("")
       setImage("")
       imageNameRef.current.value = ""
    }

    const postImg = async () =>{
        try {
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","sammy-39")
            const res = await fetch("https://api.cloudinary.com/v1_1/sammy-39/image/upload",{
                method :"POST",
                body: data
            })
            const resData = await res.json()
            if(res.status===200){
                return resData.secure_url
            }
            else{
                throw Error
            }
        } 
        catch(err){
            return false
        }
    }

    const handleSubmit = async (e) =>{
        try{
            e.preventDefault()
            M.Toast.dismissAll()
            setDisable(true)
            setShowLoader(true)
            const imageURL = await postImg()
            if(imageURL){
                const res = await fetch('/api/signup',{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        image: imageURL
                    })
                })
                const resData = await res.json()
                setDisable(false)
                setShowLoader(false)
                if(res.status===201){
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
            else{
                setDisable(false)
                setShowLoader(false)
                M.toast({html: "Image upload error!", classes:'#d50000 red accent-4'})
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
                { showLoader && <Loader />}
                <h2> Instagram </h2>
                <form onSubmit={e=>handleSubmit(e)}>
                    <div className="file-field input-field">
                        <i className="material-icons #64b5f6 blue-text darken-1">
                            add_photo_alternate
                            <input type="file" disabled={disable} 
                            onChange={e=>setImage(e.target.files[0])}/>
                        </i>
                        <div className="file-path-wrapper file-path">
                            <input className="file-path validate" type="text" ref={imageNameRef} placeholder='Profile Picture'
                            disabled={disable}/>
                        </div>
                    </div>
                    <input type="text" placeholder="name" value={name} disabled={disable}
                    onChange={e=>setName(e.target.value)}/>
                    <input type="email" placeholder="email" value={email} disabled={disable}
                    onChange={e=>setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} disabled={disable}
                    onChange={e=>setPassword(e.target.value)} />
                    <button className="btn waves-effect #64b5f6 blue darken-2" type="submit"
                    disabled={disable} > 
                        Signup
                    </button>
                </form>
                <h6> <Link to="/login"> Already have an account? Login </Link> </h6>
            </div>
        </div>
    )
}

export default Signup