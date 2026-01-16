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
            <img src={img.startsWith('http') ? img:'http://localhost:4000/'+img}
                 alt=""
                 className="w-full h-full object-cover rounded-xl"
                 loading="lazy"/>
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