from pymongo import MongoClient
from collections import Counter
import collections
from bson.objectid import ObjectId

DATABASE_ACCESS="mongodb+srv://firstAdmin:firstAdmin@cluster0.o0ila.mongodb.net/masterDatabase?retryWrites=true&w=majority"

arrangedWorkersOffices = []
ArrangedWorkersOffice = collections.namedtuple('ArrangedWorkersOffice', ['workers', 'offices', 'cost', 'officesAtBeginning'])
NewArrange = collections.namedtuple('NewArrange', ['workers', 'offices'])
PerfectMatch = collections.namedtuple('PerfectMatch', ['i', 'j'])

class Worker(object):
    user = ""
    office = ""

    def __init__(self, user, office):
        self.user = user
        self.office = office

    def __str__(self):
        return str(self.__dict__)

def getOfficiesFromComapny(companyId):
    officeCurr = db.office.find({"company_id" : companyId})
    offices = []
    for office in officeCurr: 
        offices.append(office)
    return offices

def sortOfficesByNumOfSeats(companyId):
    offices = getOfficiesFromComapny(companyId)
    offices.sort(key=lambda x: x.get('num_of_seats'), reverse=True)
    return offices

def printOffices(offices):
    print("Offices")
    for office in offices:
        printOffice(office)

def printOffice(office):
    print("_id:", office["_id"])
    print("office_name:", office["office_name"])
    print("company_id:", office["company_id"])
    print("columns:", office["columns"])
    print("rows:", office["rows"])
    print("num_of_seats:", office["num_of_seats"])
    print("matrix:")
    matrix = office["matrix"]
    for matrixRow in matrix: 
        row = '['
        for i in range(len(matrixRow)):
            row += str(matrixRow[i]) 
            if (i != len(matrixRow) - 1):
                row += "\n"
        row += ']\n'
        print(row)

def copyOfficesToNewArray(offices):
    newOffices = []
    for office in offices:
        newOffices.append({
            "_id": office["_id"],
            "office_name" : office["office_name"],
            "company_id" : office["company_id"],
            "columns" : office["columns"],
            "rows" : office["rows"],
            "matrix" : office["matrix"],
            "num_of_seats" : office["num_of_seats"],
        })
    return newOffices

def copyOfWorkers(workers):
    newWorkers = []
    for workerRow in workers:
        row = []
        for worker in workerRow:
            row.append(Worker(worker.user, worker.office))
        newWorkers.append(row)
    return newWorkers

def getCompanies():
    companyCurr = db.company.find()
    companies = []
    for company in companyCurr: 
        companies.append(company)
    return companies

def getProjects(companyId):
    projectCurr = db.project.find({"company_id" : companyId})
    projects = []
    for project in projectCurr: 
        projects.append(project)
    return projects

def workersOrganizedByProjects(companyId):
    projects = getProjects(companyId)
    workers = []
    for project in projects:
        workersInProject = []
        for user in project["users"]:
            workersInProject.append(Worker(user, ""))
        workers.append(workersInProject)
    workers.sort(key=len, reverse=True)
    return workers

def workersCheckedInOrganizedByProjects(checkedInUsers, companyId):
    print('checkedInUsers',checkedInUsers)
    projects = getProjects(companyId)
    workers = []
    for project in projects:
        workersInProject = []
        for user in project["users"]:
            if user in checkedInUsers:
                workersInProject.append(Worker(user, ""))
        if (len(workersInProject) > 0):
            workers.append(workersInProject)
    workers.sort(key=len, reverse=True)
    return workers

def printWorkers(workers):
    print('Workers:') 
    for workerRow in workers: 
       printWorkerRow(workerRow)

def printWorkerRow(workerRow):
    row = '['
    for i in range(len(workerRow)):
        row += str(workerRow[i]) 
        if (i != len(workerRow) - 1):
            row += "\n"
    row += ']\n'
    print(row)

def costFunction(workers):
    cost = 1
    for workerRow in workers:
        arrayOffices = []
        for worker in workerRow:
            arrayOffices.append(worker.office)
        duplicateOffices  = dict(Counter(arrayOffices))
        for duplicateValue in duplicateOffices:
            cost = cost * duplicateOffices[duplicateValue] / len(arrayOffices)
    return cost

def removeFromArrayByIndex(array, index):
    del array[index]

def removeFromArrayByIndexAndReturn(array, index):
    newArray = []
    for i, e in enumerate(array):
        if (i != index):
            newArray.append(e)
    return newArray

def putWrksFromPrToOfficeSaveChanges(workers, i, offices, j, removeOffice=True):
    numOfFreeSeats = offices[j]["num_of_seats"]
    numOfWorkersToArrange = 0
    for worker in workers[i]:
        if (worker.office == "" and numOfFreeSeats > 0):
            worker.office = offices[j]["_id"]
            numOfFreeSeats -= 1
            numOfWorkersToArrange += 1
    if (removeOffice):
        if (numOfFreeSeats == 0):
            removeFromArrayByIndex(offices, j)
        else:
            offices[j]["num_of_seats"] -= numOfWorkersToArrange
            offices.sort(key=lambda x: x.get('num_of_seats'), reverse=True)
    na = NewArrange(workers, offices)
    return na

def putWrksFromPrToOfficeDontSave(workers, i, offices, j):
    numOfFreeSeats = offices[j]["num_of_seats"]
    numOfWorkersToArrange = 0
    newWorkers = copyOfWorkers(workers)
    for worker in newWorkers[i]:
        if (worker.office == "" and numOfFreeSeats > 0):
            worker.office = offices[j]["_id"]
            numOfFreeSeats -= 1
            numOfWorkersToArrange += 1
    newOffices = copyOfficesToNewArray(offices)
    if (numOfFreeSeats == 0):
        removeFromArrayByIndex(newOffices, j)
    else:
        newOffices[j]["num_of_seats"] -= numOfWorkersToArrange
        newOffices.sort(key=lambda x: x.get('num_of_seats'), reverse=True)
    na = NewArrange(newWorkers, newOffices)
    return na

def possibilitiesToPutWorkers(workers, i, offices):     # allPossibilitesToPutAllWorkersFromProjectInOneOffice
    possibilities = []
    numWrksToArrange = len([worker for worker in workers[i] if worker.office == ""])
    j = 0
    while (j < len(offices) and numWrksToArrange <= offices[j]["num_of_seats"]):
        possibilities.append(offices[j])
        j += 1
    return possibilities

#####################################################################################

def findCombionations(arr, n, r, index, data, i, allCombinations, maxCombs):  
    if (index == r):  
        combination = [] 
        for j in range(r):
            combination.append(data[j])     
        allCombinations.append(combination) 
        return 
    if (i >= n): 
        return 
    data[index] = i 
    if (maxCombs != -1 and len(allCombinations) >= maxCombs):
        return
    findCombionations(arr, n, r, index + 1, data, i + 1, allCombinations, maxCombs) 
    findCombionations(arr, n, r, index, data, i + 1, allCombinations, maxCombs) 
  

def getAllCombinations(arr, r, maxCombs=-1):  
    data = []
    for i in range(r):
        data.append(0) 
    allCombinations = [] 
    n = len(arr)
    findCombionations(arr, n, r, 0, data, 0, allCombinations, maxCombs) 
    return allCombinations

def perfectMatchToPutMoreWorkers(workers, arrWrksIndexes, offices):     # allPossibilitesToPutMoreWorkersProjectsInOneOffice
    numWrksToArrange =  numOfWrksToArrangeFromKProjects(workers, arrWrksIndexes)
    j = 0
    while (j < len(offices) and numWrksToArrange != offices[j]["num_of_seats"]):
        j += 1
    if (j == len(offices)):
        return -1
    else:
        return j

def combsForPerfectMatchWithGivenLength(workers, k, offices):
    allCombs = getAllCombinations(workers, k)
    for comb in allCombs:
        arrayWrks = []
        for i in range(k):
            arrayWrks.append(comb[i])
        officeIndex = perfectMatchToPutMoreWorkers(workers, arrayWrks, offices)
        if (officeIndex != -1):
            return {"workers": comb, "officeIndex": officeIndex}
    return None

def numOfWrksRowToArrange(workersRow):  
    return len([worker for worker in workersRow if worker.office == ""])


def numOfWrksToArrangeFromKProjects(workers, arrWrksIndexes):  
    numWrksToArrange = 0
    j = 0
    for j in range (len(arrWrksIndexes)): 
        numWrksToArrange += len([worker for worker in workers[arrWrksIndexes[j]] if worker.office == ""])
    return numWrksToArrange

def numOfWrksToArrangeInAllProjects(workers):  
    numWrksToArrange = 0
    for workerRow in workers:
        numWrksToArrange += numOfWrksRowToArrange(workerRow)
    return numWrksToArrange


def findPossibleCombsWithDifferentLength(workers, offices):
    k = 0
    allK = []
    firstKarrWrksIndexes = []
    lastKarrWrksIndexes = []
    while (k < len(workers)):
        firstKarrWrksIndexes.append(k)
        lastKarrWrksIndexes.append(len(workers) - 1 - k)
        if (numOfWrksToArrangeFromKProjects(workers, [k]) == 0):
            return allK
        elif (numOfWrksToArrangeFromKProjects(workers, firstKarrWrksIndexes) < offices[len(offices)-1]["num_of_seats"]):
            k += 1
        elif (numOfWrksToArrangeFromKProjects(workers, lastKarrWrksIndexes) > offices[0]["num_of_seats"]):
            return allK
        else:
            allK.append(len(firstKarrWrksIndexes))
            k += 1
    return allK

def findMinPerfectMatch(workers, offices):
    allLen = findPossibleCombsWithDifferentLength(workers, offices)
    foundPerfectMatch = False
    i = 0
    comb = None
    while (i < len(allLen) and not foundPerfectMatch):
        comb = combsForPerfectMatchWithGivenLength(workers, allLen[i], offices)
        if (comb != None):
            foundPerfectMatch = True
        i +=1
    return {'foundPerfectMatch':foundPerfectMatch, 'comb': comb}

def execMinPerfectMatch(workers, offices, comb):
    for c in comb["workers"]:
            putWrksFromPrToOfficeSaveChanges(workers, c, offices, comb["officeIndex"], removeOffice=False)
    workers.sort(key=lambda x: numOfWrksRowToArrange(x), reverse=True)
    removeFromArrayByIndex(offices, comb["officeIndex"])
    offices.sort(key=lambda x: x.get('num_of_seats'), reverse=True)
    printWorkers(workers)
    printOffices(offices)
 

def combinations(workers, offices, officesAtBeginning):
    for i in range(len(workers)):
        if (numOfWrksRowToArrange(workers[i]) != 0):
            break 
    possibilities = possibilitiesToPutWorkers(workers, i, offices)
    numOfWorkersToArrange = numOfWrksRowToArrange(workers[i])
    numOfFreeSeats = 0 if len(possibilities) == 0 else possibilities[0]["num_of_seats"]
    otherWorkerElemAreArranged = True
    k = 0
    while (k < len(workers) and otherWorkerElemAreArranged):
        if (k != i and numOfWrksRowToArrange(workers[k]) != 0):
            otherWorkerElemAreArranged = False
        k += 1
    last = numOfFreeSeats >= numOfWorkersToArrange and otherWorkerElemAreArranged
    # postoji samo jedan workerRow ciji worekri nisu u potpunosti rasporedjeni u officima i oni staju u jedan office
    if (last):
        newArrange = putWrksFromPrToOfficeSaveChanges(workers, i, offices, 0)
        insertToArrangedWorkersOffices(newArrange, officesAtBeginning)
    else:
        if (len(possibilities) == 0):
            newArrange = putWrksFromPrToOfficeDontSave(workers, i, offices, 0)
            combinations(newArrange.workers, newArrange.offices, officesAtBeginning)
        else:
            for j in range(len(possibilities)):
                newArrange = putWrksFromPrToOfficeDontSave(workers, i, offices, j)
                combinations(newArrange.workers, newArrange.offices, officesAtBeginning)

def algorithmDistribution(workers, i, offices, officesAtBeginning):
    perfectMatch =  findMinPerfectMatch(workers, offices)
    foundPerfectMatch = perfectMatch["foundPerfectMatch"]
    if (not foundPerfectMatch): 
        newWorkers = []
        for workersRow in workers:
            if (numOfWrksRowToArrange(workersRow) == 0):
                newWorkers.append(workersRow)
        for workersRow in workers:
            if (numOfWrksRowToArrange(workersRow) != 0):
                newWorkers.append(workersRow)
        combinations(workers, offices, officesAtBeginning)
        workers.sort(key=lambda x: numOfWrksRowToArrange(x))    
        combinations(workers, offices, officesAtBeginning)
    else:
        execMinPerfectMatch(workers, offices, perfectMatch["comb"])
        if (numOfWrksToArrangeInAllProjects(workers) > 0):
            algorithmDistribution(workers, i, offices, officesAtBeginning)
        else:
            insertToArrangedWorkersOffices(NewArrange(workers, offices), officesAtBeginning)

def cleanArrangedWorkersOffices():
    global arrangedWorkersOffices
    arrangedWorkersOffices = []

def sortArrangedWorkersOffices():
    global arrangedWorkersOffices
    arrangedWorkersOffices.sort(key=lambda x: x.cost, reverse=True)

def insertToArrangedWorkersOffices(newArrange, officesAtBeginning):
    global arrangedWorkersOffices
    newArrange.workers.sort(key=len, reverse=True)
    printWorkers(newArrange.workers)
    arrangedWorkersOffices.append(
        ArrangedWorkersOffice(
            newArrange.workers, 
            newArrange.offices,
            costFunction(newArrange.workers),
            officesAtBeginning
        )
    )

def algorithmDistributionWithCheckedInUsers(checkedInUsers, companyId, allWorkers=False):
    global arrangedWorkersOffices
    offices = sortOfficesByNumOfSeats(companyId)
    if (allWorkers):
        workers = workersOrganizedByProjects(companyId)
    else:
        workers = workersCheckedInOrganizedByProjects(checkedInUsers, companyId)
    if (len(workers) == 0 or len(offices) == 0):
        return None
    officesAtBeginning = copyOfficesToNewArray(offices)
    arrangedWorkersOffices = []
    algorithmDistribution(workers, 0, offices, officesAtBeginning)
    sortArrangedWorkersOffices()
    for e in arrangedWorkersOffices:
        printWorkers(e.workers)
        print('cost', costFunction(e.workers))
    arrangement = arrangedWorkersOffices[0]
    finalOffices = []
    for workerRow in arrangement.workers:
        for worker in workerRow:
            indexOfOffice = next((i for i, e in enumerate(finalOffices) if (e["office_id"] == worker.office)), -1)
            if (indexOfOffice == -1):
                newOffice = {"office_id": worker.office, "users": [worker.user]}
                finalOffices.append(newOffice)
            else:
                finalOffices[indexOfOffice]["users"].append(worker.user)
    for office in finalOffices:
        print(office["office_id"])
        for w in office["users"]:
            print(w)
        print("****")
    print('-------------------')
    return finalOffices



try:
    client = MongoClient(DATABASE_ACCESS)
    db = client["masterDatabase"]
except Exception:
    print("Unable to connect to the server.")




