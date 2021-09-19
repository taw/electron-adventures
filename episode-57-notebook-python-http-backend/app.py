#!/usr/bin/env python3

from flask import Flask, request
from io import StringIO
import sys

class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        self._stderr = sys.stderr
        self._stringio = StringIO()
        sys.stdout = self._stringio
        sys.stderr = self._stringio
        return self
    def __exit__(self, *args):
        output = self._stringio.getvalue()
        self.append(output)
        sys.stdout = self._stdout
        sys.stderr = self._stderr

app = Flask(__name__)

sessions = {}

@app.route("/code", methods=["POST"])
def code():
    body = request.json
    session_id = body["session_id"]
    code = body["code"]
    sessions.setdefault(session_id, {})
    error = None
    with Capturing() as output:
        try:
            exec(code, sessions[session_id])
        except Exception as e:
            error = str(e)

    return {"output": output[0], "error": error}
