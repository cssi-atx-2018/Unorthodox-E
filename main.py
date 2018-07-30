import webapp2
import jinja2

templateLoader = jinja2.FileSystemLoader(searchpath='./')
templateEnv = jinja2.Environment(loader=templateLoader)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        template = templateEnv.get_template('index.html')
        self.response.write(template.render())


app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
