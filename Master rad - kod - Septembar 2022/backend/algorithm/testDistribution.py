import distribution
from collections import Counter

assertArray = []
TestElem = distribution.collections.namedtuple('TestElem', ['i', 'start_w_index', 'end_w_index', 'j'])

def assert_(condition):
  if (not condition):
    assertArray.append("ERROR")
    print("ERROR")
  else:
    assertArray.append("ok")
    print("ok")

def executeAlgorithm(workers, offices):
    print("*")
    distribution.cleanArrangedWorkersOffices()
    print('!---',len(distribution.arrangedWorkersOffices))
    distribution.printWorkers(workers)
    distribution.printOffices(offices)
    officesAtBeginning = distribution.copyOfficesToNewArray(offices)
    distribution.algorithmDistribution(workers, 0, offices, officesAtBeginning)
    distribution.sortArrangedWorkersOffices()
    for e in distribution.arrangedWorkersOffices:
        distribution.printWorkers(e.workers)
        distribution.printOffices(e.offices)
        print('cost', e.cost)
    

def fillWorkers(arrayNumOfWorkers): 
    workers = []
    for i in range(len(arrayNumOfWorkers)):
        row = []
        for j in range(arrayNumOfWorkers[i]):
            row.append(distribution.Worker("user" + str(i) + str(j), ""))
        workers.append(row)
    return workers

def fillOffices(arrayNumOfOffices): 
    offices = []
    for i in range(len(arrayNumOfOffices)):
        offices.append({
            "_id": "__id" + str(i),
            "office_name" : "o" + str(i),
            "company_id" : "c",
            "columns" : 0,
            "rows" : 0,
            "matrix" : [[]],
            "num_of_seats" : arrayNumOfOffices[i],
        })
    return offices

def checkIfWorkersAreArranfedInOffice(i, start_w_index, end_w_index, offices, j):
    workersInOffices = True
    arangedWorkers = distribution.arrangedWorkersOffices[0].workers
    k = start_w_index
    while (k <= end_w_index and workersInOffices):
        if (arangedWorkers[i][k].office != offices[j]["_id"]):
            print(i, k, arangedWorkers[i][k].office, offices[j]["_id"])
            workersInOffices = False
        k += 1
    return workersInOffices

def test(wNumArray, oNumArray, results, cost):
    workers = fillWorkers(wNumArray)
    offices = fillOffices(oNumArray)
    # distribution.printOffices(offices)
    # distribution.printWorkers(workers)


    arranged = executeAlgorithm(workers, offices)

    print('Final')
    print('combs:', len(distribution.arrangedWorkersOffices))
    distribution.printWorkers(distribution.arrangedWorkersOffices[0].workers)
    print('COST:', distribution.arrangedWorkersOffices[0].cost)

    offices = fillOffices(oNumArray)
    wellArranged = True
    i = 0
    while (i < len(results) and wellArranged):
        r = results[i]
        wellArranged = checkIfWorkersAreArranfedInOffice(r.i, r.start_w_index, r.end_w_index, offices, r.j)
        i += 1
    assert_(len(distribution.arrangedWorkersOffices) > 0 and wellArranged and distribution.arrangedWorkersOffices[0].cost == cost)
    return arranged

def test_w_5_3_o_8():
    return test(
        [5, 3],
        [8], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_5_4_3_o_12():
    return test(
       [5, 4, 3],
        [12],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=0, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=0, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_o_8():
    return test([8], [8], [TestElem(i=0, start_w_index=0, end_w_index=7, j=0)], 1)

def test_w_1_o_9():
    return test([1], [9], [TestElem(i=0, start_w_index=0, end_w_index=0, j=0)], 1)

def test_w_1_1_o_9():
    return test(
        [1, 1], 
        [9], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=0, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=0, j=0),
        ], 
        1
    )

def test_w_8_o_9():
    return test([8], [9], [TestElem(i=0, start_w_index=0, end_w_index=7, j=0)], 1)

def test_w_8_o_10_8():
    return test([8], [10, 8], [TestElem(i=0, start_w_index=0, end_w_index=7, j=1)], 1)

def test_w_8_o_10():
    return test([8], [10], [TestElem(i=0, start_w_index=0, end_w_index=7, j=0)], 1)

def test_w_8_7_o_10_7():
    return test(
        [8, 7], 
        [10, 7], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0), 
            TestElem(i=1, start_w_index=0, end_w_index=6, j=1)
        ],
        1
    )

def test_w_8_o_8x1():
    return test(
        [8], 
        [1, 1, 1, 1, 1, 1, 1, 1], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=0, j=0),
            TestElem(i=0, start_w_index=1, end_w_index=1, j=1),
            TestElem(i=0, start_w_index=2, end_w_index=2, j=2),
            TestElem(i=0, start_w_index=3, end_w_index=3, j=3),
            TestElem(i=0, start_w_index=4, end_w_index=4, j=4),
            TestElem(i=0, start_w_index=5, end_w_index=5, j=5),
            TestElem(i=0, start_w_index=6, end_w_index=6, j=6),
            TestElem(i=0, start_w_index=7, end_w_index=7, j=7),
        ], 
        pow(1 / 8, 8)
    )

def test_w_8_o_4_4():
    return test(
        [8], 
        [4, 4], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=0, start_w_index=4, end_w_index=7, j=1),
        ], 
        0.25
    )

def test_w_8_o_3_3_2():
    return test(
        [8], 
        [3, 3, 2], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=0, start_w_index=3, end_w_index=5, j=1),
            TestElem(i=0, start_w_index=6, end_w_index=7, j=2),
        ], 
        0.03515625
    )

def test_w_8_5_4_o_8_5_4():
    return test(
        [8, 5, 4], 
        [8, 5, 4], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=2),
        ], 
        1
    )

def test_w_8_5_o_8_5():
    return test(
        [8, 5], 
        [8, 5], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
        ], 
        1
    )

def test_w_8_5_o_8_6():
    return test(
        [8, 5], 
        [8, 6], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
        ], 
        1
    )

def test_w_8_5_o_9_5():
    return test(
        [8, 5], 
        [9, 5], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
        ], 
        1
    )

def test_w_8_5_o_10_6():
    return test(
        [8, 5], 
        [10, 6], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
        ], 
        1
    )

def test_w_8_5_o_5_3_3_2():
    return test(
        [8, 5], 
        [5, 3, 3, 2], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=0, start_w_index=3, end_w_index=5, j=2),
            TestElem(i=0, start_w_index=6, end_w_index=7, j=3),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
        ], 
        pow(3 / 8, 2) * 2 / 8
    )

def test_w_8_4_3_o_11_4():
    return test(
        [8, 4, 3], 
        [11, 4], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_8_7_5():
    return test(
        [8, 5, 4, 3], 
        [8, 7, 5], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=2),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=1),
        ], 
        1
    )

def test_w_8_5_4_3_o_8_5_4_3():
    return test(
        [8, 5, 4, 3], 
        [8, 5, 4, 3], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=2),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=3),
        ], 
        1
    )

def test_w_8_5_4_3_o_9_5_4_3():
    return test(
        [8, 5, 4, 3], 
        [8, 5, 4, 3], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=2),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=3),
        ], 
        1
    )

def test_w_8_5_4_3_o_ge20(wNumArray, oNumArray):
    return test(
        wNumArray, 
        oNumArray,
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_20_5(wNumArray, oNumArray):
    return test(
        wNumArray, 
        oNumArray,
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_10_10_o_20():
    return test(
        [10, 10], 
        [20], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=9, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=9, j=0),
        ], 
        1
    )

def test_w_2_2_o_20():
    return test(
        [2, 2], 
        [20], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=1, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=1, j=0),
        ], 
        1
    )

def test_w_20_15_10_10_5_o_80():
    return test(
        [20, 15, 10, 10, 5], 
        [80], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=19, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=14, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=9, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=9, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=4, j=0),
        ], 
        1
    )

def test_w_20_20_15_15_15_o_60_50():
    return test(
        [20, 20, 15, 15, 15], 
        [60, 50], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=19, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=19, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=14, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=14, j=1),
            TestElem(i=4, start_w_index=0, end_w_index=14, j=1),
        ], 
        1
    )

def test_w_8_7_5_4_3_o_35():
    return test(
        [8, 7, 5, 4, 3], 
        [35], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_2x8_2x7_o_16_14():
    return test(
        [8, 8, 7, 7],
        [16, 14],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=6, j=1),
        ], 
        1
    )

def test_w_8_7_6_5_4_3_o_18_15():
    return test(
        [8, 7, 6, 5, 4, 3],
        [18, 15],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=5, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_2x8_2x7_2x6_2x5_2x4_2x3_o_33_33():
    return test(
        [8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3],
        [33, 33],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=5, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=6, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=7, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=8, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=9, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=10, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=11, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_2x8_2x7_2x6_2x5_2x4_2x3_2_o_35_33():
    return test(
        [8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2],
        [35, 33],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=5, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=6, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=7, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=8, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=9, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=10, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=11, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=12, start_w_index=0, end_w_index=1, j=1),
        ], 
        1
    )

def test_w_3x8_3x7_2x6_3x5_3x4_3x3_2_o_35_33_27():
    return test(
        [8, 8, 8, 7, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2],
        [35, 33, 27],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=2, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=3, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=4, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=5, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=6, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=7, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=8, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=9, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=10, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=11, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=12, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=13, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=14, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=15, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=16, start_w_index=0, end_w_index=2, j=2),
            TestElem(i=17, start_w_index=0, end_w_index=1, j=0),
        ], 
        1
    )

def test_w_3x7_2x6_3x5_3x4_3x3_2_o_35_33():
    return test(
        [7, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 2],
        [35, 33],
        [
            TestElem(i=0, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=6, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=4, start_w_index=0, end_w_index=5, j=1),
            TestElem(i=5, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=6, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=7, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=8, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=9, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=10, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=11, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=12, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=13, start_w_index=0, end_w_index=1, j=0),
        ], 
        1
    )

def test_w_3x5_3x4_3x3_2_o_35():
    return test(
        [5, 5, 5, 4, 4, 4, 3, 3, 2],
        [35],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=5, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=6, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=7, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=8, start_w_index=0, end_w_index=1, j=0),
        ], 
        1
    )

def test_w_3x8_3x7_2x6_3x5_3x4_3x3_2_o_36_34_28():
    return test(
        [8, 8, 8, 7, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2],
        [36, 34, 28],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=2, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=3, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=5, start_w_index=0, end_w_index=6, j=0),
            TestElem(i=6, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=7, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=8, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=9, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=10, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=11, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=12, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=13, start_w_index=0, end_w_index=3, j=2),
            TestElem(i=14, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=15, start_w_index=0, end_w_index=2, j=1),
            TestElem(i=16, start_w_index=0, end_w_index=2, j=0),
            TestElem(i=17, start_w_index=0, end_w_index=1, j=1),
        ], 
        1
    )

def test_w_8_5_4_3_o_15_6(wNumArray, oNumArray):
    return test(
        wNumArray, 
        oNumArray,
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_5_4_3_o_20():
    return test(
        [5, 4, 3], 
        [20], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_16_4():
    return test(
        [8, 5, 4, 3], 
        [16, 4], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_12_8():
    return test(
        [8, 5, 4, 3], 
        [12, 8], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_11_9():
    return test(
        [8, 5, 4, 3], 
        [11, 9], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_8_5_4_3_o_13_9():
    return test(
        [8, 5, 4, 3], 
        [13, 9], 
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=1),
        ], 
        1
    )

def test_w_8_5_4_3_o_5_3_6x2():
    return test(
        [8, 5, 4, 3], 
        [5, 3, 2, 2, 2, 2, 2, 2],
        [
            TestElem(i=0, start_w_index=0, end_w_index=1, j=2),
            TestElem(i=0, start_w_index=2, end_w_index=3, j=3),
            TestElem(i=0, start_w_index=4, end_w_index=5, j=4),
            TestElem(i=0, start_w_index=6, end_w_index=7, j=5),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=1, j=6),
            TestElem(i=2, start_w_index=2, end_w_index=3, j=7),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=1),
        ], 
        pow(1 / 4, 4) * pow(1 / 2, 2)
    )

def test_w_8_5_4_3_o_5_3x3_3x2():
    return test(
        [8, 5, 4, 3], 
        [5, 3, 3, 3, 2, 2, 2],
        [
            TestElem(i=0, start_w_index=0, end_w_index=2, j=2),
            TestElem(i=0, start_w_index=3, end_w_index=5, j=3),
            TestElem(i=0, start_w_index=6, end_w_index=7, j=4),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=1, j=5),
            TestElem(i=2, start_w_index=2, end_w_index=3, j=6),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=1),
        ], 
        2 / 8 * pow(3 / 8, 2) * pow(1 / 2, 2)
    )

def test_w_8_5_3_o_ge8_ge5_ge3(wNumArray, oNumArray):
    return test(
        wNumArray, 
        oNumArray,
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=2),
        ], 
        1
    )

def test_w_5_3_o_10():
    return test(
        [5, 3], 
        [10],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_arr_5_4_3_o_7_5():
    return test(
        [5, 4, 3], 
        [7, 5],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_5_4_3_o_12():
    return test(
        [5, 4, 3], 
        [12],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_5_4_o_9():
    return test(
        [5, 4], 
        [9],
        [
            TestElem(i=0, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
        ], 
        1
    ) 

def test_w_8_5_4_3_o_12_8():
    return test(
        [8, 5, 4, 3], 
        [12, 8],
        [
            TestElem(i=0, start_w_index=0, end_w_index=7, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_8_5_4_3_o_2x4_3x3_2_1():
    return test(
        [8, 5, 4, 3], 
        [4, 4, 3, 3, 3, 2, 1],
        [
            TestElem(i=0, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=0, start_w_index=4, end_w_index=6, j=3),
            TestElem(i=0, start_w_index=7, end_w_index=7, j=6),
            TestElem(i=1, start_w_index=0, end_w_index=2, j=4),
            TestElem(i=1, start_w_index=3, end_w_index=4, j=5),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=2),
        ], 
        0.005625000000000001
    ) 

def test_w_8_4_3_o_11_4():
    return test(
        [8, 4, 3], 
        [11, 4],
        [            
            TestElem(i=0, start_w_index=7, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_8_4_3_o_11_5():
    return test(
        [8, 4, 3], 
        [11, 5],
        [            
            TestElem(i=0, start_w_index=7, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_10_8_6_4_o_11_9_7_5():
    return test(
        [10, 8, 6, 4], 
        [11, 9, 7, 5],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=9, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=5, j=2),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=3),
        ], 
        1
    ) 

def test_w_10_8_6_4_2_o_12_10_8_6_4():
    return test(
        [10, 8, 6, 4, 2], 
        [12, 10, 8, 6, 4],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=9, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=2),
            TestElem(i=2, start_w_index=0, end_w_index=5, j=3),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=4),
            TestElem(i=4, start_w_index=0, end_w_index=1, j=0),
        ], 
        1
    ) 

def test_w_10_8_5_o_14_11():
    return test(
        [10, 8, 5], 
        [14, 11],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=9, j=1),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
        ], 
        1
    ) 

def test_w_8_5_3_o_19():
    return test(
        [8, 5, 3], 
        [19],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_8_5_3_o_9_6_3():
    return test(
        [8, 5, 3], 
        [9, 6, 3],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=2),
        ], 
        1
    ) 

def test_w_8_5_4_3_o_9_6_5_4():
    return test(
        [8, 5, 4, 3], 
        [9, 6, 5, 4],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=2),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=3),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=1),
        ], 
        1
    ) 

def test_w_8_5_4_3_o_9_6_6_4():
    return test(
        [8, 5, 4, 3], 
        [9, 6, 6, 4],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=4, j=1),
            TestElem(i=2, start_w_index=0, end_w_index=3, j=3),
            TestElem(i=3, start_w_index=0, end_w_index=2, j=2),
        ], 
        1
    ) 

def test_w_20_8_o_40_30():
     return test(
        [20, 8], 
        [40, 30],
        [            
            TestElem(i=0, start_w_index=0, end_w_index=19, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=7, j=1),
        ], 
        1
    ) 

def test_w_8_o_ge8(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
        ], 
        1
    )

def test_w_7_o_ge7(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=6, j=0),
        ], 
        1
    )


def test_w_8_6_o_ge14(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=5, j=0),
        ], 
        1
    )

def test_w_8_6_5_o_ge19(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
        ], 
        1
    )

def test_w_8_6_5_4_o_ge23(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=0),
        ], 
        1
    )

def test_w_8_6_5_4_3_o_ge26(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=5, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=4, j=0),
            TestElem(i=3, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=4, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    )

def test_w_4_o_ge4(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=3, j=0),
        ], 
        1
    ) 

def test_w_3_o_ge3(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def test_w_8_4_o_ge12(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
        ], 
        1
    ) 

def test_w_8_4_3_o_ge15(wNumArray, oNumArray):
    return test(
       wNumArray, 
       oNumArray,
        [            
            TestElem(i=0, start_w_index=0, end_w_index=7, j=0),
            TestElem(i=1, start_w_index=0, end_w_index=3, j=0),
            TestElem(i=2, start_w_index=0, end_w_index=2, j=0),
        ], 
        1
    ) 

def testAlgorithm():
    test_w_5_3_o_8()
    test_w_5_4_3_o_12()
    test_w_8_o_8()
    test_w_8_o_10()
    test_w_8_o_10_8()
    test_w_8_7_o_10_7()
    test_w_8_o_8x1()
    test_w_8_o_4_4()
    test_w_8_o_3_3_2()
    test_w_8_5_4_o_8_5_4()
    test_w_8_5_o_8_5()
    test_w_8_5_o_9_5()
    test_w_8_5_o_10_6()
    test_w_8_5_o_5_3_3_2()
    test_w_8_4_3_o_11_4()
    test_w_8_4_3_o_11_5()
    test_w_8_5_4_3_o_8_7_5()
    test_w_8_5_4_3_o_8_5_4_3()
    test_w_8_5_4_3_o_16_4()
    test_w_8_5_4_3_o_12_8()
    test_w_8_5_4_3_o_11_9()
    test_w_8_5_4_3_o_5_3_6x2()
    test_w_8_5_4_3_o_5_3x3_3x2()
    test_w_8_5_3_o_9_6_3()
    test_w_8_5_4_3_o_9_6_5_4()
    test_w_8_5_4_3_o_9_6_6_4()
    test_w_10_8_6_4_2_o_12_10_8_6_4()
    test_w_10_8_5_o_14_11() # posluzio combs
    test_w_8_7_5_4_3_o_35()
    test_w_2x8_2x7_2x6_2x5_2x4_2x3_2_o_35_33()
    test_w_2x8_2x7_2x6_2x5_2x4_2x3_o_33_33()
    test_w_8_7_6_5_4_3_o_18_15()
    test_w_2x8_2x7_o_16_14()
    test_w_3x8_3x7_2x6_3x5_3x4_3x3_2_o_35_33_27()
    test_w_3x8_3x7_2x6_3x5_3x4_3x3_2_o_36_34_28()

    print("--------", len(assertArray))
    i = 0
    for assertElem in assertArray:
        if (assertElem == "ok"):
            i += 1
    print("ok x", i)
    if (i != len(assertArray)):
        print("ERROR x", len(assertArray) - i)

testAlgorithm()