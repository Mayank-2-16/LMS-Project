import React, { useEffect } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { TbCards, TbCash, TbChartHistogram, TbLogout, TbMessageDots } from 'react-icons/tb';
import { LuUser2 } from 'react-icons/lu';
import { GoTrash } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegStar } from 'react-icons/fa6';
import { IoIosChatboxes } from 'react-icons/io';

const user = {
    role: "Teacher",
}


const SideBar = () => {
    const navigate = useNavigate();
    const [user_id, setUserId] = React.useState(null);
    useEffect(() => {
        const allCookies = document.cookie;
        if (allCookies && allCookies.split(";")) {
            const allTokens = allCookies.split(";");
            const token = allTokens.find(cookie => (cookie.trim().startsWith("token=")) ? cookie : null);
            if (token) {
                const user_id = JSON.parse(atob(token.split('.')[1]))._id;
                setUserId(user_id);
            }
        }
    });

    return (
        <div className=" w-64">
            <div className="flex flex-col h-full">
                {/* Sidebar Header */}

                {/* Sidebar Links */}
                <div className="flex-1 bg-white rounded-xl py-4 px-2 overflow-y-auto">
                    {/* Dashboard */}
                    <Link
                        to="/profile/dashboard"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300"
                    >
                        <RxDashboard className="text-lg mr-3" />
                        <span className="text-lg font-medium">Dashboard</span>
                    </Link>
                    {/* Edit Profile */}
                    <Link
                        to="/profile/edit"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300"
                    >
                        <LuUser2 className="text-lg mr-3" />
                        <span className="text-lg font-medium">Edit Profile</span>
                    </Link>
                    {/* Earnings */}
                    {user.role === "Teacher" ? <Link
                        to="/profile/earnings"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300"
                    >
                        <TbChartHistogram className="text-lg mr-3" />
                        <span className="text-lg font-medium">Earnings</span>
                    </Link> : null}
                    {/* Uploaded Courses */}
                    {user.role === "Teacher" ? <Link
                        to="/profile/uploaded-courses"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300"
                    >
                        <TbCards className="text-lg mr-3" />
                        <span className="text-lg font-medium">Uploaded Courses</span>
                    </Link> : null}
                    {/* Chat */}
                    <Link
                        to={`/profile/chat/${user_id}`}
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300 delay-50"
                    >
                        <TbMessageDots className="text-lg mr-3" />
                        <span className="text-lg font-medium">Chat</span>
                    </Link>
                    {/* Reviews */}
                    <Link
                        to="/profile/reviews"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300 delay-50"
                    >
                        <FaRegStar className="text-lg mr-3" />
                        <span className="text-lg font-medium">My Reviews</span>
                    </Link>
                    {/* Payouts */}
                    {user.role === "Teacher" ? <Link
                        to="/profile/payouts"
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-orange-400 rounded-lg my-2 transition duration-300"
                    >
                        <TbCash className="text-lg mr-3" />
                        <span className="text-lg font-medium">Payouts</span>
                    </Link> : null}
                    {/* Delete Profile */}
                    <Link
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-black hover:bg-red-500 rounded-lg my-2 transition duration-300"
                    >
                        <GoTrash className="text-lg mr-3" />
                        <span className="text-lg font-medium">Delete Profile</span>
                    </Link>
                    {/* Sign Out */}
                    <Link
                        className="flex items-center py-3 px-4 text-gray-700 hover:text-white hover:bg-gray-700 rounded-lg my-2 transition duration-300"
                    >
                        <TbLogout className="text-lg mr-3" />
                        <span className="text-lg font-medium">Sign Out</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default SideBar;