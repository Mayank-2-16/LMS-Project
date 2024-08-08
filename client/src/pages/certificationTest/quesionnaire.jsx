import React, { useState, useEffect } from 'react';
import Question from './question';
import { useNavigate, useParams } from 'react-router-dom';
import thankyou from "../../assets/thankyou-check.png"
import Navbar2 from '../navbar2';

const Quesionnaire = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(10).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { course_id } = useParams();

    useEffect(() => {
        const getQuestions = async () => {
            const res = await fetch(`${BASE_URL}/quiz/questions/${course_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();
            setQuestions(data);
        }
        getQuestions();
    }, [BASE_URL, course_id]);

    const handleAnswer = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        const res = await fetch(`${BASE_URL}/quiz/submit`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answers: answers })
        });

        const data = await res.json();
        setResult(data);
        setShowResult(true);
    };

    const handleNext = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrev = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleShowResult = () => {
        if (result.passed) navigate('/courses');
        else window.location.reload();
    }

    if (showResult) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-bgquestionnairepage bg-[length:1560px_765px]">
                <div className='p-10 rounded-lg max-w-4xl text-center'>
                    <img className='mx-auto mt- w-32 h-32 ' src={thankyou} alt="Thank You" />
                    <h1 className='text-6xl font-bold  mb-10 mt-8 text-orange-400'>Thank You For Taking the Certification Test</h1>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Quiz Result</h2>
                    <p className="text-2xl font-medium mb-4 text-gray-700">Your score: {result.score}/{questions.length}</p>
                    <p className={`${result.passed ? 'text-green-400' : 'text-red-500'} text-xl mb-6`}>{result.passed ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}</p>
                    <button
                        onClick={handleShowResult}
                        className={`font-bold py-3 px-8 rounded-full transition duration-300 transform ${result.passed ? 'bg-green-400 hover:bg-green-500 text-white' : 'bg-orange-400 hover:bg-red-500 text-white'} shadow-lg hover:scale-110`}
                    >
                        {result.passed ? 'Back to Courses Page' : 'Wanna take a Re-Test?'}
                    </button>
                </div>
            </div>

        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div className='bg-bgquestionnairepage bg-[length:1560px_775px] min-h-screen'>
            <Navbar2 />
            <div className="flex justify-center ">
                <div className=" m-16 px-16 pb-6 rounded w-full">
                    <Question
                        question={questions[currentQuestionIndex]}
                        questionIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                        selectedAnswer={answers[currentQuestionIndex]}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onSubmit={handleSubmit}
                    />
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            className={`py-2 px-4 w-1/6 h-14 text-xl font-bold rounded-full ${currentQuestionIndex === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white'}`}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </button>
                        <span className='text-2xl font-semibold'>{currentQuestionIndex + 1}/{questions.length}</span>
                        <button
                            onClick={currentQuestionIndex + 1 === questions.length ? handleSubmit : handleNext}
                            className="bg-orange-500 w-1/6 h-14 text-xl font-bold rounded-full text-white py-2 px-4"
                        >
                            {currentQuestionIndex + 1 === questions.length ? 'Submit' : 'Next Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quesionnaire;