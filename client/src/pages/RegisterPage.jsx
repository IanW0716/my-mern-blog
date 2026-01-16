import {useState} from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    async function register(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers:{'Content-Type': 'application/json'}
        })
        if (response.status === 200) {
            alert("注册成功🎉");
        }
        else{
            alert("注册失败‼️");
        }
    }
    return (
        <>
            <form action="" className="max-w-96 my-0 mx-auto" onSubmit={register}>
                <h1 className="text-center  text-2xl mb-1.5 font-semibold">注册</h1>
                <input className='input-primary'
                       type="text"
                       placeholder="用户名"
                       value={username}
                       // e.target === <input ... />
                       onChange={e => setUsername(e.target.value)}
                        />
                <input className='input-primary'
                       type="password"
                       placeholder="密码"
                       value={password}
                       onChange={e => setPassword(e.target.value)}  />
                <button className="button-primary">注册</button>
            </form>
        </>
    )
}