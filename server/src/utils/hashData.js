const bcrypt = require('bcrypt');

const hashData = async (data, 10, (err, hash) => {
    if (err) {
        console.log(err);
    } else {
        console.log(hash);
    }
})