from sqlite3 import Date
import distribution 
from pymongo import MongoClient
from datetime import timedelta, datetime

def goTroughSurveysAndExecuteAlgorithm():
    try:
        conn = MongoClient(distribution.DATABASE_ACCESS)
        print("Connected successfully!!!")
    except: 
        print("Could not connect to MongoDB")
    db = conn.masterDatabase
    surveyCollection = db.survey
    tomorrow = datetime.now() + timedelta(days=1)
    print(tomorrow.month,')))')
    d = 22
    surveyCursor = surveyCollection.find({'date.year': tomorrow.year, 'date.month': tomorrow.month, 'date.day': tomorrow.day})
    # surveyCursor = surveyCollection.find({'date.year': 2022, 'date.month': 7, 'date.day': d})
    for survey in surveyCursor:
        companyId = survey["company_id"]
        users = survey["users"]
        finalOffices = distribution.algorithmDistributionWithCheckedInUsers(users, companyId)
        print(finalOffices)
        reservation1 = {
                "company_id": companyId,
                "offices": finalOffices,
                # "date": {'year': 2022, 'month': 7, 'day': d}
                "date": {'year': tomorrow.year, 'month': tomorrow.month, 'day': tomorrow.day}
            }
        db.reservation.insert_one(reservation1)
    conn.close()    


goTroughSurveysAndExecuteAlgorithm()
