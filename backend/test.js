const mongoose = require('mongoose');

const test = async () => {
  try {
    console.log("Connecting...");
    await mongoose.connect('mongodb://farmadmin:suryanshu23dhakad@ac-yvw4cfq-shard-00-00.zblqdpw.mongodb.net:27017,ac-yvw4cfq-shard-00-01.zblqdpw.mongodb.net:27017,ac-yvw4cfq-shard-00-02.zblqdpw.mongodb.net:27017/f2c?ssl=true&replicaSet=atlas-e4tvsu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=farm2home-cluster');
    console.log("Connected!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
test();
