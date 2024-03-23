import ScheduleTitle from "../components/ScheduleTitle/ScheduleTitle";
import ScheduleSection from "../components/ScheduleSection/ScheduleSection";
import AddTimeBlockSection from "../components/AddTimeBlockSection/AddTimeBlockSection";
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