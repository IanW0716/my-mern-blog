// import {Link} from "react-router-dom";

export function Header(){
    return (
        <header className="flex-0 justify-between items-center mx-20 my-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
            {/*logo*/}
                <a href="" className="text-xl font-bold text-slate-800 hover:text-purple-600 transition-colors">
                    我的博客</a>
            {/*菜单*/}
                <nav className="flex items-center gap-6">
                    <a href="https://www.baidu.com" target="_blank" className="text-slate-600 hover:text-purple-600 transition-colors">登陆</a>
                    <a href="www.google.com" className="text-slate-600 hover:text-purple-600 transition-colors">注册</a>
                </nav>
            </div>
        </header>
    );
}