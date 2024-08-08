import React from 'react'
import { Link } from 'react-router-dom'

const LeftNavbar = () => {
    return (
        <div>
            <div className='w-[23%] h-screen p-36 bg-gray-200 flex flex-col fixed'>
                <Link to="/instructor/course/course_id/manage/curriculum" >Curriculum</Link>
                <Link to="/instructor/course/course_id/manage/curriculum" >Curriculum</Link>
                <Link to="/instructor/course/course_id/manage/curriculum" >Curriculum</Link>
            </div>
        </div>
    )
}

export default LeftNavbar
