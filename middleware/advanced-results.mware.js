
const advancedResults = (model, populate) => async (req, res, next) => {

  const removeFields = ['select', 'sort', 'page', 'limit'];
  const defaultSort = '-createdAt';
  
  const reqQuery = removeFields.reduce((acc, currParam) => { delete acc[currParam]; return acc; }, { ...req.query });
  const queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${ match }`);

  // SELECT & SORT
  const selectFields = req.query.select ? req.query.select.split(',').join(' ') : null;
  const sortByFields = req.query.sort ? req.query.sort.split(',').join(' ') : defaultSort;

  // PAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await model.countDocuments();

  const pagination = {
    next: endIdx < total ? { page: page + 1, limit } : null,
    prev: startIdx > 0 ? { page: page - 1, limit } : null
  }

  let query = model.find(JSON.parse(queryStr));

  if(selectFields) { query = query.select(selectFields); }

  query = query.sort(sortByFields).skip(startIdx).limit(limit);

  // POPULATE
  if(populate) { query = query.populate(populate); }

  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next();

};

module.exports = advancedResults;
