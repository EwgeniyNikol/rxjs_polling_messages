const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Хранилище отправленных ID сообщений
const sentIds = new Set();

function generateRandomMessage() {
    const timestamp = Math.floor(Date.now() / 1000);
    const received = timestamp - Math.floor(Math.random() * 86400);
    
    return {
        id: uuidv4(),
        from: faker.internet.email(),
        subject: faker.lorem.sentence({ min: 3, max: 8 }),
        body: faker.lorem.paragraph(),
        received: received
    };
}

function generateUnreadMessages() {
    const count = Math.floor(Math.random() * 5); // 0-4 сообщений
    const messages = [];
    
    for (let i = 0; i < count; i++) {
        const message = generateRandomMessage();
        if (!sentIds.has(message.id)) {
            sentIds.add(message.id);
            messages.push(message);
        }
    }
    
    return messages;
}

app.get('/messages/unread', (req, res) => {
    const messages = generateUnreadMessages();
    res.json({
        status: "ok",
        timestamp: Math.floor(Date.now() / 1000),
        messages: messages
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});