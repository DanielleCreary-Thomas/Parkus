##Controller
# Http Endpoints
import requests
import data_store
import flask
from flask import render_template, send_from_directory
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# GET Endpoints

@app.route('/groups/<id>', methods=['GET', 'OPTIONS'])
def group(id):
    """
    Sends the data for a single group with the given id
    :param id: the selected group's id
    :return: return data for the given group in the form of a dictionary
    """
    assert id == request.view_args['id']
    returnData = {
        'selectedGroup': data_store.get_group_by_id(id)
    }
    return returnData


if __name__ == '__main__':
    app.run()
