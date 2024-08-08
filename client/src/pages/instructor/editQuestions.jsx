import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditQuestionsPage = () => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            questions: []
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions'
    });

    const { course_id } = useParams();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/quiz/questions/${course_id}`);
                reset({ questions: response.data });
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };
        fetchQuestions();
    }, [course_id, reset]);

    const [showDeleteButton, setShowDeleteButton] = useState(Array(fields.length).fill(false));

    const handleShowDeleteButton = (index, value) => {
        const newShowDeleteButton = [...showDeleteButton];
        newShowDeleteButton[index] = value;
        setShowDeleteButton(newShowDeleteButton);
    }

    const onSubmit = data => {
        axios.put(`${BASE_URL}/quiz/update/${course_id}`, data)
            .then(response => {
                console.log("Questions updated successfully:", response.data);
            })
            .catch(error => {
                console.error("Error updating questions:", error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-7xl mt-12 bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Edit Questions</h1>
                {fields.map((field, index) => (
                    <div 
                        key={field.id} 
                        className="mb-6 mx-6"
                        onMouseEnter={() => handleShowDeleteButton(index, true)}
                        onMouseLeave={() => handleShowDeleteButton(index, false)}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xl font-semibold">Question {index + 1}</label>
                            <button type="button" onClick={() => remove(index)} className={`${showDeleteButton[index] ? 'opacity-100' : 'opacity-0'} text-red-500 hover:text-red-700`}>
                                <FaTrashAlt />
                            </button>
                        </div>
                        <Controller
                            name={`questions.${index}.questionText`}
                            control={control}
                            render={({ field }) => <input {...field} placeholder="Enter question" className="w-full px-4 py-2 mb-4 border outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array(4).fill().map((_, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                    <Controller
                                        name={`questions.${index}.options.${optionIndex}`}
                                        control={control}
                                        render={({ field }) => <input {...field} placeholder={`Option ${optionIndex + 1}`} className="flex-1 px-4 py-2 border outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />}
                                    />
                                    <Controller
                                        name={`questions.${index}.correctAnswer`}
                                        control={control}
                                        render={({ field }) => (
                                            <input 
                                                {...field} 
                                                type="radio" 
                                                value={optionIndex} 
                                                checked={field.value === optionIndex} 
                                                onChange={() => setValue(`questions.${index}.correctAnswer`, optionIndex)}
                                                className="form-radio text-blue-600" 
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button type="button" onClick={() => append({ questionText: '', options: ['', '', '', ''], correctAnswer: '' })} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                        <AiOutlinePlusCircle className="mr-2" /> Add Question
                    </button>
                </div>
                <div className="text-center mt-8">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditQuestionsPage;
