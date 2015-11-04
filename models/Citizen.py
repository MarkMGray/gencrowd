from google.appengine.ext import ndb
import Evaluation
from CitizenHelper import FourPointClassifier
from CitizenHelper import Cell
from CitizenHelper import Perceptron

class Citizen(ndb.Model):
    state = ndb.IntegerProperty()
    citizenID = ndb.IntegerProperty()
    generationID = ndb.IntegerProperty()
    evaluation = ndb.LocalStructuredProperty(Evaluation)
    numCols = ndb.IntegerProperty()
    numRows = ndb.IntegerProperty()
    fourPointClasses = ndb.StructuredProperty(FourPointClassifier)
    cellData = ndb.StructuredProperty(Cell, repeated=True)
    classPool = ndb.StructuredProperty(Perceptron, repeated=True)

    @classmethod
    def get_all_citizens(cls):
        data = cls.query().fetch()
        if not data:
            return None
        return data

    @classmethod
    def get_citizen(cls, genID, citizenID):
        data = cls.query(ndb.AND(Citizen.generationID == genID, Citizen.citizenID == citizenID)).fetch()
        if not data:
            return None
        citizen = data[0]
        if not citizen:
            return None
        return citizen

    @classmethod
    def get_eval_of_citizen(cls, genID, citizenID):
        citizen = Citizen.get_citizen(genID, citizenID)
        if not citizen:
            return None
        if not citizen.evaluation:
            return None
        return citizen.evaluation

    @classmethod
    def get_all_citizens_by_generation(cls, genID):
        citizens = cls.query(Citizen.generationID == genID).fetch()
        if not citizens:
            return None
        return citizens

    @classmethod
    def get_latest_generation_citizens(cls):
        all_citizens = Citizen.get_all_citizens()
        generationID = -1
        for cit in all_citizens:
            if cit.generationID > generationID:
                generationID = cit.generationID
        citizens = Citizen.get_all_citizens_by_generation(generationID)
        return citizens