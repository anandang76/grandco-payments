const winston = require('winston');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: 'log-%DATE%.log',
    dirname: './logs',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
});

let alignColorsAndTime = winston.format.combine(
    winston.format.colorize(),

    winston.format.timestamp({
        format: "YY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
        info => ` ${info.level}  ${info.timestamp}   : ${info.message}`
    )
);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transport,
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new (winston.transports.Console)({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
        }),
        //new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});




module.exports = { logger };
