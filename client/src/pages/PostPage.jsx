import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatDistanceToNow, formatISO9075} from "date-fns";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import {UserContext} from "../UserContext.jsx";
import {Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {io} from "socket.io-client";
import { zhCN } from 'date-fns/locale';

export default function PostPage(){
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const { id } = useParams();
    // 页面所有评论
    const [comments, setComments] = useState([]);
    // 输入框的评论
    const [commentContent, setCommentContent] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(()=>{
        fetch(`https://my-mern-blog-n6yk.onrender.com/post/${id}`)
            .then(res => res.json())
            .then(postInfo => {
                setPostInfo(postInfo);
            })
    },[id]);

    useEffect(()=>{
        // 获取历史评论
        fetch(`https://my-mern-blog-n6yk.onrender.com/post/${id}/comments`)
            .then(res => res.json())
            .then(history => {
                setComments(history);
            });

        // 建立websocket连接，获取实时评论
        // 1 建立连接
        const newSocket = io('https://my-mern-blog-n6yk.onrender.com');
        setSocket(newSocket);
        // 2 加入房间
        newSocket.emit('join_post', id);
        // 3 监听消息
        newSocket.on('receive_comment', (newComment) => {
            setComments(prev=>[{...newComment, isNew:true},...prev]);
        });
        // 4 清理连接
        return ()=>{
            newSocket.disconnect();
        }
    }, [id]);

    async function toggleLike(){
        if(!userInfo?.id){
            alert('请先登录！');
            return;
        }
        const currentLikes = postInfo.likes || [];
        const isLiked = currentLikes.includes(userInfo.id);

        setPostInfo(prev => {
            const newLikes = isLiked
            ? prev.likes.filter(id => id.toString() !== userInfo.id.toString())
                : [...prev.likes, userInfo.id];
            return {...prev, likes: newLikes};
        });

        try{
            const response = await fetch(`https://my-mern-blog-n6yk.onrender.com/post/${id}/likes`, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            })
            if(!response.ok) throw new Error('点赞失败');
        } catch(err){
            console.error(err);
            setPostInfo(prev => ({...prev, likes:currentLikes}));
            alert("网络有点小问题，点赞失败😭")
        }
    }
    function handleSendComment(e){
        e.preventDefault();
        // 内容为空或者未连接
        if(!commentContent.trim()||!socket) return;

        // websocket连接建立后 cookie无法直接从请求头获得
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        socket.emit('send_comment', {
            postId: id,
            content: commentContent,
            token: token,
        })
        setCommentContent('');
    }

    if(!postInfo) return '';
    return (
         <div className='max-w-4xl mx-auto px-4 py-8 page-fade-in'>
             <h1 className='text-4xl font-bold text-center text-gray-900 mb-4'>
                 {postInfo.title}
             </h1>
             <div className='text-center text-gray-500 mb-8 text-sm italic'>
                 <p>{formatISO9075(new Date(postInfo.createdAt))}</p>
                 <div className='flex justify-center items-center gap-4 mt-2'>
                     <p>by@{postInfo.author?.username}</p>
                     <button onClick={toggleLike} className='flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform active:scale-95'>
                         {(postInfo.likes || []).includes(userInfo?.id)
                             ?(<HeartIconSolid className='size-6 text-red-500' />)
                             :(<HeartIconOutline className='size-6 text-gray-500 hover:text-red-500' />)}
                         <span className='text-gray-700 font-semibold'>{(postInfo.likes?.length) || 0}</span>
                     </button>
                 </div>
             </div>
             {userInfo?.id === postInfo.author._id && (
                 <div className='flex justify-center mb-6'>
                     <Link to={`/edit/${postInfo._id}`} className='inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-md'>
                         <PencilSquareIcon className="size-6 text-gray-100" />
                         编辑
                     </Link>
                 </div>
             )}
             <div className='mb-10 overflow-hidden rounded-2xl shadow-lg h-[400px]
             border border-gray-100 shadow-sm transition-shadow  group-hover:shadow-xl'>
                 <img
                     // 兼容本地云端照片
                     src={
                         postInfo.img.startsWith('http')
                         ? postInfo.img : `https://my-mern-blog-n6yk.onrender.com/${postInfo.img}`
                    }
                     alt={postInfo.title}
                     className='w-full h-full object-cover'/>
             </div>
             <div className='"prose prose-lg max-w-none text-gray-800"'>
                 <ReactMarkdown>{postInfo.content}</ReactMarkdown>
             </div>

             <div className='mt-10 pt-8 border-t border-gray-200'>
                 <h3 className='text-2xl font-bold mb-6'>实时评论互动</h3>
                 {userInfo?.id ? (
                     <form className='mt-8 mb-6' onSubmit={handleSendComment}>
                         <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className='input-primary h-24'
                            placeholder='请撰写你的评论...'
                        />
                         <button className='button-primary w-24 mx-auto'>发送</button>
                     </form>
                 ):(
                     <div className='mb-10 text-center text-gray-500'>
                         请<Link to='/login' className='text-blue-600 underline'>登录</Link>后再参与讨论！
                     </div>
                 )}
                 <div className='space-y-4'>
                     {comments.map((comment) => (
                         <div key={comment._id}
                              className={`p-4 bg-white rounded-xl shadow-sm border border-gray-100
                              ${comment.isNew?'content-new':''}`}>
                             <div className='flex justify-between text-xs text-gray-400 mb-2'>
                                 <span className='font-bold text-gray-700'>@{comment.author?.username}</span>
                                 <span>{comment.createdAt?formatDistanceToNow(new Date(comment.createdAt), {
                                     addSuffix: true,
                                     locale: zhCN
                                 }):'刚刚'}</span>
                             </div>
                             <p className='text-gray-700'>{comment.content}</p>
                         </div>
                     ))}
                 </div>
             </div>
         </div>
     )
}