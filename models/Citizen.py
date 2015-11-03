from google.appengine.ext import ndb
import models

class Perceptron(ndb.Model):
    pool = ndb.IntegerProperty(repeated=True)

class Cell(ndb.Model):
    bias = ndb.FloatProperty()
    classPoolIndex = ndb.IntegerProperty()
    origActivation = ndb.IntegerProperty()
    wrap = ndb.BooleanProperty()
    x = ndb.IntegerProperty()
    y = ndb.IntegerProperty()

class FourPointClassifier(ndb.Model):
    regionClasses = ndb.IntegerProperty(repeated=True)
    north = ndb.FloatProperty()
    south = ndb.FloatProperty()
    east = ndb.FloatProperty()
    west = ndb.FloatProperty()

class Citizen(ndb.Model):
    citizenID = ndb.IntegerProperty()
    generationID = ndb.IntegerProperty()
    evaluation = ndb.StructuredProperty(models.Evaluation)
    numCols = ndb.IntegerProperty()
    numRows = ndb.IntegerProperty()
    fourPointClasses = ndb.StructuredProperty(FourPointClassifier)
    classPool = ndb.StructuredProperty(Perceptron, repeated=True)
    cellData = ndb.StructuredProperty(Cell, repeated=True)

    @classmethod
    def get_all_citizens(cls):
        return cls.query().fetch()

    @classmethod
    def get_citizen(cls, genID, citizenID):
        data = cls.query(ndb.AND(Citizen.generationID == genID, Citizen.citizenID == citizenID)).fetch()
        if not data:
            return None
        citizen = data[0]
        return citizen

    @classmethod
    def get_eval_of_citizen(cls, genID, citizenID):
        data = cls.query(ndb.AND(Citizen.generationID == genID, Citizen.citizenID == citizenID)).fetch()
        if not data:
            return None
        citizen = data[0]
        if not citizen.evaluation:
            return None
        return citizen.evaluation