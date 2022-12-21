import * as dotenv from "dotenv";
import app from "./app";

// get environment variables
dotenv.config();

// set server's port number and initialize express
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

app.listen(PORT, () =>
{
	console.log(`Listening on port ${PORT}`);
});
