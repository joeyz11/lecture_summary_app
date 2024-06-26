"use client";

import { useState } from "react";

export default function UploadBox() {
    const [selectedFile, setSelectedFile] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleUpload = () => {
        console.log("upload clicked");
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }
        if (!title.trim() || !description.trim()) {
            alert("Please enter a title and description");
            return;
        }
        //TODO: UPLOAD
        alert("Upload success!!");
        setSelectedFile("");
        setTitle("");
        setDescription("");
    };

    return (
        <div className="flex flex-col w-96 m-16">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <input
                type="text"
                placeholder="Short description"
                value={description}
                onChange={handleDescriptionChange}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <div className="flex flex-col items-center justify-center h-96 w-96 bg-gray-200 border-2 border-dashed border-gray-400 rounded-3xl">
                <input
                    type="file"
                    accept="audio/*" //TODO: maybe change
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                    <div className="text-center">
                        <div className="text-lg">Click to upload</div>
                        <div className="text-sm text-gray-600">
                            Audio files only
                        </div>
                    </div>
                </label>
            </div>
            {selectedFile ? (
                <div className="w-full truncate">
                    Selected file: {selectedFile}
                </div>
            ) : (
                <div className="">No file selected</div>
            )}
            {selectedFile && title.trim() && description.trim() ? (
                <button
                    className="text-center bg-blue-500 hover:opacity-50 text-white font-semibold py-2 px-4 rounded-3xl"
                    onClick={handleUpload}
                >
                    Upload
                </button>
            ) : (
                <button className="text-center cursor-not-allowed bg-blue-500 text-white font-semibold py-2 px-4 rounded-3xl opacity-50">
                    Upload
                </button>
            )}
        </div>
    );
}
