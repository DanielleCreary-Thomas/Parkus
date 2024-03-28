## business logic
# actual code of making things work
import bridge
def get_group_by_id(id):
    """
    returns the group with matching id
    :param id: id of selected group
    :return: group data in the form of a dictionary
    """
    return bridge.group_id(id)