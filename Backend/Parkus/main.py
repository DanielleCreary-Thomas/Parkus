##Controller
# Http Endpoints
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

@app.route('/groups/matchmake/<id>', methods=['GET', 'OPTIONS'])
def matchmake(id):
    """
    Matches the given user with the available groups
    :param id: given userID
    :return: the groups that match the user's schedule
    """
    # test = request.args.get('id')
    assert id == request.view_args['id']
    if data_store.validate_no_group(id):
        returnData = {
            'availableGroups': data_store.complete_matchmaking(id)
        }
    else:
        returnData = {}
    return returnData

@app.route('/permits/userid/<group_id>', methods=['GET', 'OPTIONS'])
def get_group_leader(groupid):
    """
    Returns the userid for the leader of a given group
    :param groupid: the given group's id'
    :return: the userid for the group leader
    """
    assert groupid == request.view_args['group_id']
    return data_store.get_group_leader(groupid)

@app.route('/users/paid/<user_id>', methods=['GET', 'OPTIONS'])
def check_paid_member(userid):
    """
        Returns whether the given user has paid the group leader
        :param id: the user's id
        :return: Boolean value indicating whether the user is paid or not
    """
    assert userid == request.view_args['user_id']
    return data_store.check_paid_member(userid)

@app.route('/users/etransfer', methods=['POST'])
def etransfer_image():
    """uploads a user's etransfer image
    :param image: the user's etransfer image
    :return: the user's etransfer image
    """
    #assert formData == request.form
    print(request.data)
    image = request.data['proofImage']#need to correct
    userid = request.form['userid']

    return data_store.upload_etransfer_image(image, userid)

if __name__ == '__main__':
    app.run()
