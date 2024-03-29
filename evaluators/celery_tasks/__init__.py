from celery import Celery
import os
import json
from db_utils import *
from time import sleep
print("starting celery worker")
import importlib
import traceback


BROKER_URL = os.environ.get("BROKER_URL", "amqp://localhost")
DATABASE = os.environ.get("DATABASE", 'mongodb://localhost:27017/')

app = Celery(
    "tasks",
    broker=BROKER_URL,
)

@app.task(name="tasks.run_evaluation")
def run_evaluation(submission_id):
    db = connect_to_db(DATABASE)
    submission = get_submission(db, submission_id)
    teamId = submission["team"]
    competeId = submission["compete"]
    url = submission["googleDrivePath"]
    localpath = submission["localFilePath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    if localpath[-4:] == ".zip":
        localpath = extract_zip(localpath)
    compete = get_competition(db, competeId)
    evaluation = get_evaluation(db, compete["evaluation"])
    privateDatalocalpath = compete["privateDataSetPath"]
    publicDatalocalpath = compete["publicDataSetPath"]
    try:
        publicScore, privateScore = evaluate_submissions(evaluation["name"],localpath, privateDatalocalpath, publicDatalocalpath)
        error = ""
    except Exception as e:
        error = str(e)
        publicScore = 0
        privateScore = 0
    saveScores(db, submission_id,competeId,teamId,publicScore, privateScore, error)
    deleteLocalFile(localpath)

@app.task(name="tasks.run_sandBox_evaluation")
def run_sandBox_evaluation(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["sandBoxSubmissionUrl"]
    localpath = compete["sandBoxSubmissionPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    if localpath[-4:] == ".zip":
        localpath = extract_zip(localpath)
    evaluation = get_evaluation(db, compete["evaluation"])
    privateDatalocalpath = compete["privateDataSetPath"]
    publicDatalocalpath = compete["publicDataSetPath"]
    try:
        publicScore, privateScore = evaluate_submissions(evaluation["name"],localpath, privateDatalocalpath, publicDatalocalpath)
        error = ""
    except Exception as e:
        error = str(traceback.format_exc())
        publicScore = 0
        privateScore = 0
    data = {"sandBoxPublicScore": publicScore, "sandBoxPrivateScore":privateScore, "sandBoxSubmissionStatus":False, "sandBoxSubmissionLog":error}
    updateCompetition(db, competeid, data)
    deleteLocalFile(localpath)
    return data

def evaluate_submissions(evaluationFuncName,submissionPath, privateDataPath, publicDataPath):
    MODULE_NAME = "celery_tasks.EvaluationFiles."+str(evaluationFuncName)
    func = importlib.import_module(MODULE_NAME,".")
    publicScore, privateScore = func.evaluate(submissionPath,privateDataPath,publicDataPath)
    return publicScore, privateScore

@app.task(name="tasks.generateFile")
def generateFile(evaluationId):
    db = connect_to_db(DATABASE)
    evaluation = get_evaluation(db, evaluationId)
    localpath = evaluation["localFilePath"]
    basedir = os.path.join(*localpath.split("/")[:-1]) + "/"
    try:
        if not os.path.exists(basedir):
            os.mkdir(basedir)
    except Exception:
        os.mkdir(basedir)
    localpath = os.path.join(*localpath.split("/")[1:])
    f = open(localpath, "w")
    f.write(evaluation["code"])
    f.close()

@app.task(name="tasks.deleteCompetition")
def deleteCompetition(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    datasetLocalPath = "datasets/" + str(compete["title"]) + "/"
    deleteLocalFile(datasetLocalPath)
    db.competitions.delete_one({'_id': ObjectId(competeid)})
    
@app.task(name="tasks.privateDataSet")
def privateDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["privateDataSetUrl"]
    localpath = compete["privateDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    if localpath[-4:] == ".zip":
        localpath = extract_zip(localpath)
    d = getDirTree("datasets/"+str(compete["title"]))
    tree = {'name':'datasets',
            'type':'folder',
            'items':[d]}
    jsonTree = json.dumps(tree)
    data = {"DataSetTree": jsonTree, "privateDataSetPath":localpath, "privateStatus":False}
    updateCompetition(db, competeid, data)
    
@app.task(name="tasks.publicDataSet")
def publicDataSet(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["publicDataSetUrl"]
    localpath = compete["publicDataSetPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    if localpath[-4:] == ".zip":
        localpath = extract_zip(localpath)
    d = getDirTree("datasets/"+str(compete["title"]))
    tree = {'name':'datasets',
            'type':'folder',
            'items':[d]}
    jsonTree = json.dumps(tree)
    data = {"DataSetTree": jsonTree, "publicDataSetPath":localpath, "publicStatus":False}
    updateCompetition(db, competeid, data)

@app.task(name="tasks.sandBoxSubmission")
def sandBoxSubmission(competeid):
    db = connect_to_db(DATABASE)
    compete = get_competition(db, competeid)
    url = compete["sandBoxSubmissionUrl"]
    localpath = compete["sandBoxSubmissionPath"]
    key = url.split("=")[-1]
    downloadFile(key,localpath)
    deleteGdriveFile(key)
    if localpath[-4:] == ".zip":
        localpath = extract_zip(localpath)
    d = getDirTree("submissions/"+str(compete["title"]))
    tree = {'name':'submissions',
            'type':'folder',
            'items':[d]}
    jsonTree = json.dumps(tree)
    data = {"SubmissionTree": jsonTree, "sandBoxSubmissionPath":localpath, "sandBoxStatus":False}
    updateCompetition(db, competeid, data)
    deleteLocalFile(localpath)

def getDirTree(path):
    d = {'name': os.path.basename(path)}
    if os.path.isdir(path):
        d['type'] = "folder"
        d['items'] = [getDirTree(os.path.join(path, x))
                      for x in os.listdir(path)]
    else:
        d['type'] = "file"
    return d
