import webapp2
import os
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "..", "templates")),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class EvalPage(webapp2.RequestHandler):
    def get(self):
        template_values = {
            "title": "Evaluation",
            "eval_class": "active",
        }
        template=JINJA_ENVIRONMENT.get_template('evaluate.html')
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([('/eval', EvalPage),], debug=True)