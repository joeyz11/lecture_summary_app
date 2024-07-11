"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function UploadBox({
    userId,
    addShadowCard,
    replaceWithHomeCard,
}) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        setFile(newFile);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }
        if (!title.trim() || !description.trim()) {
            alert("Please enter a title and description");
            return;
        }

        const created_at = Date.now().toString();
        const flashcard_set_id = uuidv4();
        const is_shadow = true;

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("created_at", created_at);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("flashcard_set_id", flashcard_set_id);
        formData.append("is_shadow", is_shadow);
        formData.append("file", file);
        const upload = fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        addShadowCard({
            title: title,
            description: description,
            created_at: created_at,
            is_shadow: is_shadow,
        });

        setTitle("");
        setDescription("");
        setFile(null);

        const uploadRes = await upload;
        let res = await uploadRes.json();
        if (res.error) {
            console.log(res.error);
        } else {
            console.log(res.message);
        }

        replaceWithHomeCard(created_at);
    };

    return (
        <div className="flex flex-col w-96 m-16">
            <input
                type="text"
                placeholder="Title"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <input
                type="text"
                placeholder="Short description"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <div className="flex flex-col items-center justify-center h-96 w-96 bg-gray-200 border-2 border-dashed border-gray-400 rounded-3xl">
                <input
                    type="file"
                    accept="audio/*"
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
            {file ? (
                <div className="w-full truncate">
                    Selected file: {file.name}
                </div>
            ) : (
                <div className=""> No file selected</div>
            )}
            {file && title.trim() && description.trim() ? (
                <button
                    className="text-center bg-blue-500 hover:opacity-80 text-white font-semibold py-2 px-4 rounded-3xl"
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
