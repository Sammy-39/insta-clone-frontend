import {useEffect,useState} from 'react'
import M from "materialize-css"

import {useDataLayerValue} from '../../context/index'

import Loader from "../misc/loader"

const Profile = () =>{

    const [data,setData] = useState([])
    // eslint-disable-next-line
    const [state,dispatch] = useDataLayerValue()
    const [showLoader,setShowLoader] = useState(false)
    const [noPosts,setNoPosts] = useState(false)

    const getPost = async () =>{
        try{
            M.Toast.dismissAll()
            setShowLoader(true)
            const res = await fetch("https://insta-clone-backend-app.herokuapp.com/api/myPost",{
                headers: {"authorization": localStorage.getItem("token")}
            })
            const resData = await res.json()
            setShowLoader(false)
            if( resData && resData.length===0){ setNoPosts(true) }
            if(res.status===200){
                setData(resData)
            }
            else{
                throw Error;
            }
        }
        catch(err){
            setShowLoader(false)
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4'})
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('user')) { getPost() }
        
        // eslint-disable-next-line 
    },[])

    return(
        <div className="profile">
            {showLoader && <Loader />}
            <div className="profile-header">
                <div className="profile-pic-con">
                    <img className="profile-pic" src={state?state.image:''} alt="my-pic" />
                </div>
                <div className="profile-name">
                    <h4> {state?state.name:'Loading...'} </h4>
                    <div className="profile-details">
                        <h6> {`${data.length} Posts`} </h6>
                        <h6> {state ? `${state.followers.length} Followers`: ''} </h6>
                        <h6> {state ? `${state.following.length} Following`: ''} </h6>
                    </div> 
                </div>
            </div>
            <div className='profile-gallery'>
                {noPosts && <h6 className="no-posts"> No posts available here! Create New </h6>}
                {data.map((item,idx)=>(
                    <img key={idx} className="profile-gallery-item" src={item.photo}
                    alt={item.title} />
                ))}
            </div>
        </div>
    )
}

export default Profile