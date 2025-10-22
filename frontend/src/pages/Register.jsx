import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      alert('Registered — please login');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="form">
      <h3>Register</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><input {...register('name')} placeholder="Full name" required /></div>
        <div><input {...register('email')} placeholder="Email" required /></div>
        <div><input {...register('password')} type="password" placeholder="Password" required /></div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
