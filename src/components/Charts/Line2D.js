// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.zune";
import { useGlobalContext } from "../../context/context";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

// STEP 3 - Creating the JSON object to store the chart configurations

const Line2D = ({ data }) => {

	const {startingWeekDate} = useGlobalContext()

	const chartConfigs = {
		type: "msline", // The chart type
		width: "100%", // Width of the chart
		height: "400", // Height of the chart
		dataFormat: "json", // Data type
		dataSource: {
			// Chart Configuration
			chart: {
				caption: `Overall Commits For Recent Repos`,
				yAxisName: "Commits",
				XAxisName: `Week of ${startingWeekDate(-1).toLocaleDateString()}`,
				XAxisNameFontSize: "16px",
				YAxisNameFontSize: "20px",
				decimals: 0,
				doghnutRadius: "45%",
				showPercentValues: 0,
				theme: "zune",
			},
			// Chart Data
			//data,

			categories: [
				{
					category: [
						{
							label: "Monday",
						},
						{
							label: "Tuesday",
						},
						{
							label: "Wednesday",
						},
						{
							label: "Thursday",
						},
						{
							label: "Friday",
						},
						{
							label: "Saturday",
						},
						{
							label: "Sunday",
						},
					],
				},
			],
			dataset: data,

		},
	};

	return <ReactFC {...chartConfigs} />;
};

export default Line2D;
