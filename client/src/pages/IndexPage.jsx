import Post from '../Post';
import SkeletonPost from '../SkeletonPost';
import {useEffect, useState} from "react";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.gzw-blog.me/post')
            .then(res => res.json())
            .then(posts => {
                setPosts(posts);
                setLoading(false);
            });
    }, [])

    return (
        <div className='page-fade-in'>
            {loading ? (
                <>
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                </>
            ) : (
                posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post}/>
                ))
            )}
        </div>
    )
}
