    import React from 'react';
    import { Link } from 'react-router-dom';
    import './Header.css'; 
    import { useDispatch, useSelector } from 'react-redux';

    export default function Header() {
        const isLoggedIn = useSelector(state => state.isLoggin)
        const user = useSelector(state => state.user)
        console.log(user);
        return (
            <header className="header-container">
                <Link to='/' className="header-link logo">
                    <div className="logo-text">LunaLounge</div>
                </Link>
                <nav className="nav-links">


                    {!isLoggedIn.isLoggin ? (
                        <>
                            <Link to='/register' className="header-link">Регистрация</Link>
                            <Link to='/login' className="header-link">Вход</Link>
                        </>
                    ) : (
                      <>Пользователь : {user.user.username}</>
                    )}
                </nav>
            </header>
        );
    }
