import random
import copy
from models import Citizen
from models import CitizenHelper

COLS = 25
ROWS = 10
WRAP = True
WGT_POOL_SIZE = 5
NUM_OBJ_CLASSES = 3

class Mutation:
    @classmethod
    def generateNextGeneration(cls):
        # Create 10 new random citizens
        # Sort citizens on evaluation (survey score)
        # p and q and r - should sum up to one (20, 40, 40)
        # Keep top p.. Kill eveything else
        # Generate q new guys as mutations of the top p
        # Generate r new guys from scratch
        # This is your new generation.
        previous_gen_citizens = Citizen.Citizen.get_latest_generation_citizens()
        old_gen_id = previous_gen_citizens[0].generationID
        next_gen_citizens = []
        # Mutation here
        for citizen in previous_gen_citizens:
            new_citizen = Mutation.mutateSingleCitizen(citizen)
            next_gen_citizens.append(new_citizen)
        # Saving new generation citizens
        new_citizen_id = 1
        new_gen_id = old_gen_id+1
        for citizen in next_gen_citizens:
            citizen.citizenID = new_citizen_id
            citizen.generationID = new_gen_id
            citizen.state = 0
            citizen.put()
            new_citizen_id += 1
        print "Generated new citizens"
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

    @classmethod
    def createRandomNewCitizen(cls, numRows, numCols, numObjs, numPerceptrons):
        new_citizen = Citizen.Citizen()
        new_citizen.numRows = numRows
        new_citizen.numCols = numCols
        # Four point classifier
        new_citizen.fourPointClasses = CitizenHelper.FourPointClassifier()
        new_citizen.fourPointClasses.north = random.random()
        new_citizen.fourPointClasses.south = random.random()
        new_citizen.fourPointClasses.east = random.random()
        new_citizen.fourPointClasses.west = random.random()
        if new_citizen.fourPointClasses.south < new_citizen.fourPointClasses.north:
            temp = new_citizen.fourPointClasses.south
            new_citizen.fourPointClasses.south = new_citizen.fourPointClasses.north
            new_citizen.fourPointClasses.north = temp
        if new_citizen.fourPointClasses.east < new_citizen.fourPointClasses.west:
            temp = new_citizen.fourPointClasses.east
            new_citizen.fourPointClasses.east = new_citizen.fourPointClasses.west
            new_citizen.fourPointClasses.west = temp
        new_citizen.fourPointClasses.regionClasses = []
        for i in range(0, 9*numObjs):
            new_citizen.fourPointClasses.regionClasses.append(random.randint(0, numPerceptrons-1))
        # Cell Data
        cells = []
        for z in range(0, numObjs):
            for r in range(0, numRows):
                for c in range(0, numCols):
                    newCell = CitizenHelper.Cell()
                    newCell.x = c
                    newCell.y = r
                    newCell.z = z
                    newCell.wrap = WRAP
                    newCell.origActivation = int(round(random.random()))
                    newCell.bias = -1 + (2 * random.random())
                    newCell.classPoolIndex = 0
                    cells.append(newCell)
        new_citizen.cellData = cells
        # Class Pool
        new_citizen.classPool = Mutation.randomWeightPool(numPerceptrons, 4+numObjs)
        return new_citizen

    @classmethod
    def randomWeightPool(cls, size, numInputs):
        pool = []
        for i in range(0, size):
            perceptron = CitizenHelper.Perceptron()
            perceptron.pool = []
            for j in range(0, numInputs):
                perceptron.pool.append(-1 + (2 * random.random()))
            pool.append(perceptron)
        return pool