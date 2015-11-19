from google.appengine.ext import ndb

class Perceptron(ndb.Model):
    pool = ndb.FloatProperty(repeated=True)

class Cell(ndb.Model):
    bias = ndb.FloatProperty()
    classPoolIndex = ndb.IntegerProperty()
    origActivation = ndb.IntegerProperty()
    wrap = ndb.BooleanProperty()
    x = ndb.IntegerProperty()
    y = ndb.IntegerProperty()
    z = ndb.IntegerProperty()

    def toDict(self):
        dictionary = {}
        dictionary["bias"] = self.bias
        dictionary["x"] = self.x
        dictionary["y"] = self.y
        dictionary["z"] = self.z
        dictionary["wrap"] = self.wrap
        dictionary["origActivation"] = self.origActivation
        dictionary["classPoolIndex"] = self.classPoolIndex
        return dictionary

class FourPointClassifier(ndb.Model):
    regionClasses = ndb.IntegerProperty(repeated=True)
    north = ndb.FloatProperty()
    south = ndb.FloatProperty()
    east = ndb.FloatProperty()
    west = ndb.FloatProperty()

    def toDict(self):
        dictionary = {}
        dictionary["classes"] = self.regionClasses
        dictionary["n"] = self.north
        dictionary["s"] = self.south
        dictionary["e"] = self.east
        dictionary["w"] = self.west
        return dictionary