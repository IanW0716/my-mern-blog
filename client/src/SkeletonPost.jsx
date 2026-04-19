export default function SkeletonPost() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-5 mb-7.5 p-4 rounded-2xl border border-gray-100 animate-pulse">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
            <div className="flex flex-col gap-3 justify-center">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    );
}
