import './AddTimeBlockSection.css'
import AddIcon from '@mui/icons-material/Add';

import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import * as React from 'react'
function AddTimeBlockSection() {
    const [dow, setDow] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setDow(event.target.value);
    };

    return (
        <FormControl  sx={{ m: 1, minWidth: 120 }}  className="formcontrol">
        <Stack direction="row" spacing={5} className="addTimeBlockSection">
            <Typography variant={"h1"}>Add a time block</Typography>

            {/*    <InputLabel id="dow-label">Day of the Week</InputLabel>*/}
                <Select
                    labelId="dow-label"
                    id="dow-select"
                    value={dow}
                    label="Day of the Week"
                    onChange={handleChange}
                    style={{minWidth:200}}
                >
                    <MenuItem value={0}>Monday</MenuItem>
                    <MenuItem value={1}>Tuesday</MenuItem>
                    <MenuItem value={2}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>

                </Select>
                {/*<InputLabel id="dow-label">Day of the Week</InputLabel>*/}
                <Select
                    labelId="dow-label"
                    id="dow-select"
                    value={dow}
                    label="Day of the Week"
                    onChange={handleChange}
                    style={{minWidth:200}}

                >
                    <MenuItem value={0}>Monday</MenuItem>
                    <MenuItem value={1}>Tuesday</MenuItem>
                    <MenuItem value={2}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>

                </Select>
                {/*<InputLabel id="dow-label">Day of the Week</InputLabel>*/}
                <Select
                    labelId="dow-label"
                    id="dow-select"
                    value={dow}
                    label="Day of the Week"
                    onChange={handleChange}
                    autoWidth
                    style={{minWidth:200}}

                >
                    <MenuItem value={0}>Monday</MenuItem>
                    <MenuItem value={1}>Tuesday</MenuItem>
                    <MenuItem value={2}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>

                </Select>
            <IconButton aria-label={"Add"} size={"large"}><AddIcon fontsize={"large"}></AddIcon></IconButton>
        </Stack>
        </FormControl>

    );
}

export default AddTimeBlockSection;
