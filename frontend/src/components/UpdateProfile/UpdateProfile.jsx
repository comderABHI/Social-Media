import React, { useEffect, useState } from 'react';
import './UpdateProfile.css';
import { Avatar, Button, InputLabel, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Updateprofile, loadUser } from '../../Actions/User';
import Loader from '../Loader/Loader';

const UpdateProfile = () => {
    const {loading,error,user}=useSelector((state)=>state.user)
    const {
        loading: updateLoading,
        error: updateError,
        message,
      } = useSelector((state) => state.like);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState("");
    const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
    const dispatch=useDispatch();
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatarPrev(Reader.result);
                setAvatar(Reader.result);
            }
        };

        Reader.onerror = (error) => {
            console.error("File reading error: ", error);
        };

        if (file) {
            Reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
      await dispatch(Updateprofile(name,email,avatar));
        dispatch(loadUser());
    };

    useEffect(()=>{
        if(error){
            toast.error(error)
            dispatch({type:"clearErrors"});
        }
        if(updateError){
            toast.error(updateError)
            dispatch({type:"clearErrors"});
        }
        if(message){
            toast.success(message)
            dispatch({type:"clearMessage"});
        }
    },[dispatch,error,updateError,message])
    return (
        loading? <Loader/>:(
            <div className='updateProfile'>
            <form className='updateProfileForm' onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social App
                </Typography>

                <Avatar 
                    src={avatarPrev} 
                    alt='User'
                    sx={{ height: "10vmax", width: "10vmax" }}
                />

                <input type='file' accept='image/*' onChange={handleImageChange} />

                <input 
                    type='text' 
                    value={name}
                    placeholder='Enter your name'
                    className='updateProfileInputs'
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <InputLabel>Email</InputLabel>
                <input
                    type="email"
                    placeholder="Enter your Email"
                    className='updateProfileInputs'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button disabled={updateLoading} type='submit'>Update</Button>
            </form>
        </div>
        )
    );
};



export default UpdateProfile