__author__ = 'markgray'
import json
import webapp2

class SaveCitizen(webapp2.RequestHandler):
    def post(self):
        print "Here we are saving the citizen!!!"
        response_obj = {}
        response_obj["response_code"] = "0"
        response_obj["message"] = "Successfuly saved Citizen"
        self.response.write(json.dumps(response_obj))


app = webapp2.WSGIApplication([('/api/save', SaveCitizen)], debug=True)