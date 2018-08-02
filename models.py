from google.appengine.ext import ndb

class playerScore(ndb.Model):
    playerName = ndb.StringProperty(required=True)
    score = ndb.IntegerProperty(required=True)
