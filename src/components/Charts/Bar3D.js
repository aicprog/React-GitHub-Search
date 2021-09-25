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
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.gammel";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

// STEP 3 - Creating the JSON object to store the chart configurations

const Bar3D = ({ data }) => {
	const chartConfigs = {
		type: "bar3d", // The chart type
		width: "100%", // Width of the chart
		height: "400", // Height of the chart
		dataFormat: "json", // Data type
		dataSource: {
			// Chart Configuration
			chart: {
				caption: "Most Forked",
				yAxisName: "Forks",
				XAxisName: "Repos",
				XAxisNameFontSize: "16px",
				YAxisNameFontSize: "16px",
				decimals: 0,
				doghnutRadius: "45%",
				showPercentValues: 0,
				theme: "gammel",
			},
			// Chart Data
			data,
		},
	};

	return <ReactFC {...chartConfigs} />;
};

export default Bar3D;
