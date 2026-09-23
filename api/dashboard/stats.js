
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const instituteId = req.query.instituteId || 'all';
  res.json({
    leads: 28,
    interactions: 642,
    institutes: 7,
    instituteStats: [{"instituteId":"rvpu-north","name":"RV PU College North","leads":4,"interactions":92,"status":"active"},{"instituteId":"rvpu-south","name":"RV PU College South","leads":4,"interactions":92,"status":"active"},{"instituteId":"rvpu-ecity","name":"RV PU College Electronic City","leads":4,"interactions":92,"status":"active"},{"instituteId":"rvpu-harohalli","name":"RV PU College Harohalli","leads":4,"interactions":92,"status":"active"},{"instituteId":"ssmrvpu","name":"SSMRV PU College","leads":4,"interactions":92,"status":"active"},{"instituteId":"rvpu-mysore","name":"RV PU College Mysuru","leads":4,"interactions":92,"status":"active"},{"instituteId":"nmkrvpu","name":"NMKRV PU College for Women","leads":4,"interactions":92,"status":"active"}]
  });
};
