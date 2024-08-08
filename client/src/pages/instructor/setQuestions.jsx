import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;


const SetQuestions = () => {

    const { control, handleSubmit } = useForm({
        defaultValues: {
            questions: Array.from({ length: 2 }, (_, index) => ({ index, question: '', options: ['', '', '', ''], correctAnswer: 0 }))
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions'
    });

    const { course_id } = useParams();


    const onSubmit = async (quesData) => {
        console.log(quesData);
        console.log(course_id);
        try {
            const response = await fetch(`${BASE_URL}/quiz/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quesData, course_id }), // Use in POST
            });


            if (!response.ok) {
                const data = await response.json();
                if (data.message === "Enter all question titles") alert("Enter all question titles");
                // throw new Error('Network response was not ok');
                else if (data.message === "Enter all question options") alert("Enter all question options");
                else if (data.message === "Select a correct answer") alert("Select a correct answer");
                console.log(data.message);
                console.log(data.errors);
                if (data.errors.length > 0) alert("Error: " + data.errors);
            }
        } catch (error) {
            console.log("Error while sending data", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-7xl mt-12 bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Set Questions</h1>
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-6 mx-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xl font-semibold">Question {index + 1}</label>
                            <button type="button" onClick={() => {
                                remove(index);
                            }} className="text-red-500 hover:text-red-600">
                                <FaTrashAlt />
                            </button>
                        </div>
                        <Controller
                            name={`questions.${index}.question`}
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
                                            <input {...field} type="radio" value={parseInt(optionIndex)} className="form-radio text-blue-600" />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button type="button" onClick={() => append({ index: fields.length, question: '', options: ['', '', '', ''], correctAnswer: '' })} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                        <AiOutlinePlusCircle className="mr-2" /> Add Question
                    </button>
                </div>
                <div className="text-center mt-8">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default SetQuestions;