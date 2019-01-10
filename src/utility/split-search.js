function splitSearch(term) {
  return term.substr(1).split('&')
    .reduce((acc, kv) => {
      const keyValue = kv.split('=');
      acc[keyValue[0]] = keyValue[1];
      return acc;
    }, {});
}

export default splitSearch;
