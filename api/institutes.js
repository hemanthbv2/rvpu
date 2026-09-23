
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json([{"instituteId":"rvpu-north","name":"RV PU College North","status":"active"},{"instituteId":"rvpu-south","name":"RV PU College South","status":"active"},{"instituteId":"rvpu-ecity","name":"RV PU College Electronic City","status":"active"},{"instituteId":"rvpu-harohalli","name":"RV PU College Harohalli","status":"active"},{"instituteId":"ssmrvpu","name":"SSMRV PU College","status":"active"},{"instituteId":"rvpu-mysore","name":"RV PU College Mysuru","status":"active"},{"instituteId":"nmkrvpu","name":"NMKRV PU College for Women","status":"active"}]);
};
