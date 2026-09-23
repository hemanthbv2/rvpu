
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const instId = req.query.instituteId || 'rvpu-north';
  const leads = [{"sessionId":"sess_101","timestamp":"2026-09-23T05:31:32.129Z","data":{"name":"Aarav Sharma","phone":"+91 98450 12345","email":"aarav.sharma@gmail.com","stream":"Science (PCMC)","status":"Verified"}},{"sessionId":"sess_102","timestamp":"2026-09-23T01:31:32.129Z","data":{"name":"Diya Patel","phone":"+91 98860 67890","email":"diya.p@outlook.com","stream":"Commerce (SEBA)","status":"Counseling Scheduled"}},{"sessionId":"sess_103","timestamp":"2026-09-22T17:31:32.129Z","data":{"name":"Rohan Deshmukh","phone":"+91 97410 99881","email":"rohan.d@gmail.com","stream":"Science (PCMB)","status":"New Inquiry"}}].map(l => ({ ...l, instituteId: instId }));
  res.json(leads);
};
