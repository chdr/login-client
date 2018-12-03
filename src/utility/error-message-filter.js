function errorMessageFilter(response) {
  const { status } = response;
  let errorTitle = '';
  let errorDetail = '';

  switch (status) {
    case 401: {
      errorTitle = 'Login-in failed';
      errorDetail = 'The email address and password you entered did not match our records.';
      break;
    }
    default: {
      errorTitle = response.data.title;
      errorDetail = response.data.detail;
      break;
    }
  }

  return Object.assign({}, {
    errorTitle,
    errorDetail
  });
}

export default errorMessageFilter;
