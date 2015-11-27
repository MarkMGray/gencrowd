from google.appengine.ext import ndb

class Evaluation(ndb.Model):
    evaluationScore = ndb.IntegerProperty()
    clicks = ndb.IntegerProperty(repeated=True)
    startTime = ndb.IntegerProperty()
    endTime = ndb.IntegerProperty()

    def to_json(self):
        evaluation = {}
        evaluation["score"] = self.evaluationScore
        evaluation["clicks"] = len(self.clicks)
        evaluation["time"] = self.endTime - self.startTime
        return evaluation

    @classmethod
    def get_all_evaluations(cls):
        return cls.query().fetch()

    @classmethod
    def get_evaluation_by_citizenID(cls, citizenID):
        data = cls.query(Evaluation.citizenID == citizenID).fetch()
        if not data:
            return None
        evaluation = data[0]
        return evaluation