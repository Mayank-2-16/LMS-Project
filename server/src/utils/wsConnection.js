const ws = require("ws");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

const setupWebSocketServer = (server) => {
    const wss = new ws.WebSocketServer({ server });

    wss.on("connection", async (connection, req) => {
        const allCookies = req.headers.cookie ? req.headers.cookie.split(";") : [];
        if (allCookies.length) {
            const tokenCookie = allCookies.find(cookie => cookie.trim().startsWith("token="));
            if (tokenCookie) {
                const token = tokenCookie.split("=")[1];
                if (token) {
                    jwt.verify(token, "Secret-Key", async (err, user) => {
                        if (err) {
                            connection.send("Unauthorized");
                        } else {
                            const { _id } = user;
                            try {
                                const userDetails = await userModel.findById(_id);
                                connection.username = userDetails.name;
                                connection.userId = _id;

                                connection.on("message", async (message) => {
                                    messageData = JSON.parse(message.toString());
                                    console.log("message", messageData);
                                    const { recipient, text } = messageData;
                                    if (recipient && text) {
                                            const messageData = await messageModel.create({ sender: connection.userId, recipient, text });
                                            [...wss.clients].filter((client) => client.userId === recipient)
                                            .forEach(c => c.send(JSON.stringify({
                                                text,
                                                sender:connection.userId,
                                                recipient,
                                                _id:messageData._id,
                                              })));
                                        // }
                                    }
                                });
                            } catch (fetchErr) {
                                console.error("Error fetching user details:", fetchErr);
                            }
                        }
                    });
                }
            }
        }
    });
};

module.exports = setupWebSocketServer;
