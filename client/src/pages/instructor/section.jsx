import React, { useState } from 'react';
import { FaTrash, FaSave } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';

const Section = ({ title, sectionIndex, updateSectionTitle, addLecture, hideSection }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [show, setShow] = useState(false);

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const saveTitle = () => {
        updateSectionTitle(sectionIndex, newTitle);
        setIsEditing(false);
    };

    const handleHide = () => {
        hideSection(sectionIndex);
    };

    return (
        <div
            className="flex items-center mb-6 w-full text-xl"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <div className='flex w-full'>
                <h3 className={`${isEditing ? 'w-[14%]' : 'w-[12%]'} font-semibold `}>Section {sectionIndex + 1}: </h3>
                {isEditing ? (
                    <div className='w-full flex items-center'>
                        <div className='border items-center border-black w-full flex mr-2'>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={handleTitleChange}
                                className="w-[85%] pl-1 mr-2 flex-grow outline-none"
                                maxLength={45}
                            />
                            <p className='mr-2 text-gray-500'>{45 - newTitle?.length}</p>
                        </div>
                        <FaSave className='text-xl' onClick={() => saveTitle()} />
                    </div>
                ) : (
                    <div className='flex items-center'>
                        <h3 onClick={() => setIsEditing(true)} className="mr-2 cursor-pointer">
                            {title}
                        </h3>
                        <HiPencil onClick={() => setIsEditing(true)} title='Edit Name' className={`${show ? 'opacity-100' : 'opacity-0'} text-xl cursor-pointer`} />
                        <FaTrash onClick={handleHide} className={`${show ? 'opacity-100' : 'opacity-0'} text-lg cursor-pointer ml-2`} />
                    </div>

                )}
            </div>
        </div>
    );
};

export default Section;
