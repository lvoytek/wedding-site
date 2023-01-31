export default () => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	db: {
		system: process.env.DB_TYPE ?? "sqlite",
		name: process.env.DB_NAME ?? './db.sqlite3',
		username: process.env.DB_USERNAME ?? 'root',
		password: process.env.DB_PASSWORD ?? ''
	}
});
