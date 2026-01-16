import Post from '../Post';
import {useEffect, useState} from "react";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('https://my-mern-blog-n6yk.onrender.com/post')
            .then(res => res.json())
            .then(posts => setPosts(posts));
    },[])
    return (
        <div className='page-fade-in'>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </div>
    )
}