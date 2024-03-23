import ScheduleTitle from "../components/Schedule/ScheduleTitle/ScheduleTitle";
import ScheduleSection from "../components/Schedule/ScheduleSection/ScheduleSection";
import AddTimeBlockSection from "../components/Schedule/AddTimeBlockSection/AddTimeBlockSection";
import {Stack} from "@mui/material";

function UpdateSchedule() {
    return (
        <Stack>
            <ScheduleTitle/>
            <ScheduleSection/>
            <AddTimeBlockSection/>
        </Stack>
    )
}

export default UpdateSchedule;