import React, {useState} from "react"
import ReactMarkdown from "react-markdown";
import {useDebounce} from "../hooks/useDebounce.jsx";

const defaultText = `# 欢迎使用 Markdown 编辑器

在左侧输入 Markdown，在右侧可以实时预览效果。

## 你可以试试这些：

- 标题：\`# 一级标题\`
- 粗体：\`**bold**\`
- 斜体：\`*italic*\`
- 列表：\`- item1\`

`;

function MarkdownEditor(){
    const [value,setValue] = useState(defaultText);
    const debouncedValue = useDebounce(value,1000);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <>
            <div className={"w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-98"}>
                {/*顶部标题栏*/}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <h1 className="text-lg font-semibold text-slate-800">Markdown编辑器</h1>
                    <span className="text-xs text-slate-500">实时预览</span>
                </div>

            {/*两侧主体栏*/}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/*左侧编辑区*/}
                <div className="flex flex-col">
                    <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">编辑</div>
                    <textarea
                        className="flex-1 w-full resize-none px-4 py-3 text-sm font-mono text-slate-800
                         outline-none bg-white overflow-y-auto"
                        value={value}
                        onChange={handleChange}
                        spellCheck={false}></textarea>
                </div>
                {/*右侧预览区*/}
                <div className="flex flex-col bg-slate-50">
                    <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">预览</div>
                    <div className="flex-1 px-4 py-3 overflow-auto text-sm leading-relaxed text-slate-800 overflow-y-auto">
                        <ReactMarkdown>{debouncedValue}</ReactMarkdown>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default MarkdownEditor;
