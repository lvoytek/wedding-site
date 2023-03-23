export default () => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	db: {
		system: process.env.DB_TYPE ?? "sqlite",
		name: process.env.DB_NAME ?? './db.sqlite3',
		username: process.env.DB_USERNAME ?? 'root',
		password: process.env.DB_PASSWORD ?? ''
	},
	auth: {
		google_client_id: process.env.GOOGLE_CLIENT_ID,
		jwt_secret: process.env.JWT_SECRET ?? "insecure_jwt_secret",
		jwt_expire_time: process.env.JWT_EXPIRE_TIME ?? "30m"
	}
});
