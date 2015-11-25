from google.appengine.ext import ndb

class CompletionCode(ndb.Model):
    code = ndb.StringProperty()
    redeemed = ndb.BooleanProperty()

    @classmethod
    def get_all_completion_codes(cls):
        data = cls.query().fetch()
        if not data:
            return None
        return data

    @classmethod
    def get_completion_code_by_code(cls, code):
        data = cls.query(CompletionCode.code == code).fetch()
        if not data:
            return None
        return data[0]

    @classmethod
    def get_all_unredeemed_codes(cls):
        data = cls.query(CompletionCode.redeemed == False).fetch()
        if not data:
            return None
        return data

    @classmethod
    def get_all_redeemed_codes(cls):
        data = cls.query(CompletionCode.redeemed == True).fetch()
        if not data:
            return None
        return data