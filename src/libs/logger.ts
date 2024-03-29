/**
 * Logger class that provides logging functionality using Winston and Express Winston.
 *
 * Creates a Winston logger instance on construction that logs to console in development.
 *
 * Provides log(), getRequestLogger() and getRequestErrorLogger() methods to log messages,
 * log HTTP requests, and log HTTP errors respectively.
 */
import expressWinston from "express-winston";
import winston from "winston";
const { createLogger, format, transports } = winston;

class Logger {
  private logger: any;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.colorize(),
        format.simple()
      ),
    });

    if (process.env.ENV !== "production") {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }
  }

  public log(level?: string, ...msg: any[]) {
    this.logger.log(level, msg);
  }

  public getRequestLogger() {
    return expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      meta: process.env.ENV !== "production", // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute(req, res) {
        return false;
      }, // optional: allows to skip some log messages based on request and/or response
    });
  }

  public getRequestErrorLogger() {
    return expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    });
  }
}
export { Logger };
