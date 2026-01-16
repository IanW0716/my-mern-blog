import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor.jsx";

export default function CreatePost(){
    const inputClass = "block mb-1 w-full px-[5px] py-[7px] border-[1px] border-solid rounded-xl border-gray-200 bg-gray-50";
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [redirect, setRedirect] = useState(false);

    async function createPost(e){
        e.preventDefault();
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("img", img);
        const response = await fetch('https://my-mern-blog-n6yk.onrender.com/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        })
        if (response.ok) {
            // alert('发布成功！');
            setRedirect(true );
        }
    }

    if(redirect){
        return(
            <Navigate to={'/'}/>
        )
    }
    return(
        <form onSubmit={createPost}>
            <input type="title"
                   placeholder={'标题'}
                   className='input-primary'
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <input type="summary"
                   placeholder={'概述'}
                   className='input-primary'
                   value={summary}
                   onChange={(e) => setSummary(e.target.value)}/>
            <input type="file"
                   placeholder={'请上传文件'}
                   className='input-primary bg-white'
                   onChange={(e)=>setImg(e.target.files[0])}
            />
            <Editor value={content} onChange={setContent} />
            <button className='button-primary'>创建</button>
        </form>
    );
}