import {useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import M from "materialize-css"

import Loader from "../misc/loader"

const CreatePost = () =>{

    const history = useHistory()

    const [title,setTitle] = useState("")
    const [image,setImage] = useState("")
    const [showLoader,setShowLoader] = useState(false)
    const [disable,setDisable] = useState(false)

    var imageNameRef = useRef("")

    const clearForm = () =>{
        setTitle("")
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
                const res = await fetch('/api/createPost',{
                    method: "POST",
                    headers: {"Content-Type": "application/json","authorization": localStorage.getItem("token")},
                    body: JSON.stringify({
                        title,
                        photo: imageURL
                    })
                })
                const resData = await res.json()
                setDisable(false)
                setShowLoader(false)
                if(res.status===201){
                    clearForm()
                    M.toast({html: resData.message, classes:'#2e7d32 green darken-3', displayLength:1000})
                    setTimeout(()=>{
                        history.push("/")
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
        <div className="createPost card input-field">

            {showLoader && <Loader />}

            <form onSubmit={e=>handleSubmit(e)}>
                <input type="text" placeholder="title" disabled={disable}
                value={title} onChange={e=>setTitle(e.target.value)} />
                <div className="file-field input-field">
                    <i className="material-icons #64b5f6 blue-text darken-1">
                        add_photo_alternate
                        <input type="file" disabled={disable} 
                        onChange={e=>setImage(e.target.files[0])}/>
                    </i>
                    <div className="file-path-wrapper file-path">
                        <input className="file-path validate" type="text" ref={imageNameRef} disabled={disable}/>
                    </div>
                </div>
                <button className="btn waves-effect #64b5f6 blue darken-1" type="submit"
                disabled={disable} > 
                    POST
                </button>
            </form>
        </div>
    )
}

export default CreatePost