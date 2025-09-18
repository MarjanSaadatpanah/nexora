import React, { useState, useEffect } from "react";
import { Slider, Typography, Box } from "@mui/material";

const ContributionSlider = ({ min, max, value, onChange }) => {
    const handleSliderChange = (_, newValue) => {
        if (Array.isArray(newValue)) {
            onChange({
                min_contribution: newValue[0],
                max_contribution: newValue[1],
            });
        }
    };

    return (
        <div className="my-11 px-3">
            <label className="block text-sm font-medium">EU Contribution Range (€)</label>
            <Box sx={{ width: "96%" }}>
                <Typography variant="subtitle1" gutterBottom>

                </Typography>
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    step={1000}
                    marks={[
                        { value: min, label: `€${min.toLocaleString()}` },
                        { value: max, label: `€${max.toLocaleString()}` },
                    ]}
                />
                <Typography variant="body2" color="text.secondary">
                    Selected: €{value[0].toLocaleString()} – €{value[1].toLocaleString()}
                </Typography>
            </Box>
        </div>
    );
};


export default ContributionSlider;