import React from 'react';

const Question = ({ question, questionIndex, totalQuestions, selectedAnswer, onAnswer, onNext, onPrev, onSubmit }) => {
    const handleAnswerClick = (answer) => {
        onAnswer(questionIndex, answer);
    };

    return (
        <div className="text-center  h-[110%] flex flex-col items-center">
            <h2 className="text-4xl  w-[18%] p-2 pb-3 text-red-500 rounded-full mb-6">Question {questionIndex + 1}</h2>
            <p className="text-xl w-1/2 mb-16">{question.questionText}</p>
            <div className="grid grid-cols-2 gap-4 w-full">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`py-6 px-8 mb-4 text-xl bg-gray-100  border-2 font-bold hover:border-red-400 rounded-full ${selectedAnswer === option ? ' text-orange-500 border-orange-400' : 'bg-white-200'}`}
                        onClick={() => handleAnswerClick(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Question;
