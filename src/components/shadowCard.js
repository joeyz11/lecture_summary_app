"use client";

export default function shadowCard({ audio }) {
    return (
        <div className="cursor-progress animate-pulse bg-gray-200 text-gray-400 flex flex-col gap-2 p-4 rounded shadow-md w-60 h-80">
            <div className="text-xl font-bold">{audio.title}</div>
            <div className="">{audio.description}</div>
        </div>
    );
}
