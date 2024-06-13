import React, { useEffect, useState } from 'react';
import './Register.css';
import { Avatar, Button, InputLabel, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../../Actions/User';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const dispatch=useDispatch();
    const {loading,error}=useSelector((state)=>state.user)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = () => {
            if (Reader.readyState === 2) {
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

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(RegisterUser(name,email,password,avatar))
    };

    useEffect(()=>{
        if(error){
            toast.error(error)
            dispatch({type:"clearErrors"});
        }
    },[dispatch,error])
    return (
        <div className='register'>
            <form className='registerForm' onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social App
                </Typography>

                <Avatar 
                    src={avatar} 
                    alt='User'
                    sx={{ height: "10vmax", width: "10vmax" }}
                />

                <input type='file' accept='image/*' onChange={handleImageChange} />

                <input 
                    type='text' 
                    value={name}
                    placeholder='Enter your name'
                    className='registerInputs'
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <InputLabel>Email</InputLabel>
                <input
                    type="email"
                    placeholder="Enter your Email"
                    className='registerInputs'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <InputLabel>Password</InputLabel>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className='registerInputs'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/"><Typography>Already Signed Up? Login Now</Typography></Link>
                <Button disabled={loading} type='submit'>Sign Up</Button>
            </form>
        </div>
    );
};

export default Register;
