import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import M from "materialize-css"

import {useDataLayerValue} from '../../context/index'

import Loader from "../misc/loader"

const UserProfile = () =>{
 
    const {id} = useParams()

    const [{user,posts},setData] = useState([])
    // eslint-disable-next-line
    const [state,dispatch] = useDataLayerValue()
    const [showLoader,setShowLoader] = useState(false)
    const [noPosts,setNoPosts] = useState(false)

    const getUserData = async () =>{
        try{
            M.Toast.dismissAll()
            setShowLoader(true)
            const res = await fetch(`/api/user/${id}`,{
                headers: {"authorization": localStorage.getItem("token")}
            })
            const resData = await res.json()
            setShowLoader(false)
            if( resData && resData.posts.length===0){ setNoPosts(true) }
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
        if(localStorage.getItem('user')) { 
            getUserData()  
        }
        // eslint-disable-next-line 
    },[])

    const handleFollow = async () => {
        try{
            M.Toast.dismissAll()
            setShowLoader(true)
            const res = await fetch("/api/follow",{
                method: "PUT",
                headers: {"Content-Type": "application/json","authorization": localStorage.getItem("token")},
                body: JSON.stringify({followId:id})
            })
            const resData = await res.json()
            setShowLoader(false)
            if(res.status===202){
                M.toast({html: `Following ${resData.followerRes.name}`, classes:'#2e7d32 green darken-3', displayLength:1000})
                setData({user:resData.followerRes,posts})
                dispatch({type:"UPDATE",payload:{followers:resData.followingRes.followers,following:resData.followingRes.following}})
                localStorage.setItem("user",JSON.stringify(resData.followingRes))
            }
            else{
                throw Error;
            }
        }
        catch(err){
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }       
    }

    const handleUnfollow = async () => {
        try{
            M.Toast.dismissAll()
            setShowLoader(true)
            const res = await fetch("/api/unfollow",{
                method: "PUT",
                headers: {"Content-Type": "application/json","authorization": localStorage.getItem("token")},
                body: JSON.stringify({unfollowId:id})
            })
            const resData = await res.json()
            setShowLoader(false)
            if(res.status===202){
                M.toast({html: `Unfollowed ${resData.followerRes.name}`, classes:'#2e7d32 green darken-3', displayLength:1000})
                setData({user:resData.followerRes,posts})
                dispatch({type:"UPDATE",payload:{followers:resData.followingRes.followers,following:resData.followingRes.following}})
                localStorage.setItem("user",JSON.stringify(resData.followingRes))
            }
            else{
                throw Error;
            }
        }
        catch(err){
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }       
    }

    return(
        <div className="profile">
            {showLoader && <Loader />}
            <div className="profile-header">
                <div className="profile-left">
                    <div className="profile-pic-con">
                        {user?<img className="profile-pic" src={user.image} alt="my-pic" />:<h6> Loading...</h6>}
                    </div>
                    <div className="profile-follow">
                        <div className="tooltip follow">
                            { user && !user.followers.includes(state._id) && 
                                <i className="material-icons #1a237e indigo-text darken-4 lighten-2" onClick={e=>handleFollow(e)}>
                                    person_add</i> }
                            <span className="tooltiptext">Follow</span>
                        </div>
                        <div className="tooltip follow">
                            { user && user.followers.includes(state._id) &&
                                <i className="material-icons tooltipped unfollow #d50000 red-text accent-4" onClick={e=>handleUnfollow(e)}> 
                                    person_remove</i> }
                            <span className="tooltiptext">Unfollow</span>
                        </div>
                    </div>
                </div>
                <div className="profile-name">
                    <h4> {user? user.name : `Loading...`} </h4>
                    <h5> {user? user.email : `Loading...`} </h5>
                    <div className="profile-details">
                        <h6> {posts ? `${posts.length} Posts` : 'Loading...'} </h6>
                        <h6> {user ? `${user.followers.length} Followers`: ''} </h6>
                        <h6> {user ? `${user.following.length} Following`: ''} </h6>
                    </div> 
                </div>
            </div>
            <div className='profile-gallery'>
                {noPosts && <h6 className="no-posts"> No posts available here! </h6>}
                {posts ? posts.map((item,idx)=>(
                    <img key={idx} className="profile-gallery-item" src={item.photo}
                    alt={item.title} />
                )): 'Loading...'}
            </div>
        </div>
    )
}

export default UserProfile