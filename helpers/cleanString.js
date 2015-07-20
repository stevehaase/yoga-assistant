module.exports = function validString(s) {
	if ('String' != typeof s){
		s = '';
	}
	return s.trim();
}
