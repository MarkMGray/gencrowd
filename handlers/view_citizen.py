import webapp2
import os
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "..", "templates")),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class ViewCitizen(webapp2.RequestHandler):
    def get(self):
        template_values = {
            "title": "View Citizen",
        }
        template=JINJA_ENVIRONMENT.get_template('view_citizen.html')
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([('/view', ViewCitizen),], debug=True)