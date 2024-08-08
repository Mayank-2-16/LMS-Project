/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            equalmix: "rgb(255,249,241)",
            homepagebgcolor: "rgb(31,31,51)",
            videoplaybackcolor: "rgba(31,31,51,0.95)",
            coursedetailsbgcolor: "#F3F4F8",
            coursedetailsbordercolor: "#edeef2",
            teacherdetailsimagecolor: "rgb(229,225,210)",
            courseeditbgcolor: "rgba(243,243,243,0.8)",
        },
        backgroundImage: {
            'bghomeimage': "url(src/assets/bghomepage.jpg)",
            'bghomeimage2': "url(src/assets/bghomepage2.jpg)",
            'loginpagebg': "url(src/assets/loginpagebg.png)",
            'bgquestionnairepage': "url(../src/assets/bg-questionnaire-page.jpg)",
            'chatimage': "url(https://i.pinimg.com/736x/fb/2f/d6/fb2fd6ad29ac6749ae20e1249606e78b.jpg)",
        },
        spacing: {
            '128': '32rem',
            '144': '36rem',
            '148': '37rem',
            '160': '40rem',
            '168': '42rem',
            '176': '44rem',
            '200': '50rem'
        }
    }
  },
  plugins: [],
}

