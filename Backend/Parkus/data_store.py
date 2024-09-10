# data_store.py
import psycopg2

# from bridge import fetch_user_schedule_from_db
import bridge

conn = psycopg2.connect("dbname=parkus user=postgres password=1112")

def get_user_schedule_service(userid):
    """
    returns a user schedule
    :param userid: the selected user id
    :return: parsed user schedule
    """
    schedule_items = bridge.fetch_user_schedule_from_db(userid)
    return parse_schedule(schedule_items)

def hours_diff(start, end):
    """
    returns the hours difference between start and end for row span to use.
    :param start: the start time
    :param end: the end time
    :return: hours difference between start and end
    """
    # If end time is smaller than start time, it means end time is on the next day
    if end < start:
        end_in_minutes = (24 * 60) + (end.hour * 60 + end.minute)
    else:
        end_in_minutes = (end.hour * 60 + end.minute)
    start_in_minutes = (start.hour * 60 + start.minute)
    return (end_in_minutes - start_in_minutes) // 60

def parse_schedule(schedule_items):
    """
    returns a parsed schedule
    :param schedule_items: a list of user schedule items
    :return: parsed schedule
    """
    schedule = {}
    if schedule_items:
        for item in schedule_items:
            description, dow, start_time, end_time = item

            start_time_formatted = start_time.strftime('%H:%M')
            end_time_formatted = end_time.strftime('%H:%M')
            rowspan = hours_diff(start_time, end_time)

            if start_time_formatted not in schedule:
                schedule[start_time_formatted] = {}

            schedule[start_time_formatted][str(dow)] = {
                'text': description,
                'isBooked': True,
                'rowspan': rowspan
            }
    return schedule
