export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center gap-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
            Loading...
        </div>
    );
}
