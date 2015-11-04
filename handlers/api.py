import json
import cgi
import webapp2
from models import Citizen

class SaveCitizen(webapp2.RequestHandler):
    def post(self):
        print "In SaveCitizen"
        print self.request.get("numrows")
        print "----"
        print self.request.get("evaluation")
        s = self.request.get("evaluation")
        print s
        print "----"
        print type(self.request.get("evaluation"))
        # temp = json.loads(self.request.get("evaluation"))
        print "request"
        print self.request
        print "end"
        citizenID = cgi.escape(self.request.get("citizenID"))
        generationID = cgi.escape(self.request.get("generationID"))
        evaluation = self.request.get("evaluation")
        response_obj={}
        # if not citizenID or len(citizenID) == 0:
        #     response_obj["response_code"] = 1
        #     response_obj["error_msg"] = "Citizen ID missing"
        #     self.response.write(json.dumps(response_obj))
        #     return
        # citizenID = int(citizenID)
        # if not generationID or len(generationID) == 0:
        #     response_obj["response_code"] = 1
        #     response_obj["error_msg"] = "Generation ID missing"
        #     self.response.write(json.dumps(response_obj))
        #     return
        # generationID = int(generationID)

        if not evaluation:
            response_obj["response_code"] = 1
            response_obj["error_msg"] = "No evaluation given"
            self.response.write(json.dumps(response_obj))
            return
        print "I come here"
        print evaluation
        response_obj["response_code"] = 0
        response_obj["message"] = "Saved Citizen Successfully"
        self.response.write(json.dumps(response_obj))
        return

class FetchCitizen(webapp2.RequestHandler):
    def post(self):
        print "In FetchCitizen"
        genCitizens = Citizen.Citizen.get_latest_generation_citizens()
        toSendCitizen = None
        for citizen in genCitizens:
            if citizen.state == 0:
                toSendCitizen = citizen
                break
        response_obj = {}
        response_obj["response_code"] = 0
        if toSendCitizen is None:
            response_obj["citizen"] = "null"
        else:
            response_obj["citizen"] = citizen
        self.response.write(json.dumps(response_obj))
        return
        # cit = Citizen()
        # citizens = Citizen.Citizen.get_all_citizens()
        # citizen = None
        # if citizens:
        #     citizen = citizens[0]
        # response_obj = {}
        # response_obj["response_code"] = 1
        # if citizen:
        #     response_obj["citizen"] = citizen
        # else:
        #     response_obj["citizen"] = "null"
        # return self.response.write(json.dumps(response_obj))

app = webapp2.WSGIApplication([('/api/save', SaveCitizen), ('/api/fetch', FetchCitizen)], debug=True)