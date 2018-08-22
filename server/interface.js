const preToken = "<!DOCTYPE html><html><head><title>Pantel</title><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css\" integrity=\"sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO\" crossorigin=\"anonymous\"></head><body><div class=\"container container-fluid\"><h1>Pantel</h1><br><form method=\"POST\" action=\"/command\"><input type=\"hidden\" name=\"token\" value=\"";
const postToken="\"><input name=\"command\" type=\"text\" class=\"form-control\" placeholder=\"Command\"><br><button type=\"submit\" class=\"btn btn-primary\">Submit</button></form><br><div class=\"card\"><div class=\"card-body\">";
const postAnswer = "</div></div></div></body></html>";

exports.preToken = preToken;
exports.postToken = postToken;
exports.postAnswer = postAnswer;
