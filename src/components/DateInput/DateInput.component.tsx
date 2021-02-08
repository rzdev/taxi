import React, {FC, useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import {Box, Grid, Paper, Typography} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {IDateInputProps} from './DateInput.types';

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: '40%'
  },
  valueLabel: {
    '& span': {
      background: 'none',
      color: '#000'
    }
  }
})(Slider);

const DateInput:FC<IDateInputProps> = ({min, max, value, animationSpeed, onChange, formatLabel, selectedDate, handleDateChange}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation] = useState<any>({});

  useEffect(() => {
    //remove animation if ID exists
    return () => animation.id && cancelAnimationFrame(animation.id);
  }, [animation]);

  if (max !== null && min !== null && value !== null && isPlaying && !animation.id) {
    const span = value[1] - value[0];
    let nextValueMin = value[0] + animationSpeed;
    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }
    animation.id = requestAnimationFrame(() => {
      animation.id = 0;
      onChange([nextValueMin, nextValueMin + span]);
    });
  }

  const isButtonEnabled = value !== null && max !== null && min !== null ? value[0] > min || value[1] < max : false;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Box position="absolute" top={'10px'} left={'10px'} width={'500px'}>
          <Paper style={{padding:10}}>
            <Grid container>
              <Typography variant="h5" component="h2">
                Singapore Taxi Tracker
              </Typography>
            </Grid>
            <Grid container justify="space-between" direction="row">
              <Grid item>
                <KeyboardDatePicker
                  shouldDisableDate={(date) => date ? date.getDate() >= new Date().getDate() : true} // disabled today and future dates
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time From"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
            </Grid>
            <Grid container justify="flex-start" alignItems="center">
                <Button color="primary" disabled={!isButtonEnabled} onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Button>
                {value !== null && max !== null && min !== null && (
                  <SliderInput
                    min={min}
                    max={max}
                    value={value}
                    onChange={(event, newValue) => onChange(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatLabel}
                  />
                )}
              </Grid>
          </Paper>
        </Box>
      </MuiPickersUtilsProvider>
  );
}

export default DateInput;
