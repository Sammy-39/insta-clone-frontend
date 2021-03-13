import {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import M from "materialize-css"

import {useDataLayerValue} from '../../context/index'

import Loader from "../misc/loader"

const FollowingPosts = () =>{
    const history = useHistory()

    const [data,setData] = useState([])
    const [showLoader,setShowLoader] = useState(false)
    const [showCardLoader,setShowCardLoader] = useState(false)
    const [disable,setDisable] = useState(false)
    const [currPost,setCurrPost] = useState('')
    const [noPosts,setNoPosts] = useState(false)

    // eslint-disable-next-line 
    const [state,dispatch] = useDataLayerValue()

    const getData = async () =>{
        try{
            setShowLoader(true)
            M.Toast.dismissAll()
            const res = await fetch("/api/myFollowingPost",{
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
       if(localStorage.getItem("user")) { getData() }
        // eslint-disable-next-line
    },[])

    const handleLike = async (e,postId,idx) =>{
        try{
            M.Toast.dismissAll()
            setShowCardLoader(true)
            setDisable(true)
            setCurrPost(idx)
            if(e.target.className.indexOf('like')===-1){
                e.target.className += ' like'
                const res = await fetch("/api/like",{
                    method: "PUT",
                    headers: {"Content-Type": "application/json","authorization": localStorage.getItem("token")},
                    body: JSON.stringify({postId})
                })
                const resData = await res.json()
                setShowCardLoader(false)
                setDisable(false)
                if(res.status===202){
                    const newData = data.map((item,idx)=>(
                        resData._id === item._id ? resData: item
                    ))
                    setData(newData)
                }
                else{
                    e.target.className = 'material-icons fav'
                    throw Error
                }
            }
            else{
                e.target.className = 'material-icons fav'
                const res = await fetch("/api/unlike",{
                    method: "PUT",
                    headers: {"Content-Type":"application/json","authorization": localStorage.getItem("token")},
                    body: JSON.stringify({postId})
                })
                const resData = await res.json()
                setShowCardLoader(false)
                setDisable(false)
                if(res.status===202){
                    const newData = data.map((item,idx)=>(
                        resData._id === item._id ? resData: item
                    ))
                    setData(newData)
                }
                else{
                    e.target.className += ' like'
                    throw Error
                }
            }
            setCurrPost('')
        } 
        catch(err){
            setShowCardLoader(false)
            setDisable(false)
            setCurrPost('')
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }
    }

    const handleComment = async (e,postId,idx) =>{
        try{
            M.Toast.dismissAll()
            e.preventDefault()
            setShowCardLoader(true)
            setCurrPost(idx)
            e.target[0].disabled = true
            const res = await fetch("/api/comment",{
                method: "PUT",
                headers: {"Content-Type": "application/json","authorization": localStorage.getItem("token")},
                body: JSON.stringify({postId,text:e.target[0].value})
            })
            const resData = await res.json()
            setShowCardLoader(false)
            e.target[0].disabled = false
            if(res.status===202){
                const newData = data.map((item,idx)=>(
                    resData._id === item._id ? resData: item
                ))
                setData(newData)
                e.target[0].value = ''
            }
            else{
                throw Error
            }
            setCurrPost('')
        } 
        catch(err){
            e.target[0].disabled = false
            setShowCardLoader(false)
            setCurrPost('')
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }
    }

    return(
        <div className="home">
            {showLoader && <Loader />}
            {noPosts && <h6 className="no-posts"> No posts available here! Follow users to view their post </h6>}
            {data.map((item,idx)=>(
                <div key={idx} className="card home-card">
                    { idx===currPost && showCardLoader && <Loader />}
                    <h5 onClick={()=>state._id!==item.postedBy._id ? history.push(`/profile/${item.postedBy._id}`): history.push(`/profile`)}> 
                    {item.postedBy.name} </h5>
                    <div className="card-image">
                        <img src={item.photo} alt="post-1"/>
                    </div>
                    <div className="card-content home-card-content">
                        <i className={`material-icons fav ${item.likes.indexOf(state._id)!==-1?'like':''} `} 
                        onClick={e=>!disable && handleLike(e,item._id,idx)}>favorite</i>
                        <span className='likes-count'>{item.likes.length!==0?item.likes.length:''} </span>
                        <h6> {item.title} </h6>
                        <p> {item.body} </p>
                        <div className="post-comment"> 
                            {item.comments.map((cmt,idx)=>(
                                <p key={idx}> <span>{cmt.postedBy.name}</span> : {cmt.text} </p>
                            ))}
                        </div>
                        <form onSubmit={e=>handleComment(e,item._id,idx)}>
                            <input type="text" placeholder="comment" required />
                        </form>   
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FollowingPosts