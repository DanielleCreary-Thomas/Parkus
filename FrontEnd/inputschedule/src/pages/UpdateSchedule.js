import ScheduleTitle from "../components/ScheduleTitle/ScheduleTitle";
import ScheduleSection from "../components/ScheduleSection/ScheduleSection";
import AddTimeBlockSection from "../components/AddTimeBlockSection/AddTimeBlockSection";

function UpdateSchedule() {
    return (
        <div>
            <div>
                <ScheduleTitle/>
            </div>
            <div>
                <ScheduleSection/>
            </div>
            <div>
                <AddTimeBlockSection/>
            </div>
        </div>
    )
}

export default UpdateSchedule;