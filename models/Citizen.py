from google.appengine.ext import ndb
import Evaluation
import random
import copy
from CitizenHelper import FourPointClassifier
from CitizenHelper import Cell
from CitizenHelper import Perceptron


COLS = 25
ROWS = 10
WRAP = True
WGT_POOL_SIZE = 5
NUM_OBJ_CLASSES = 3

class Citizen(ndb.Model):
    state = ndb.IntegerProperty()
    citizenID = ndb.IntegerProperty()
    generationID = ndb.IntegerProperty()
    evaluation = ndb.LocalStructuredProperty(Evaluation.Evaluation, repeated=True)
    numCols = ndb.IntegerProperty()
    numRows = ndb.IntegerProperty()
    fourPointClasses = ndb.LocalStructuredProperty(FourPointClassifier)
    cellData = ndb.LocalStructuredProperty(Cell, repeated=True)
    classPool = ndb.LocalStructuredProperty(Perceptron, repeated=True)

    def classPoolList(self):
        classPool = []
        for perceptron in self.classPool:
            cellDef = perceptron.pool
            classPool.append(cellDef)
        return classPool

    def cellDataList(self):
        cells = []
        for cell in self.cellData:
            cells.append(cell.toDict())
        return cells

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
        citizens = cls.query(Citizen.generationID == genID).order(Citizen.citizenID).fetch()
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

    @classmethod
    def createRandomNewCitizen(cls, numRows, numCols, numObjs, numPerceptrons):
        new_citizen = Citizen()
        new_citizen.numRows = numRows
        new_citizen.numCols = numCols
        # Four point classifier
        new_citizen.fourPointClasses = FourPointClassifier()
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
                    newCell = Cell()
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
        new_citizen.classPool = Citizen.randomWeightPool(numPerceptrons, 4+numObjs)
        return new_citizen

    @classmethod
    def randomWeightPool(cls, size, numInputs):
        pool = []
        for i in range(0, size):
            perceptron = Perceptron()
            perceptron.pool = []
            for j in range(0, numInputs):
                perceptron.pool.append(-1 + (2 * random.random()))
            pool.append(perceptron)
        return pool

    @classmethod
    def makeCopyOfCitizen(cls, citizen):
        citizen_copy = Citizen()
        citizen_copy.numRows = citizen.numRows
        citizen_copy.numCols = citizen.numCols
        citizen_copy.fourPointClasses = copy.deepcopy(citizen.fourPointClasses)
        citizen_copy.cellData = copy.deepcopy(citizen.cellData)
        citizen_copy.classPool = copy.deepcopy(citizen.classPool)
        return citizen_copy