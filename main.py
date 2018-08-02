import webapp2
import jinja2
import os
import random
from models import playerScore

templateLoader = jinja2.FileSystemLoader(searchpath='./')
templateEnv = jinja2.Environment(loader=templateLoader)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        qry = playerScore.query().order(playerScore.score)
        data = {'scores':playerScore.query().order(playerScore.score).fetch(5)}
        template = templateEnv.get_template('index.html')
        self.response.write(template.render(data))

    def post(self):
        playername = self.request.get('username')
        playerscore = int(self.request.get('score'))
        playerObj = playerScore(playerName=playername, score=playerscore)
        playerObj.put()
        self.get()
        return



app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
