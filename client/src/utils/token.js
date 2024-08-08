// export const token = () => {
//     const allCookies = document.cookie;
//     if (allCookies && allCookies.split(";")) {
//         const allTokens = allCookies.split(";");
//         const token = allTokens.find(cookie => (cookie.trim().startsWith("token=")) ? cookie : null);
//         if(token){
//             const user_id = JSON.parse(atob(token.split('.')[1]))._id;
//             console.log(user_id);
//             return user_id;
//         }
//         else{
//             return null;
//         }
//     }
//     else{
//         return null;
//     }
// }

// // module.exports = token;
// // export default token;