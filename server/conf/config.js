const env = process.env

module.exports = {
    serverPort: env.serverPort || 3000,

    mongoHost: env.mongoHost || 'localhost',
    mongoDatabase: env.mongoDatabase || 'blog',
    mongoPort: env.mongoPort || 52777,

    redisHost: env.redisHost || '127.0.0.1',
    redisPort: env.redisPort || 52778,
    redisPassword: env.redisPassword || '',

    tokenSecret: env.tokenSecret || 'test',
    tokenExpiresIn: env.tokenExpiresIn || 3600,

    defaultAdminName: env.defaultAdminName || 'admin',
    defaultAdminPassword: env.defaultAdminPassword || 'admin123'
}
