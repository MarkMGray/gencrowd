from models import Citizen
from models import CitizenHelper

class Mutation:
    @classmethod
    def generateNextGeneration(cls):
        previous_gen_citizens = Citizen.Citizen.get_latest_generation_citizens()
        old_gen_id = previous_gen_citizens[0].generationID
        next_gen_citizens = []
        # Mutation here

        # Saving new generation citizens
        new_citizen_id = 1
        new_gen_id = old_gen_id+1
        for citizen in next_gen_citizens:
            citizen.citizenID = new_citizen_id
            citizen.generationID = new_gen_id
            citizen.put()
            new_citizen_id += 1
        print "Generated new citizens"
        return