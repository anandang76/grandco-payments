const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const port = 5000;
// const Payment = require('./backend/controller/paymentController');
const Payment = require(path.join(__dirname, 'backend/controller/paymentController'));
const { logger } = require('./backend/utils/logger');

const isDev = false;
const isMac = process.platform === 'darwin';

let mainWindow;

console.log('Current directory:', __dirname);
console.log('Attempting to load:', path.join(__dirname, 'backend', 'controller', 'paymentController'));

// Create an Express app
const expressApp = express();
// expressApp.use(express.static('public'));
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(bodyParser.json());

expressApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

expressApp.post('/openPaymentGateway', Payment.openPaymentGateway);
expressApp.post('/startPaymentTransaction', Payment.startPaymentTransaction);
expressApp.post('/getPaymentTransactionStatus', Payment.getPaymentTransactionStatus);
expressApp.post('/cancelPaymentTransaction', Payment.cancelPaymentTransaction);
expressApp.post('/printReceipt', Payment.printReceipt);
expressApp.post('/linkedRefund', Payment.linkedRefund);
expressApp.get('/getApiInfo', Payment.getApiInfo);

// Start the Express server
expressApp.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, 'public/appIcon.png'),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Disable contextIsolation for simplicity in this example
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Load the app from the Express server
  mainWindow.loadURL(`http://localhost:${port}`);
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: () => {
                // Implement an about dialog if needed
                console.log('About dialog not implemented.');
              },
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: () => {
                // Implement an about dialog if needed
                console.log('About dialog not implemented.');
              },
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
