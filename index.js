import express from 'express';
import qrcode from 'qrcode-terminal';
import qrcodeImage from 'qrcode'; // For generating QR code as an image
import whatsappWeb from 'whatsapp-web.js';
import puppeteer from 'puppeteer';

const { Client, LocalAuth } = whatsappWeb;

// Initialize WhatsApp client

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/chromium' || '/usr/local/bin/chromium', // Try both paths
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Initialize Express server
const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeImage = ''; // Store QR code as a base64 string
let isAuthenticated = false; // Track authentication status

// Generate and store QR code
client.on('qr', async (qr) => {
    console.log('QR code received, scan it with your phone:');
    qrcode.generate(qr, { small: true }); // Display QR code in terminal

    // Generate QR code as a base64 image for Express server
    qrCodeImage = await qrcodeImage.toDataURL(qr);
    isAuthenticated = false; // Mark as not authenticated yet
});

// Log when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');
    qrCodeImage = ''; // Clear QR code once authenticated
    isAuthenticated = true; // Mark as authenticated
});

// Task management logic
const tasksList = [];
client.on('message', (msg) => {
    const content = msg.body;

    // Helper function: Get formatted task list
    const getFormattedTasks = () => {
        if (tasksList.length === 0) {
            return ['Suas tarefas acabaram, parabéns!😌'];
        }
        return tasksList.map((task, index) => `${index + 1} - ${task}`);
    };

    // Add a task (when message starts with "#")
    if (content.startsWith('#')) {
        const newTask = content.slice(1).trim();
        tasksList.push(newTask);
        msg.reply('Anotado, chefe! 😉');
    }

    // Show all tasks
    if (content.toLowerCase() === 'minhas tarefas') {
        msg.reply(getFormattedTasks().join('\n'));
    }

    // Remove a task (when message starts with "Tarefa" or "tarefa")
    if (content.toLowerCase().startsWith('tarefa')) {
        const taskNumber = parseInt(content.slice(-1), 10); // Extract the number
        if (!isNaN(taskNumber) && taskNumber > 0 && taskNumber <= tasksList.length) {
            tasksList.splice(taskNumber - 1, 1); // Remove the task by index
            msg.reply(getFormattedTasks().join('\n'));
        } else {
            msg.reply('Tarefa inválida. Por favor, informe um número válido!');
        }
    }
});

// Start the WhatsApp client
client.initialize();

// Serve the QR code on a webpage
app.get('/', (req, res) => {
    if (isAuthenticated) {
        res.send('<h1>✅ Client is authenticated and ready!</h1>');
    } else if (qrCodeImage) {
        res.send(`
            <h1>Scan the QR code with WhatsApp</h1>
            <img src="${qrCodeImage}" alt="QR Code" />
        `);
    } else {
        res.send('<h1>QR code not available yet. Please wait...</h1>');
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});