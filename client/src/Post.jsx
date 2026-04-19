import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";
export default function Post({_id, title, summary, img, content, author, createdAt, updatedAt}) {
    return (
        <div className="
        grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-5 mb-7.5
        group hover:bg-gray-50 transition-all duration-300 p-4 rounded-2xl
        hover:shadow-lg border border-transparent hover:border-gray-200
        shadow-sm group-hover:shadow-xl
        ">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                <img
                    src={img.startsWith('http') ? img : 'https://api.gzw-blog.me/' + img}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="400"
                    height="300"
                />
            </div>
            <div>
                <Link to={`/post/${_id}`}>
                    <h2 className="m-0 text-[1.8rem]">{title}</h2>
                </Link>
                <p className="mx-1.5 my-0 flex gap-2.5 text-gray-500 text-[0.7rem] font-bold">
                    <a className="text-gray-600">{author.username}</a>
                    <time>{formatISO9075(createdAt)}</time>
                </p>
                <p className="mx-1.5 my-0 leading-[1.4rem]">{summary}</p>
            </div>
        </div>
    )
}