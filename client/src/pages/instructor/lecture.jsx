import React, { useState } from 'react';
import { FaTrash, FaPencilAlt, FaSave } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi2';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";

const Lecture = ({ title, sectionIndex, lectureIndex, updateLectureTitle, deleteLecture, sectionName, setLectureData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [show, setShow] = useState(false);

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { console.log("Error while uploading File", error) },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => ({ ...prev, [urlType]: downloadURL }));
                    setLectureData(sectionIndex, lectureIndex, { title: newTitle, videoUrl: downloadURL });
                });
            }
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            // uploadFile(file, "videoUrl");
        }
    };

    const handleDelete = () => {
        deleteLecture(sectionIndex, lectureIndex);
    };

    return (
        <div
            className="border border-black px-4 py-3 mb-4 ml-10 flex items-center justify-between rounded-3xl hover:bg-gray-50"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <div className={`w-full text-lg ${isEditing ? 'flex' : ''}`}>
                <span className={`font-semibold w-[15%]`}>
                    Lecture {lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <div className='w-full flex items-center'>
                        <div className='border border-black w-full flex mr-2'>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={handleTitleChange}
                            className=" w-[90%] pl-1 flex-grow mr-2 outline-none"
                            maxLength={65}
                        />
                        <div className='mr-2 text-gray-500'>{65-newTitle.length}</div>
                        </div>
                        <FaSave className='text-xl' onClick={() => saveTitle()} />
                    </div>
                ) : (
                    <div className="flex w-full items-center flex-grow justify-between ">
                        <div className='flex items-center mr-10 flex-grow'>
                            <h3 className="mr-2 max-w-80 min-w-28">{title}</h3>
                            <HiPencil onClick={() => setIsEditing(true)} title='Edit Name' className={`${show ? 'opacity-100' : 'opacity-0'} text-xl cursor-pointer`} />
                            <FaTrash onClick={handleDelete} title='Delete Section' className={`${show ? 'opacity-100' : 'opacity-0'} text-lg cursor-pointer ml-2 mr-2`} />

                        </div>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className={`${show && !isEditing ? 'opacity-100' : 'opacity-100'} hover:cursor-pointer
                            w-[40%] file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-2 file:border-black
                            file:text-sm file:font-semibold
                          file:text-black file:bg-gray-50
                          hover:file:bg-black hover:file:text-white`}
                        />
                    </div>
                )}
            </div>

            {videoPerc > 0 && videoPerc < 100 && (
                <div className="text-xs text-gray-400">{videoPerc}%</div>
            )}
            {videoPerc === 100 && <div className="text-xs text-gray-400">Uploaded</div>}
        </div>
    );
};

export default Lecture;


/*
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { FaTrash } from 'react-icons/fa';

const Lecture = ({ title, sectionIndex, lectureIndex, updateLectureTitle, deleteLecture }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [showUploadButton, setShowUploadButton] = useState(true);

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => ({ ...prev, [urlType]: downloadURL }));
                });
            }
        );
    };

    const handleUpload = (e) => {
        e.preventDefault();
        video && uploadFile(video, "videoUrl");
        setShowUploadButton(false);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteLecture(sectionIndex, lectureIndex);
    };

    return (
        <div className="border border-black p-4 mb-4 ml-10 flex">
            <div className='w-1/2 flex'>
                <span className='font-semibold mr-1'>
                    Lecture {lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        name='title'
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        className="border pl-1"
                    />
                ) : (
                    <div className='flex'>
                        <h3 onClick={() => setIsEditing(true)}>{title}</h3>
                    </div>
                )}
            </div>
            <div className='w-1/3'>
                <input
                    type="file"
                    accept="video/*"
                    name='videoUrl'
                    onChange={(e) => {
                        setVideo(e.target.files[0]);
                        setShowUploadButton(true);
                    }}
                />
            </div>
            <button onClick={handleUpload} className={`${showUploadButton ? 'flex ml-2 text-xs my-1 px-2 border rounded text-black justify-center items-center bg-gray-200' : 'hidden'}`}>
                Upload
            </button>
            <FaTrash onClick={handleDelete} className="ml-2 text-red-500 cursor-pointer" />
            <div className={`flex pl-2 text-xs py-auto justify-center items-center ${videoPerc > 0 && !showUploadButton ? 'text-gray-400' : 'text-red-100'} mb-1`}>
                {videoPerc}%
            </div>
        </div>
    );
};

export default Lecture;
*/


/*
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { FaTrash } from 'react-icons/fa';

const Lecture = ({ title, sectionIndex, lectureIndex, updateLectureTitle, deleteLecture }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [showUploadButton, setShowUploadButton] = useState(true);

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => ({ ...prev, [urlType]: downloadURL }));
                });
            }
        );
    };

    const handleUpload = (e) => {
        e.preventDefault();
        video && uploadFile(video, "videoUrl");
        setShowUploadButton(false);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteLecture(sectionIndex, lectureIndex);
    };

    return (
        <div className="border border-black p-4 mb-4 ml-10 flex">
            <div className='w-1/2 flex'>
                <span className='font-semibold mr-1'>
                    Lecture {lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        name='title'
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        className="border pl-1"
                    />
                ) : (
                    <div className='flex'>
                        <h3 onClick={() => setIsEditing(true)}>{title}</h3>
                    </div>
                )}
            </div>
            <div className='w-1/3'>
                <input
                    type="file"
                    accept="video/*"
                    name='videoUrl'
                    onChange={(e) => {
                        setVideo(e.target.files[0]);
                        setShowUploadButton(true);
                    }}
                />
            </div>
            <button onClick={handleUpload} className={`${showUploadButton ? 'flex ml-2 px-2 border rounded text-black justify-center items-center bg-gray-200 hover:bg-gray-300' : 'hidden'}`}>
                Upload
            </button>
            <div className={`flex w-[15%] text-xs my-1 justify-center items-center ${videoPerc > 0 && !showUploadButton ? 'text-gray-400' : 'hidden'} mb-1`}>
                Uploading: {videoPerc}%
            </div>
            <FaTrash onClick={handleDelete} className={`mt-1 text-red-500 cursor-pointer ${showUploadButton ? 'ml-12' : 'ml-2'}`} />

        </div>
    );
};

export default Lecture;
*/


/*
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Lecture = ({ title, sectionIndex, lectureIndex, updateLectureTitle, deleteLecture }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [message, setMessage] = useState("");
    const [inputs, setInputs] = useState({});
    const [showUploadButton, setShowUploadButton] = useState(true);

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleAuth = async () => {
        try {
            const res = await fetch(`${BASE_URL}/video/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
                credentials: "include",
            });
            if (res.status === 401 || res.status === 403) navigate('/login');
        } catch (error) {
            console.log("Error during user Authentication");
            console.log(error);
        }
    };

    useEffect(() => {
        handleAuth();
    }, []);

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => ({ ...prev, [urlType]: downloadURL }));
                });
            }
        );
    };

    const handleUpload = (e) => {
        e.preventDefault();
        video && uploadFile(video, "videoUrl");
        setShowUploadButton(false);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteLecture(sectionIndex, lectureIndex);
    };

    return (
        <div className="border border-black p-4 mb-4 ml-10 flex">
            <div className='min-w-80 flex'>
                <span className='font-semibold mr-1'>
                    Lecture {lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        name='title'
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        className="border pl-1"
                    />
                ) : (
                    <div className='flex'>
                        <h3 onClick={() => setIsEditing(true)}>{title}</h3>
                    </div>
                )}
            </div>
            <div className='w-[40%]'>
                <input
                    type="file"
                    accept="video/*"
                    name='videoUrl'
                    onChange={(e) => {
                        setVideo(e.target.files[0]);
                        setShowUploadButton(true);
                    }}
                />
            </div>
            <button onClick={handleUpload} className={`${showUploadButton ? 'flex ml-2 px-2 border rounded text-black justify-center items-center bg-gray-200 hover:bg-gray-300' : 'hidden'}`}>
                Upload
            </button>
            <div className={`flex w-[15%] text-xs my-1 justify-center items-center ${videoPerc > 0 && !showUploadButton ? 'text-gray-400' : 'hidden'} mb-1`}>
               Uploading: {videoPerc}%
            </div>
            <FaTrash onClick={handleDelete} className={`mt-1 text-red-500 cursor-pointer ${showUploadButton ? 'ml-12' : 'ml-2'}`} />
        </div>
    );
};

export default Lecture;
*/


/*
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const Lecture = ({ title, updateLectureTitle, sectionIndex, lectureIndex, deleteLecture }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [message, setMessage] = useState("");
    const [videoUrl, setVideoUrl] = useState("")
    const [showUploadButton, setShowUploadButton] = useState(true);

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleAuth = async () => {
        try {
            const res = await fetch(`${BASE_URL}/video/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
                credentials: "include",
            });
            if (res.status === 401 || res.status === 403) navigate('/login');
        } catch (error) {
            console.log("Error during user Authentication");
            console.log(error);
        }
    };

    useEffect(() => {
        handleAuth();
    }, []);

    const uploadFile = (file, urlType) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = file.name + new Date().getTime();
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setVideoPerc(Math.round(progress));
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setInputs((prev) => ({ ...prev, [urlType]: downloadURL }));
                        setVideoUrl(downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            setShowUploadButton(false);
            const downloadURL = await uploadFile(video, "videoUrl");
            const res = await fetch(`${BASE_URL}/video/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...inputs, videoUrl: downloadURL }),
            });
            const data = await res.json();
        } catch (error) {
            console.log("Error during file upload");
            console.log(error);
        }
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteLecture(sectionIndex, lectureIndex);
    };

    return (
        <div className="border border-black p-4 mb-4 ml-10 flex">
            <div className='w-1/2 flex'>
                <span className='font-semibold mr-1'>
                    Lecture {lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        name='title'
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        className="border pl-1"
                    />
                ) : (
                    <div className='flex'>
                        <h3 onClick={() => setIsEditing(true)} className=''>
                            {title}
                        </h3>
                    </div>
                )}
            </div>
            <div className='w-1/3'>
                <input
                    type="file"
                    accept="video/*"
                    name='videoUrl'
                    onChange={(e) => {
                        setVideo(e.target.files[0]);
                        setShowUploadButton(true);
                    }}
                />
            </div>
            <button onClick={handleUpload} className={`${showUploadButton ? 'flex ml-2 px-2 border rounded text-black justify-center items-center bg-gray-200 hover:bg-gray-300' : 'hidden'}`}>
                Upload
            </button>
            <div className={`flex pl-10 text-xs my-1 justify-center items-center ${videoPerc > 0 && !showUploadButton ? 'text-gray-400' : 'hidden'} mb-1`}>
               Uploading: {videoPerc}%
            </div>
            <FaTrash onClick={handleDelete} className="ml-2 text-red-500 cursor-pointer" />
        </div>
    );
};

export default Lecture;
*/


/*
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { useNavigate } from 'react-router-dom';

const Lecture = ({ title, updateLectureTitle, sectionIndex, lectureIndex }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [video, setVideo] = useState(undefined);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [message, setMessage] = useState("");
    const [videoUrl, setVideoUrl] = useState("")
    const [showUploadButton, setShowUploadButton] = useState(true)

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let progress = 0;
    let temp = 0;

    const handleAuth = async () => {
        try {
            const res = await fetch(`${BASE_URL}/video/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
                credentials: "include",
            });
            if (res.status === 401 || res.status === 403) navigate('/login');
        } catch (error) {
            console.log("Error during user Authentication");
            console.log(error);
        }
    };
    handleAuth();

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);


        uploadTask.on(
            "state_changed",
            (snapshot) => {
                progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;

                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        setVideoUrl(downloadURL)
                        return { ...prev, [urlType]: downloadURL };
                    });
                });
            }
        );
    };

    // useEffect(() => {
    //     video && uploadFile(video, "videoUrl");
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [video]);

    const handleUpload = async (e) => {
        e.preventDefault();
        uploadFile(video, "videoUrl");
        console.log(temp);
        const res = await fetch(`${BASE_URL}/video/upload`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...inputs, videoUrl: videoUrl }),
        });
        const data = await res.json();
        setShowUploadButton(false);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    }


    const saveTitle = () => {
        updateLectureTitle(sectionIndex, lectureIndex, newTitle);
        setIsEditing(false);
    };

    return (
        <div className="border border-black p-4 mb-4 ml-10 flex">
            <div className='w-1/2 flex'>
                <span className='font-semibold mr-1'>
                    Lecture{lectureIndex + 1}:
                </span>
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        name='title'
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        className="border pl-1"
                    />
                ) : (
                    <div className='flex'>
                        <h3 onClick={() => setIsEditing(true)} className=''>
                            {title}
                        </h3>

                    </div>

                )}
            </div>
            <div className='w-1/3'>
                <input
                    type="file"
                    accept="video/*"
                    name='videoUrl'
                    onChange={(e) => {
                        setVideo(e.target.files[0])
                        setShowUploadButton(true)
                    }}
                />
            </div>
            <button onClick={handleUpload} className={`${showUploadButton === true ? 'flex ml-2 text-xs my-1 px-2 border rounded text-black justify-center items-center bg-gray-200' : 'hidden'}`}>Upload</button>
            //  <button onClick={handleUpload} className='flex ml-2 text-xs my-1 px-2 border rounded text-black justify-center items-center bg-gray-200'>Upload</button>
            <div className={`flex pl-2 text-xs py-auto justify-center items-center ${videoPerc > 0 && showUploadButton === false ? 'text-gray-400' : 'text-red-100'} mb-1`}>{videoPerc}%</div>
        </div>
    );
};

export default Lecture;

*/