
//PAGINATION MIDDLEWARE
//takes the model as a param

const paginatedResults = async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      //next results
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      //previous results
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (err) {
        res.status(500).json({ msg: err.message })
      }
  };

  module.exports = paginatedResults; 