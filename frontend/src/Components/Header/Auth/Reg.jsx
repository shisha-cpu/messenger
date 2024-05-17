import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { loggin } from '../../../store/slices/isLoggin'; 
import './Reg.css'; 

const Reg = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '', 
    });
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (redirect) {
            dispatch(loggin());
            navigate('/'); 
        }
    }, [redirect, dispatch, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/register', formData);
            alert('Registration successful');
            setRedirect(true); 
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form"> 
                <h2>Registration</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <button type="submit">Регистрация</button>
            </form>
        </div>
    );
};

export default Reg;
