import Editor from "../Editor.jsx";
import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";

export default function EditPost() {
    const inputClass = "block mb-1 w-full px-[5px] py-[7px] border-[1px] border-solid rounded-xl border-gray-200 bg-gray-50";
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("在此输入内容...");
    const [img, setImg] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const {id} = useParams();
        useEffect(() => {
            fetch('https://api.gzw-blog.me/post/'+id)
                .then(res => res.json())
                .then(postInfo => {
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content);
                })
        },[])
    async function updatePost(e){
        e.preventDefault();
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("img", img);
        data.set('id',id);
        const response = await fetch('https://api.gzw-blog.me/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })
        if (response.ok) {
            setRedirect(true);
        }
    }

    if(redirect){
        return(
            <Navigate to={'/post/'+id}/>
        )
    }
    return(
        <form onSubmit={updatePost}>
            <input type="title"
                   placeholder={'标题'}
                   className='input-primary mb-2'
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <input type="summary"
                   placeholder={'概述'}
                   className='input-primary mb-2'
                   value={summary}
                   onChange={(e) => setSummary(e.target.value)}/>
            <input type="file"
                   placeholder={'请上传文件'}
                   className='input-primary mb-2'
                   onChange={(e)=>setImg(e.target.files[0])}
            />
            <Editor value={content} onChange={setContent} />
            <button className='button-primary'>修改</button>
        </form>
    );
}