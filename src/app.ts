import express from "express";
import bodyParser from "body-parser";

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

    // Add routing

		this.finalRoute();
	}

  /**
	 * Configure express, cross-origin requests, and body parsing
	 */
	private config(): void
	{
		this.app.use(express.json());
		this.app.use(express.static("static"));

		// This allows AJAX requests to be made to the server from other applications like JCT Word
		this.app.use((req, res, next) =>
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
