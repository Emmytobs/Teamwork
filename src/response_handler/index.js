function httpResponseHandler() {
  const success = (res, status, response) => {
    res.status(status || 200);
    return res.json(response);
  };

  const error = (res, status, err) => {
    res.status(status);
    return res.json(err);
  };

  return {
    success,
    error,
  };
}

module.exports = httpResponseHandler();
