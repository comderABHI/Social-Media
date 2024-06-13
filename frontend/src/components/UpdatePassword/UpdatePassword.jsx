import React, { useEffect, useState } from 'react';
import { Typography, Button} from '@mui/material';
import './UpdatePassword.css'
import { useDispatch, useSelector } from 'react-redux';
import { Updatepasswword} from '../../Actions/User';
import toast from 'react-hot-toast';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  
  const { error, loading, message } = useSelector((state) => state.like);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(Updatepasswword(oldPassword, newPassword))
    
  };

  useEffect(()=>{
    if(error){
        toast.error(error)
        dispatch({type:"clearErrors"});
    }
    
    if(message){
        toast.success(message)
        dispatch({type:"clearMessage"});
    }
},[dispatch,error,message])



  return (
    <div className="updatePassword ">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: '2vmax' }}>
          Social App
        </Typography>
        
        
        <input
          type="password"
          placeholder="Enter your Old password"
          required
          value={oldPassword}
          className='updatePasswordInputs'
          onChange={(e) => setOldPassword(e.target.value)}
        />
        
       
        <input
          type="password"
          placeholder="Enter your New password"
          required
          value={newPassword}
          className='updatePasswordInputs'
          onChange={(e) => setNewPassword(e.target.value)}
        />


        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Change Password
        </Button>
        
      </form>
    </div>
  );
};




export default UpdatePassword