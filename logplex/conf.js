var env = process.env;

module.exports = {
  logplex: {
    hostname: env.LOGPLEX_HOST || 'localhost',
    udpPort: env.LOGPLEX_UDP_PORT || 9996,
    webPort: env.LOGPLEX_WEB_PORT || 9999
  },
}
