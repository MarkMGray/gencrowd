from google.appengine.ext import ndb
import models

class Generation(ndb.Model):
    generationID = ndb.IntegerProperty()
    citizens = ndb.StructuredProperty(models.Citizen, repeated=True)

    @classmethod
    def get_all_generations(cls):
        data = cls.query().fetch()
        if not data:
            return None
        return data

    @classmethod
    def get_generation_by_id(cls, genID):
        data = cls.query(Generation.generationID == genID).fetch()
        if not data:
            return None
        generation = data[0]
        return generation

    @classmethod
    def get_all_citizens(cls, genID):
        data = cls.query(Generation.generationID == genID).fetch()
        if not data:
            return None
        generation = data[0]
        if not generation.citizens:
            return None
        return generation.citizens