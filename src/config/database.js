const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      // connection string to connect to the cluster if you add name at the end you will connect to a particular database
      //mongodb+srv://namaste_node:RTxdWmJUn0aAl662@namstenode.9cv1tbh.mongodb.net/ connection string for cluster add name after it 
      "mongodb+srv://namaste_node:RTxdWmJUn0aAl662@namstenode.9cv1tbh.mongodb.net/devTinder"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
