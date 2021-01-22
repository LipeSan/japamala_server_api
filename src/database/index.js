const mongoose = require('mongoose');

let user = 'dbLipe';
let pass = 'Ab102030';
let database = 'ClusterDev';

let databaseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    //useCreateIndex: true
}

mongoose.connect(`mongodb+srv://${user}:${pass}@clusterdev.odi0k.mongodb.net/${database}?retryWrites=true&w=majority`, databaseOptions);

mongoose.connection.once('open', () => {
    console.log("CONNECTED");
}).on('error', (error) => {
    console.log("ERROR", error);
})

mongoose.Promise = global.Promise;

module.exports = mongoose;