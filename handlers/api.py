import json
import cgi
import webapp2
from models import Citizen
from models import Evaluation

class SaveCitizen(webapp2.RequestHandler):
    def post(self):
        print "In SaveCitizen"
        s = self.request.get("data")
        data = json.loads(s)
        citizenID = data["citizenID"]
        generationID = data["generationID"]
        evaluationDict = data["evaluation"]
        response_obj={}
        if not citizenID or len(citizenID) == 0:
            response_obj["response_code"] = 1
            response_obj["error_msg"] = "Citizen ID missing"
            self.response.write(json.dumps(response_obj))
            return
        citizenID = int(citizenID)
        if not generationID or len(generationID) == 0:
            response_obj["response_code"] = 1
            response_obj["error_msg"] = "Generation ID missing"
            self.response.write(json.dumps(response_obj))
            return
        generationID = int(generationID)
        citizen = Citizen.Citizen.get_citizen(generationID, citizenID)
        if not citizen:
            response_obj["response_code"] = 1
            response_obj["error_msg"] = "Citizen doesn't exist"
            self.response.write(json.dumps(response_obj))
            return
        if not evaluationDict:
            response_obj["response_code"] = 1
            response_obj["error_msg"] = "No evaluation given"
            self.response.write(json.dumps(response_obj))
            return
        citizen = Citizen.Citizen()
        evaluationObj = Evaluation.Evaluation()
        evaluationObj.startTime = evaluationDict["startMs"]
        evaluationObj.startTime = evaluationDict["startMs"]
        evaluationObj.endTime = evaluationDict["endMs"]
        evaluationObj.evaluationScore = evaluationDict["surveyScore"]
        evaluationObj.clicks = evaluationDict["clicks"]
        citizen.evaluation = evaluationObj
        citizen.put()
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