import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/api';
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form">
      <h3>Login</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><input {...register('email')} placeholder="Email" required /></div>
        <div><input {...register('password')} type="password" placeholder="Password" required /></div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
