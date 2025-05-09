const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dheerajsharma9170:dheeraj1998@mycluster.xs13sui.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster').then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log("DB Connection Failed", err)
})

module.exports = mongoose;