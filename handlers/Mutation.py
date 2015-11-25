import random
import copy
from models import Citizen
from models import CitizenHelper

P=0.2
Q=0.4
R=0.4
class Mutation:
    @classmethod
    def generateNextGeneration(cls):
        previous_gen_citizens = Citizen.Citizen.get_latest_generation_citizens()
        cit_list = []
        for cit in previous_gen_citizens:
            evalTotal = 0.0
            for eval in cit.evaluation:
                evalTotal += eval.evaluationScore
            evalAvg = evalTotal/float(len(cit.evaluation))
            cit_tuple = (cit, evalAvg)
            cit_list.append(cit_tuple)
        sorted_cit_list = sorted(cit_list, key=lambda tup:tup[1], reverse=True)
        sorted_previous_gen = [x[0] for x in sorted_cit_list]
        old_gen_id = previous_gen_citizens[0].generationID
        next_gen_citizens = []
        # Keeping top P citizens
        for i in range(0, int(len(sorted_previous_gen) * P)):
            new_citizen = Citizen.Citizen.makeCopyOfCitizen(sorted_previous_gen[i])
            next_gen_citizens.append(new_citizen)
        # Generating Q new guys as mutations of P
        max_p = int(len(sorted_previous_gen) * P) - 1
        p_index = 0
        for i in range(0, int(len(sorted_previous_gen) * Q)):
            cit_to_mutate = sorted_previous_gen[p_index]
            new_citizen = Mutation.mutateSingleCitizen(cit_to_mutate)
            next_gen_citizens.append(new_citizen)
            p_index += 1
            if p_index > max_p:
                p_index = 0
        # Generate R new guys from scratch
        for i in range(0, int(len(sorted_previous_gen) * R)):
            new_citizen = Citizen.Citizen.createRandomNewCitizen(Citizen.ROWS, Citizen.COLS, Citizen.NUM_OBJ_CLASSES, Citizen.WGT_POOL_SIZE)
            next_gen_citizens.append(new_citizen)
        # Saving new generation citizens
        new_citizen_id = 1
        new_gen_id = old_gen_id+1
        for citizen in next_gen_citizens:
            citizen.citizenID = new_citizen_id
            citizen.generationID = new_gen_id
            citizen.state = 0
            citizen.evaluation = []
            citizen.put()
            new_citizen_id += 1
        print "Generated new generation"
        return

    @classmethod
    def mutateSingleCitizen(cls, old_citizen):
        mutation_rate = 0.05
        new_citizen = Citizen.Citizen()
        new_citizen.numRows = old_citizen.numRows
        new_citizen.numCols = old_citizen.numCols
        # Four point classifier mutation
        old_4pt_classifier = old_citizen.fourPointClasses
        new_4pt_classifier = copy.deepcopy(old_4pt_classifier)
        if random.random() < mutation_rate:
            tochange = random.randint(0, 4)
            if tochange == 0:
                new_4pt_classifier.north = random.random() * old_4pt_classifier.south
            elif tochange == 1:
                new_4pt_classifier.east = random.random() * old_4pt_classifier.west
            elif tochange == 2:
                new_4pt_classifier.south = random.random() * (1 - old_4pt_classifier.north) + old_4pt_classifier.north
            else:
                new_4pt_classifier.west = random.random() * (1 - old_4pt_classifier.east) + old_4pt_classifier.east
        new_citizen.fourPointClasses = new_4pt_classifier
        # Cell Data mutation
        new_cell_data = copy.deepcopy(old_citizen.cellData)
        for cell in new_cell_data:
            if random.random() < mutation_rate:
                cell.bias = -1 + (random.random() * 2)
            if random.random() < mutation_rate:
                cell.origActivation = int(round(random.random()))
        new_citizen.cellData = new_cell_data
        # Class Pool Mutation
        new_class_pool = copy.deepcopy(old_citizen.classPool)
        if random.random() < mutation_rate:
            toChangeIndex = random.randint(0, len(new_class_pool) - 1)
            new_perceptron = new_class_pool[toChangeIndex]
            toChangeWeight = random.randint(0, len(new_perceptron.pool) - 1)
            new_perceptron.pool[toChangeWeight] = -1 + (random.random() * 2)
            new_class_pool[toChangeIndex] = new_perceptron
        new_citizen.classPool = new_class_pool
        return new_citizen