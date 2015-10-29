from google.appengine.api import users
import webapp2
import os
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainPage(webapp2.RequestHandler):
    def get(self):
        template_values = {
            "title": "Home Page"
        }
        template=JINJA_ENVIRONMENT.get_template('templates/index.html')
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([('/', MainPage),], debug=True)