from google.appengine.ext import ndb

class Perceptron(ndb.Model):
    pool = ndb.IntegerProperty(repeated=True)
    pool = ndb.IntegerProperty()

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