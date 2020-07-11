const resultsFilter = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };

  trimIgnoredFilters(reqQuery);

  let query = model.find(JSON.parse(setQueryString(reqQuery)));

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.filter = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

const trimIgnoredFilters = query => {
  const ignoredFilters = ['select', 'sort', 'page', 'limit'];
  ignoredFilters.forEach(filter => delete query[filter]);
};

const setQueryString = query => {
  return JSON.stringify(query).replace(
    /\b(eq|gt|gte|lt|lte|in|ne|nin)\b/g,
    match => `$${match}`
  );
};

module.exports = resultsFilter;
