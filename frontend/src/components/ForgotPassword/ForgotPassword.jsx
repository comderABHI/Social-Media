import React, { useEffect, useState } from 'react'
import './ForgotPassword.css'
import { Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../Actions/User';
import toast from 'react-hot-toast';
const ForgotPassword = () => {

    const [email,SetEmail]=useState("");
    const dispatch=useDispatch();
    const {error,loading,message}=useSelector((state)=>state.like)
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    useEffect(() => {
        if (error) {
          toast.error(error);
          dispatch({ type: "clearErrors" });
        }
        if (message) {
          toast.success(message);
          dispatch({ type: "clearMessage" });
        }
      }, [error, dispatch, message]);


  return (
    <div className="forgotPassword">
      <form className="forgotPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>

        <input
          type="email"
          placeholder="Email"
          required
          className='forgotPasswordInputs'
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
        />

        
        <Button disabled={loading} type="submit">send token</Button>

      </form>
    </div>
  )
}

export default ForgotPassword