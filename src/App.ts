import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import {
  AuthenticatorChecker,
  SessionMiddleware,
} from '@/Middleware/AuthMiddleware';
import passport from 'passport';
import cors from 'cors';
const app = express();

// Configure CORS properly
app.use(
  cors({
    origin: '*', // Replace with your frontend app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.options('*', cors()); // Add this to support preflight across all routes
app.use(SessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the 'Frontend/build' directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

function getAllFilePaths(directoryPath: string): string[] {
  let filePaths: string[] = [];

  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      filePaths = filePaths.concat(getAllFilePaths(filePath));
    } else {
      filePaths.push(filePath);
    }
  });
  return filePaths;
}

const loadRoutes = async () => {
  try {
    const ignoreRoutesPath = [
      'NonRestrictedRoutes',
      'RestrictedRoutes',
      'Authentication',
      'Routes',
    ];
    const files = getAllFilePaths(__dirname);
    const routeFiles = files.filter((file) =>
      file.toLowerCase().includes('routes')
    );
    for (const file of routeFiles) {
      const routePath = file.replaceAll('\\', '/').split('/');
      const fileName = routePath.pop();
      const pathPhase = routePath.pop() || '';
      const path_name = `${
        ignoreRoutesPath.includes(pathPhase) ? '' : '/' + pathPhase
      }${fileName?.split('.')[0] || ''}`;

      if (file.toLowerCase().includes('public')) {
        const { default: route } = await import(`${file}`);
        app.use(`/api/public/${path_name}`, route);
      } else {
        const { default: route } = await import(`${file}`);
        app.use(`/api/${path_name}`, AuthenticatorChecker, route);
      }
    }
  } catch (error) {
    console.error('Error loading routes:', error);
  }
};

loadRoutes().then(async () => {
  if (process.env.enviorment === 'development') {
    (await import('./swagger')).initSwagger(app);
  }
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
});

export default app;
