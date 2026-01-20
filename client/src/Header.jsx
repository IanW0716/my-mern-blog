import {Link, Navigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from './UserContext.jsx';

export default function Header(){
    const {userInfo, setUserInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('https://api.gzw-blog.me/profile',{
            credentials: "include",
        }).then(res =>{
            res.json().then(userInfo=>{
                setUserInfo({userInfo});
            })
        })
    }, []);
    function logout(){
        fetch('https://api.gzw-blog.me/logout',{
            credentials: "include",
            method: "POST",
        })
        setUserInfo(null);
    }
    const username = userInfo?.username;
    return (
        <header className="flex justify-between py-4 mb-8 items-center sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <Link to="/" className="text-inherit font-bold text-[1.5rem]">我的博客</Link>
            <nav className="flex gap-[15px]">
                {username && (
                     <>
                         <span>你好，{username}</span>
                         <Link to='/post' className="text-inherit">创建博客</Link>
                         <a onClick={logout}
                            className='cursor-pointer hover:text-red-500 transition-colors'>
                             退出登录
                         </a>
                     </>
                )}
                {!username && (
                    <>
                        <Link to="/login" className="text-inherit">登录</Link>
                        <Link to="/register" className="text-inherit">注册</Link>
                    </>
                )}
            </nav>
        </header>
    )
}