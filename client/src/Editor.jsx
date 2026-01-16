import ReactMarkdown from "react-markdown";

// 建议将 Editor 修改为接收 value 和 onChange 的形式
export default function Editor({ value, onChange }) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-[500px] mt-2 mb-4">
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-700">Markdown 编辑模式</span>
                <span className="text-xs text-slate-400 font-mono">支持实时预览</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* 左侧编辑区 */}
                <textarea
                    className="w-full h-full resize-none px-4 py-3 text-sm font-mono text-slate-800 outline-none border-r border-slate-200"
                    placeholder="在此输入内容..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    spellCheck={false}
                />

                {/* 右侧预览区 - 结合你已有的 prose 样式保持高级感 */}
                <div className="flex flex-col bg-slate-50 overflow-y-auto px-4 py-3">
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{value}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}