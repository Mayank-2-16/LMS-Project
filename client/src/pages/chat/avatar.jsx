import { useNavigate } from "react-router-dom";
export default function Avatar({ userId, username, online, size }) {

    const navigate = useNavigate();
    const colors = ['bg-teal-200', 'bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200',
        'bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200'];
    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
    return (
        <div onClick={() => navigate('/profile/dashboard')} className={`${color} w-${size} h-${size} relative rounded-full flex items-center mr-1 hover:cursor-pointer`}>
            <div className="text-center text-2xl w-full opacity-70 mb-1">{username && username[0].toUpperCase()}</div>
            {online && (
                <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
            )}
        </div>
    );
}