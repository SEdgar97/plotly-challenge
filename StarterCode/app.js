//filter/dropdown
function init()
{
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.property("value");
    d3.json("samples.json").then((dataset)=>
        {
            console.log(dataset.names);
            var sampleNames = dataset.names;
            sampleNames.forEach((sampledata)=>
            {
                dropdownMenu.append("option").text(sampledata).property("value",sampledata);
            });
            var first = sampleNames[0]
            build(first)
            buildplots(first)
        });
}
init();

//create summary data set
function build(sampledata)
{
    d3.json("samples.json").then((dataset) => 
    {
        console.log(dataset);
        var sampleMetadata = dataset.metadata;

        var results = sampleMetadata.filter(s=>s.id == sampledata);
        console.log(results);

        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(results[0]).forEach(([key,value])=>
        {
            panel.append("h6").text(`${key}:${value}`);
        });
    });
};


//bar/bubble graphs
function buildplots(sampledata)
{
    d3.json("samples.json").then((dataset) => 
    {
        console.log(dataset);
        var samples = dataset.samples;
        var results = samples.filter(s=>s.id == sampledata);
        console.log("results");
        console.log(results);
        var graphData = results[0];
        console.log(graphData);
        
        //bar graph (top 10 OTUs)
        var sample_values = graphData.sample_values;
        var otu_ids = graphData.otu_ids;
        var otu_labels = graphData.otu_labels;
        
        var barTrace = 
        {
          x: sample_values.slice(0,10).reverse(),
          y: otu_ids.slice(0,10).map(value=>`OTU ID ${value}`).reverse(),
          type: "bar",
          text: otu_labels.slice(0,10).reverse(),
          orientation: "h"
        };
        var barData = [barTrace];
        var barLayout = 
        {
          title: "Bar",
          xaxis: { title: "Sample Values"},
        };
        
        Plotly.newPlot("bar", barData, barLayout);
        
        //bubble graph
        var bubbleTrace = 
        {
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: 
          {
              color: otu_ids,
              size: sample_values
          },
          text: otu_labels
        };
        var bubbleData = [bubbleTrace];
        var bubbleLayout = 
        {
          title: "Bubble",
          xaxis: { title: "otu_id"},
          yaxis: { title: "sample_value"}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

//event read/change
function optionChanged(sampledata)
{
    build(sampledata);
    buildplots(sampledata);
};
