if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://kamykov:dupa.8@ds113738.mlab.com:13738/vidjot-prod'
  }

} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}