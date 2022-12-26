import * as express from "express";
import {Request, Response} from "express";
import * as path from 'path';
import * as bodyParser from "body-parser";

const clientDir = path.join(__dirname, '../public');

class App
{
	public app: express.Application;

  // Routers

  /**
	 * Initialize express, database, and routing
	 */
	constructor()
	{
		this.app = express();
		this.config();

    // Add API routing
    this.app.get('/api/:name', async (req: Request, res: Response) => {
        const name = req.params["name"];
        const greeting = { greeting: `Hello, ${ name }` };
        res.send(greeting);
    });

    // Route non-api requests to angular
    this.app.use('*', express.static(path.join(clientDir, 'index.html')));

    // Finish with server error if no route found
		this.finalRoute();
	}

  /**
	 * Configure express, cross-origin requests, and body parsing
	 */
	private config(): void
	{
		// This allows AJAX requests to be made to the server from other applications
		this.app.use((req: Request, res: Response, next) =>
		{
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
			res.setHeader('Access-Control-Allow-Credentials', 'true');

			next();
		});

    // Use body parser to obtain JSON information from incoming request bodies
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));

    // Static routes go to angular
    this.app.use(express.static(clientDir));
  }

  /**
	 * If no other routes work then the route ends up here resulting in 404
	 */
	private finalRoute(): void
	{
		this.app.use((req, res, next) =>
		{
			// Render 404 page
		});
	}
}

export default new App().app;
