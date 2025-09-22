import React from "react";
import { Slider, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    slider: {
        color: "#3b82f6",
        height: 6,
        "& .MuiSlider-thumb": {
            height: 20,
            width: 20,
            backgroundColor: "#fff",
            border: "2px solid currentColor",
            "&:focus, &:hover, &.Mui-active": {
                boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.16)",
            },
        },
        "& .MuiSlider-valueLabel": {
            backgroundColor: "#3b82f6",
            borderRadius: 4,
            padding: "4px 8px",
        },
    },
});

const ContributionSlider = ({ min, max, value, onChange, title, type = "contribution" }) => {
    const classes = useStyles();

    const handleSliderChange = (_, newValue) => {
        if (Array.isArray(newValue)) {
            // Dynamic parameter names based on type
            const params = type === "contribution"
                ? {
                    min_contribution: newValue[0],
                    max_contribution: newValue[1],
                }
                : {
                    min_total_cost: newValue[0],
                    max_total_cost: newValue[1],
                };

            onChange(params);
        }
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="my-10">
            <Box sx={{ width: "97%", px: 1 }}>
                <Typography variant="body2" className="text-gray-600">
                    <label className="block text-xs text-gray-500">
                        {title}: {formatCurrency(value[0])} – {formatCurrency(value[1])}
                    </label>
                </Typography>
                <Slider
                    className={classes.slider}
                    value={value}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                    min={min}
                    max={max}
                    step={max > 1000000 ? 100000 : 1000}
                />
            </Box>
        </div>
    );
};

export default ContributionSlider;