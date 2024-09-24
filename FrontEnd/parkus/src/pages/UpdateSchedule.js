import React, { useState } from 'react';
import ScheduleTitle from "../components/Schedule/ScheduleTitle/ScheduleTitle";
import TimeTable from "../components/Schedule/TimeTable/TimeTable";
import AddScheduleButton from "../components/Schedule/AddScheduleButton/AddScheduleButton";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";

function UpdateSchedule() {
    const [timeBlocks, setTimeBlocks] = useState([]);
    const [showWarning, setShowWarning] = useState(false);

    const handleSaveTimeBlock = (newTimeBlock) => {
        setTimeBlocks(prevTimeBlocks => {
            const isDuplicate = prevTimeBlocks.some(block =>
                block.day === newTimeBlock.day &&
                block.startTime === newTimeBlock.startTime &&
                block.endTime === newTimeBlock.endTime
            );

            const isOverlap = prevTimeBlocks.some(block =>
                block.day === newTimeBlock.day &&
                ((newTimeBlock.startTime >= block.startTime && newTimeBlock.startTime < block.endTime) ||
                    (newTimeBlock.endTime > block.startTime && newTimeBlock.endTime <= block.endTime))
            );

            if (isDuplicate || isOverlap || !newTimeBlock.day || !newTimeBlock.startTime || !newTimeBlock.endTime) {
                setShowWarning(true);
                return prevTimeBlocks;
            } else {
                return [...prevTimeBlocks, newTimeBlock];
            }
        });
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <ScheduleTitle />
                <TimeTable timeBlocks={timeBlocks} />
                <AddScheduleButton onSave={handleSaveTimeBlock} />

                {/* Dialog for warning */}
                <Dialog open={showWarning} onClose={handleCloseWarning}>
                    <DialogTitle>Adding Time Block Failed</DialogTitle>
                    <DialogContent>
                        <p>
                            This time block already exists <br />
                            or the time block has overlapping <br />
                            try another time block.
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseWarning} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default UpdateSchedule;
