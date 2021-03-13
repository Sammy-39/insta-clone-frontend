import {useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import M from "materialize-css"

import {useDataLayerValue} from '../../context/index'

import Loader from "../misc/loader"

const Home = () =>{

    const history = useHistory()

    const searchModalRef = useRef()

    const [email,setEmail] = useState('')
    const [data,setData] = useState([])
    const [showLoader,setShowLoader] = useState(false)
    const [showCardLoader,setShowCardLoader] = useState(false)
    const [showModalLoader,setShowModalLoader] = useState(false)
    const [currPost,setCurrPost] = useState('')
    const [disable,setDisable] = useState(false)
    const [noPosts,setNoPosts] = useState(false)
    const [modalInstance,setModalInstance] = useState('')

    // eslint-disable-next-line 
    const [state,dispatch] = useDataLayerValue()

    const getData = async () =>{
        try{
            setShowLoader(true)
            M.Toast.dismissAll()
            const res = await fetch("https://insta-clone-backend-app.herokuapp.com/api/allPost",{
                headers: {"authorization": localStorage.getItem("token")}
            })
            const resData = await res.json()
            setShowLoader(false)
            if(resData && resData.length===0) { setNoPosts(true) }
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
       if(localStorage.getItem("user")) { 
           getData() 
           setModalInstance(M.Modal.init(searchModalRef.current))
        }
        // eslint-disable-next-line
    },[])

    const handleLike = async (e,postId,idx) =>{
        try{
            M.Toast.dismissAll()
            setShowCardLoader(true)
            setCurrPost(idx)
            setDisable(true)
            if(e.target.className.indexOf('like')===-1){
                e.target.className += ' like'
                const res = await fetch("https://insta-clone-backend-app.herokuapp.com/api/like",{
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
                const res = await fetch("https://insta-clone-backend-app.herokuapp.com/api/unlike",{
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
            const res = await fetch("https://insta-clone-backend-app.herokuapp.com/api/comment",{
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

    const handleDelete = async (e,postId,idx) =>{
        try{
            M.Toast.dismissAll()
            setShowCardLoader(true)
            setCurrPost(idx)
            setDisable(true)
            const res = await fetch(`https://insta-clone-backend-app.herokuapp.com/api/delete/${postId}`,{
                method: "DELETE",
                headers: {"authorization": localStorage.getItem("token")}
            })
            const resData = await res.json()
            setShowCardLoader(false)
            setDisable(false)
            if(res.status===200){
                const newData = data.filter(item=>item._id!==resData._id)
                setData(newData)
            }
            else{
                throw Error
            }
            setCurrPost('')
        } 
        catch(err){
            setCurrPost('')
            setDisable(false)
            setShowCardLoader(false)
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }
    }

    const handleSearch = async (e) =>{
        try{
            M.Toast.dismissAll()
            e.preventDefault()
            setDisable(true)
            setShowModalLoader(true)
            const res = await fetch(`https://insta-clone-backend-app.herokuapp.com/api/search-user/${email}`,{
                headers: {"authorization": localStorage.getItem("token")}
            })
            const resData = await res.json()
            setShowModalLoader(false)
            setDisable(false)
            if(res.status===200){
                setEmail('')
                return resData.userId
            }
            else{
                M.toast({html: resData.message, classes:'#d50000 red accent-4', displayLength:2000})
            }
        }
        catch(err){
            setDisable(false)
            setShowModalLoader(false)
            M.toast({html: 'Connection Timeout!', classes:'#d50000 red accent-4', displayLength:2000})
        }
    }

    const handleSearchAndRedirect = async (e) =>{
        if(email!==state.email){
            const userId = await handleSearch(e)
            modalInstance.close()
            if(userId){
                history.push(`/profile/${userId}`)
            }
        }
        else{
            modalInstance.close()
            history.push('/profile')
        }
    }

    return(
        <div className="home">
            {showLoader && <Loader />}
            {noPosts && <h6 className="no-posts"> No posts available here! Create New </h6>}
            <div className="home-search">
                 <i className="material-icons left">chevron_left</i> 
                 <div className="search-con">
                    <i className="material-icons search">search</i> 
                    <p className="modal-trigger" data-target="search-modal"> Search </p> 
                </div>
            </div> 
            <div id='search-modal' className="modal" ref={searchModalRef}>
                {showModalLoader && <Loader />}
                <div className="modal-content">
                    <h4>Search Users</h4>
                    <form onSubmit={e=>handleSearchAndRedirect(e)}>
                        <input type="email" placeholder="email" disabled={disable}
                        value={email} onChange={e=>setEmail(e.target.value)} />
                        <div className="modal-btns">
                            <button className="btn waves-effect" type="submit"
                                disabled={disable}> 
                                    Search
                            </button>
                            <button className="btn modal-close waves-effect#d50000 red accent-4" type="button"
                                disabled={disable}> 
                                    Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {data.map((item,idx)=>(
                <div key={idx} className="card home-card">
                    { idx===currPost && showCardLoader && <Loader />}
                    {state._id===item.postedBy._id && 
                     <div className='card-options-con'>
                         <i className="material-icons card-options" onClick={e=>!disable && handleDelete(e,item._id,idx)}>delete</i>
                     </div>
                    }
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
                            <input type="text" placeholder="comment" disabled={disable} required />
                        </form>   
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Home