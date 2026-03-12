const env = {
  jwtSecret: process.env.JWT_SECRET || "changeme",
  port: Number(process.env.PORT) || 3333,
  appUrl: process.env.APP_URL || "http://localhost:3333",
};

export { env };
