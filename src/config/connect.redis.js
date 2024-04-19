const { createClient } = require("redis");

async function connectToRedis() {
  var client = createClient({
    password: "tZXPBEj839E8y5mXhjaorVqxjboo6WfR",
    socket: {
      host: "redis-11936.c241.us-east-1-4.ec2.cloud.redislabs.com",
      port: 11936,
    },
  });

  try {
    const resConnect = await client.connect();
    if (resConnect) {
      console.log("Connected successfully to Redis");
    }
    return resConnect;
  } catch (error) {
    console.error("Error connecting to Redis", error);
  }
}

module.exports = connectToRedis;
