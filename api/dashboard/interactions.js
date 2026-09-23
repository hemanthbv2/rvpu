
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const instId = req.query.instituteId || 'rvpu-north';
  const logs = [{"s":"sess_101","d":"2026-09-23T07:28:32.127Z","t":"message","i":"courses_science","q":"What combinations are offered?","m":{"score":19.2,"status":"Answered"}},{"s":"sess_102","d":"2026-09-23T07:24:32.129Z","t":"click","i":"navigation_redirect","q":"take me to admissions","m":{"score":10,"status":"Navigated"}},{"s":"sess_103","d":"2026-09-23T07:17:12.129Z","t":"message","i":"admissions_eligibility","q":"What is the cutoff percentage?","m":{"score":14.5,"status":"Answered"}},{"s":"sess_104","d":"2026-09-23T07:08:12.129Z","t":"message","i":"leadership_principal","q":"who is the principal","m":{"score":12,"status":"Answered"}},{"s":"sess_105","d":"2026-09-23T06:56:32.129Z","t":"message","i":"facilities_labs","q":"tell me about science labs and sports","m":{"score":16.8,"status":"Answered"}}].map(l => ({ ...l, instituteId: instId }));
  res.json(logs);
};
