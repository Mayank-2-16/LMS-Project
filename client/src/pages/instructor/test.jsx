import React, { useState } from 'react';
import Section from './section';
import Lecture from './lecture';
import { useNavigate } from 'react-router-dom';

const Test = ({course_id}) => {
    console.log("course_id", course_id)
    const [sections, setSections] = useState([
        {
            title: 'Introduction',
            lectures: [{ id: 1, title: 'Introduction', videoUrl: '', isHidden: false }]
        }
    ]);

    const addSection = () => {
        setSections([...sections, { sectionName: 'New Section', lectures: []}]);
    };

    const addLecture = (sectionIndex) => {
        const newLecture = { id: Date.now(), title: 'New Lecture', videoUrl: '', isHidden: false };
        const newSections = sections.map((section, index) => {
            if (index === sectionIndex) {
                return {
                    ...section,
                    lectures: [...section.lectures, newLecture]
                };
            }
            return section;
        });
        setSections(newSections);
    };

    const updateSectionTitle = (sectionIndex, newTitle) => {
        const newSections = sections.map((section, index) => {
            if (index === sectionIndex) {
                return { ...section, title: newTitle };
            }
            return section;
        });
        setSections(newSections);
    };

    const updateLectureTitle = (sectionIndex, lectureIndex, newTitle) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[sectionIndex].lectures[lectureIndex].title = newTitle;
            return updatedSections;
        });
    };

    const deleteLecture = (sectionIndex, lectureIndex) => {
        setSections((prevSections) => {
            const updatedSections = prevSections.map((section, sIndex) => {
                if (sIndex === sectionIndex) {
                    const updatedLectures = section.lectures.filter((_, lIndex) => lIndex !== lectureIndex);
                    return { ...section, lectures: updatedLectures };
                }
                return section;
            });
            return updatedSections;
        });
    };

    const hideSection = (sectionIndex) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[sectionIndex].isHidden = true;
            return updatedSections;
        });
    };

    const setLectureData = (sectionIndex, lectureIndex, lectureData) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[sectionIndex].lectures[lectureIndex] = { ...updatedSections[sectionIndex].lectures[lectureIndex], ...lectureData };
            console.log(updatedSections)
            return updatedSections;
        });
    };

    const navigate = useNavigate();
    const saveCurriculum = async () => {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        try {
            console.log(sections)
            const response = await fetch(`${BASE_URL}/instructor/saveCurriculum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sections, course_id}),
            });

            // console.log(response)
            const data = await response.json()
            console.log(data);

            if (response.ok) {
                console.log('Curriculum saved successfully');
                navigate(`/instructor/editCourse/${course_id}`)
            } else {
                console.error('Failed to save curriculum');
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-6 my-4 bg-gray-100">
            {sections.map((section, sectionIndex) => (
                !section.isHidden && (
                    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm mb-10" key={sectionIndex}>
                        <Section
                            title={section.title}
                            sectionIndex={sectionIndex}
                            updateSectionTitle={updateSectionTitle}
                            addLecture={addLecture}
                            hideSection={hideSection}
                        />
                        <div className="pl-4">
                            {section.lectures.map((lecture, lectureIndex) => (
                                <Lecture
                                    key={lecture.id}
                                    title={lecture.title}
                                    sectionIndex={sectionIndex}
                                    lectureIndex={lectureIndex}
                                    updateLectureTitle={updateLectureTitle}
                                    deleteLecture={deleteLecture}
                                    sectionName={sections[sectionIndex].title}
                                    setLectureData={setLectureData}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => addLecture(sectionIndex)}
                            className="mt-2 p-2 ml-14 rounded-xl w-full sm:w-auto bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                        >
                            Add Lecture
                        </button>
                    </div>
                )
            ))}
            <div className='flex justify-between'>
            <button
                onClick={addSection}
                className="mt-4 p-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors duration-300"
            >
                Add Section
            </button>
            <button
                onClick={saveCurriculum}
                className="mt-4 p-2 rounded-xl bg-black text-white hover:bg-gray-700 transition-colors duration-300"
            >
                Save Curriculum
            </button>
            </div>
        </div>
    );
};

export default Test;