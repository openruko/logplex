var env = process.env;

module.exports = {
  logplex: {
    hostname: env.LOGPLEX_HOST || 'localhost',
    webPort: env.LOGPLEX_WEB_PORT || 9996,
    udpPort: env.LOGPLEX_UDP_PORT || 9999
  },
}
