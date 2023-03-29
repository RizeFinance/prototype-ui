import querystring from 'query-string';

const toQueryString = (
  object: Record<string, unknown>,
  allowedParameters: string[] = []
): string => {
  let queryObject = object;

  if (allowedParameters && Array.isArray(allowedParameters) && allowedParameters.length > 0) {
    queryObject = Object.keys(object)
      .filter((key) => allowedParameters.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: object[key],
        };
      }, {});
  }

  const queryString = '?' + querystring.stringify(queryObject, { arrayFormat: 'bracket' });
  return queryString;
};

export default toQueryString;
