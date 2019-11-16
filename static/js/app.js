async function buildMetadata(sample) {

    // Use `d3.json` to fetch the metadata for a sample
    const url = "/metadata/" + sample;
    let data = await d3.json(url);
  
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');
  
    // Use `.html("") to clear any existing metadata
    panel.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    let data_pairs = Object.entries(data);
    data_pairs.forEach(pair => panel.append("text").text(pair[0] + ": " + pair[1] + "\n").append("br"));
  
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
    
  }
  
  async function buildCharts(sample) {
  
    // Use `d3.json` to fetch the sample data for the plots
    const url = "/samples/" + sample;
    let data = await d3.json(url);
  
    // Build a Pie Chart using top 10 values for sample_values, 
    // otu_ids, and labels (10 each).
    let sample_values = data.sample_values;
    let otu_ids = data.otu_ids;
    let otu_labels = data.otu_labels;
  
    let pie_data = {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      type: 'pie',
      hovertext: otu_labels.slice(0,10)
    }
  
    let pie_layout = {
      title: "Top 10 OTU_ID Counts"
    }
  
    Plotly.newPlot("pie", [pie_data], pie_layout);
    
    // Build a Bubble Chart using the sample data
    let bubble_data = {
      type:"scatter",
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
                color: otu_ids, 
                size: sample_values.map(d => d)
              },
      hovertext: otu_labels
    }
  
    let bubble_layout = {
      title: "OTU_IDs in Sample",
      xaxis: {
        title: {
          text: 'OTU ID',
        }
      }
    };
  
    Plotly.newPlot("bubble", [bubble_data], bubble_layout);
  
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();