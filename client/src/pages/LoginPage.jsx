import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from '../UserContext.jsx'

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(e){
        // form默认提交刷新页面，下面代码用来阻止发生
          e.preventDefault();
          const response = await fetch('https://api.gzw-blog.me/login', {
              method: 'POST',
              body: JSON.stringify({username, password}),
              headers: {'content-type': 'application/json'},
              credentials: 'include',
          });

          if(response.ok){
               response.json().then(userInfo=>{
                   setUserInfo(userInfo);
                   setRedirect(true);
               })
          } else{
              alert("用户名或密码错误！");
          }
    }
    if(redirect){
        return <Navigate to={'/'} />
    }
    return (
        <>
            <form action="" className="max-w-96 my-0 mx-auto" onSubmit={login}>
                <h1 className="text-center text-2xl mb-1.5 font-semibold">登录</h1>
                <input className='input-primary'
                       type="text"
                       placeholder="用户名"
                       value={username}
                       onChange={(e)=>setUsername(e.target.value)}/>
                <input className='input-primary'
                       type="password"
                       placeholder="密码"
                       value={password}
                       onChange={(e)=>setPassword(e.target.value)}/>
                <button className="button-primary">登陆</button>
            </form>
        </>
    )
}