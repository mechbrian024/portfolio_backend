function handleError(res, error) {
  console.error(error);
  res.status(500).send('An error occurred');
}

function getErrorMessage(errMsg) {
 console.log("An error occurred: ", errMsg);
}

export default {handleError: handleError, getErrorMessage: getErrorMessage};