
/* 	Developed by César Bulhões
	Github: https://github.com/acab2/CinemaTrends
*/
	
	
	//Margin values
	var margin = {top: 50, right: 100, bottom: 50, left: 100}
	  , width = 800 - margin.left - margin.right // Use the window's width 
	  , height = 550 - margin.top - margin.bottom; // Use the window's height
	   
	//Adding SVGs
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + " )");
	
	var svg2 = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + " )");	
	
	//Adding title
	svg.append("text").text("Cinema Trends Since 1950").attr("x", -100). attr("y", -10).attr("font-size", 20).attr("fill", "#756bb1");
	
	
	//Adding borders
	var borderPath = svg.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", width)
       			.style("stroke", "black")
       			.style("fill", "none")
       			.style("stroke-width", 1);
	
	var borderPath2 = svg.append("rect")
       			.attr("x", -100)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", 100)
       			.style("stroke", "black")
       			.style("fill", "none")
       			.style("stroke-width", 1);
	
	var borderPath3 = svg.append("rect")
       			.attr("x", width)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", 100)
       			.style("stroke", "black")
       			.style("fill", "none")
       			.style("stroke-width", 1);
	
	//Declaring tooltips
	var tooltip = d3.select("body").append("div").attr("class", "toolTip");
	var tooltipCast = d3.select("body").append("div").attr("class", "toolTip")
				.style("left", 10  + "px")
				.style("top", 585 + "px")
				.style("display", "inline-block");
	
	//Adding tooltip showing cast from selected node
	svg2.append("text").text("Cast").attr("x", -100). attr("y", -30).attr("font-size", 20).attr("fill", "#756bb1");

	//Setting color scale
	var color = d3.scaleOrdinal()
				.domain([1,2,3,4,5,6,7,8,9,10,11])
				.range(["black", "#800026", "#bd0026", "#e31a1c", 
				"#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", 
				"#ffeda0", "#ffffcc", "gray"]);
	
	//Declaring global variables	
	start = 0;
	var simulation	= d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
	
	var node, link;
	var data = [];
	var movies;
	var quantityPerGenre = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	
	//Categorie list
	var allCategories = ["Action","Adventure","Animation","Comedy",
					"Crime","Documentary","Drama","Family",
					"Fantasy","Foreign","History","Horror",
					"Music","Mystery","Romance","Science Fiction",
					"TV Movie","Thriller","War","Western"];
	
	//Array that sets if a genre is visible
	var categories = [	{"name": "Action","visible": false},
					{"name": "Adventure","visible": false},
					{"name": "Animation","visible": false},
					{"name": "Comedy","visible": false},
					{"name": "Crime","visible": false},
					{"name": "Documentary","visible": false},
					{"name": "Drama","visible": false},
					{"name": "Family","visible": false},
					{"name": "Fantasy","visible": false},
					{"name": "Foreign","visible": false},
					{"name": "History","visible": false},
					{"name": "Horror","visible": false},
					{"name": "Music","visible": false},
					{"name": "Mystery","visible": false},
					{"name": "Romance","visible": false},
					{"name": "Science Fiction","visible": false},
					{"name": "TV Movie","visible": false},
					{"name": "Thriller","visible": false},
					{"name": "War","visible": false},
					{"name": "Western","visible": false}];
	
	//Inicial bush position
	var minDate = 2016, maxDate = 2017;
	//Global graph
	var graphy = [];
	var auxNodes = [], auxLinks = [], auxGraph = [];
	
	//Function that converts data to nodes and links format
	// returns [links{source,target,value}, nodes{budget,cast,companies,director,genres,group,id,movie_id,popularity,release_date,revenue}]
	function createNodesAndLinks(dataAux, nodesAux, linksAux, graphAux){
		nodesAux = [], linksAux = [], graphAux =[];
		var j, k,l, value, indiceLink = 0, movieNodes = [], sucesso = 0, grupo = 1;
		for(i = 0; i < dataAux.length; i++){
			
			//Calculating group comparing revenue and budget
			if(dataAux[i].budget == 0){
				grupo = 11;
			}else if(dataAux[i].revenue >= 25*dataAux[i].budget){
				grupo = 10;
			}else if(dataAux[i].revenue >= 20*dataAux[i].budget && dataAux[i].revenue < 25*dataAux[i].budget){
				grupo = 9;
			}else if(dataAux[i].revenue >= 15*dataAux[i].budget && dataAux[i].revenue < 20*dataAux[i].budget){
				grupo = 8;
			}else if(dataAux[i].revenue >= 10*dataAux[i].budget && dataAux[i].revenue < 15*dataAux[i].budget){
				grupo = 7;
			}else if(dataAux[i].revenue >= 8*dataAux[i].budget && dataAux[i].revenue < 10*dataAux[i].budget){
				grupo = 6;
			}else if(dataAux[i].revenue >= 6*dataAux[i].budget && dataAux[i].revenue < 8*dataAux[i].budget){
				grupo = 5;
			}else if(dataAux[i].revenue >= 4*dataAux[i].budget && dataAux[i].revenue < 6*dataAux[i].budget){
				grupo = 4;
			}else if(dataAux[i].revenue >= 2*dataAux[i].budget && dataAux[i].revenue < 4*dataAux[i].budget){
				grupo = 3;
			}else if(dataAux[i].revenue >= dataAux[i].budget && dataAux[i].revenue < 2*dataAux[i].budget){
				grupo = 2;
			}else{
				grupo = 1;
			}
			
			//Calculates quantityPerGenre displayed on the graph
			var j, genresAux = "";
			for(j = 0; j < dataAux[i].genres.length; j++){
				if(dataAux[i].genres[j] == "Action"){
					quantityPerGenre[0]++;
				}else if(dataAux[i].genres[j] == "Adventure"){
					quantityPerGenre[1]++;
				}else if(dataAux[i].genres[j] == "Animation"){
					quantityPerGenre[2]++;
				}else if(dataAux[i].genres[j] == "Comedy"){
					quantityPerGenre[3]++;
				}else if(dataAux[i].genres[j] == "Crime"){
					quantityPerGenre[4]++;
				}else if(dataAux[i].genres[j] == "Documentary"){
					quantityPerGenre[5]++;
				}else if(dataAux[i].genres[j] == "Drama"){
					quantityPerGenre[6]++;
				}else if(dataAux[i].genres[j] == "Family"){
					quantityPerGenre[7]++;
				}else if(dataAux[i].genres[j] == "Fantasy"){
					quantityPerGenre[8]++;
				}else if(dataAux[i].genres[j] == "Foreign"){
					quantityPerGenre[9]++;
				}else if(dataAux[i].genres[j] == "History"){
					quantityPerGenre[10]++;
				}else if(dataAux[i].genres[j] == "Horror"){
					quantityPerGenre[11]++;
				}else if(dataAux[i].genres[j] == "Music"){
					quantityPerGenre[12]++;
				}else if(dataAux[i].genres[j] == "Mystery"){
					quantityPerGenre[13]++;
				}else if(dataAux[i].genres[j] == "Romance"){
					quantityPerGenre[14]++;
				}else if(dataAux[i].genres[j] == "Science Fiction"){
					quantityPerGenre[15]++;
				}else if(dataAux[i].genres[j] == "TV Movie"){
					quantityPerGenre[16]++;
				}else if(dataAux[i].genres[j] == "Thriller"){
					quantityPerGenre[17]++;
				}else if(dataAux[i].genres[j] == "War"){
					quantityPerGenre[18]++;
				}else if(dataAux[i].genres[j] == "Western"){
					quantityPerGenre[19]++;
				}
				
				if(j+1 == dataAux[i].genres.length){
					genresAux = genresAux + dataAux[i].genres[j];
				}else{
					genresAux = genresAux + dataAux[i].genres[j] + " | ";
				}
			}
			
			//Treats the string turning into an array
			var companiesAux = "";
			for(j = 0; j < dataAux[i].production_companies.length; j++){
				if(j+1 == dataAux[i].production_companies.length){
					companiesAux = companiesAux + dataAux[i].production_companies[j];
				}else{
					companiesAux = companiesAux + dataAux[i].production_companies[j] + " | ";
				}
			}
			var castAux = "";
			for(j = 0; j < dataAux[i].cast.length; j++){
				if(j+1 == dataAux[i].cast.length){
					castAux = castAux + dataAux[i].cast[j].name;
				}else{
					castAux = castAux + dataAux[i].cast[j].name + "";
				}
				
			}
			
			//Set information to Nodes
			nodesAux.push({"id": dataAux[i].title, "group": grupo, "movie_id": dataAux[i].id,
						"budget": dataAux[i].budget, "revenue": dataAux[i].revenue, 
						"director": dataAux[i].director, "genres": genresAux, "release_date": dataAux[i].release_date, 
						"popularity": dataAux[i].popularity, "companies": companiesAux, "cast": castAux});
			
			//calculates the cast similarity between nodes and set the information to the links
			for(j = i+1; j < dataAux.length-1; j++){
				value = 0;
				for(k = 0; k < dataAux[i].cast.length; k++){
					for(l = 0; l < dataAux[j].cast.length; l++){
						if(dataAux[i].cast[k].name == dataAux[j].cast[l].name){
							value++;
						}
					}
				}
				if(value > 0 && i != 1){
					var source = {"id": dataAux[i].title, "group": 1, "index": indiceLink};
					var target = {"id": dataAux[j].title, "group": 1, "index": indiceLink}
					linksAux.push({"source": dataAux[i].title,"target": dataAux[j].title, "value": value});
					indiceLink++;
				}
			}
		}
		
		//Put it all in an unique array [nodes,links]
		graphAux.push({"nodes": nodesAux, "links": linksAux});
		
		graphAux = graphAux[0];
	return graphAux;
		
	}
	
	//Function that converts the data to a CSV String and parses it to the right data format
	function convertToGraph(aux){
		var i, aNodes = [], aLinks = [], rLinks = [], rNodes = [];
		for(i = 0; i < aux.nodes.length; i++){
			if(i+1 == aux.nodes.length){
				rNodes = rNodes + aux.nodes[i].id + "," + aux.nodes[i].group + "," + aux.nodes[i].budget + "," + aux.nodes[i].revenue + "," + aux.nodes[i].director + "," +  aux.nodes[i].genres + "," + aux.nodes[i].release_date + "," + aux.nodes[i].popularity + "," + aux.nodes[i].companies + "," + aux.nodes[i].cast; 
			}else{
				rNodes = rNodes + aux.nodes[i].id + "," + aux.nodes[i].group + "," + aux.nodes[i].budget + "," + aux.nodes[i].revenue + "," + aux.nodes[i].director + "," +  aux.nodes[i].genres + "," + aux.nodes[i].release_date + "," + aux.nodes[i].popularity + "," + aux.nodes[i].companies + "," + aux.nodes[i].cast + "\n";
			}
		}
		
		aNodes = d3.csvParse("id,group,budget,revenue,director,genres,release_date,popularity,companies,cast\n" + rNodes);
		
		for(i = 0; i < aux.links.length; i++){
			
			if(i+1 == aux.links.length){
				rLinks = rLinks + aux.links[i].source + "," + aux.links[i].target + "," + aux.links[i].value
			}else{
				rLinks = rLinks + aux.links[i].source + "," + aux.links[i].target + "," + aux.links[i].value +"\n";
			}
		}
		aLinks = d3.csvParse("source,target,value\n" + rLinks);
		
		  return {"nodes": aNodes,"links": aLinks};
	}
	
	//Function that gets data in a period of years
	function getPeriod(yearMin, yearMax){
		var i,j,k;
		var result = [], counter = 0;
		auxGraph = [];
		for(i = 0; i < data.length; i++){
			counter = 0
			if(data[i].release_date.split("-")[0] >= yearMin && data[i].release_date.split("-")[0] <= yearMax){
				for(j = 0; j < categories.length; j++){
					if(categories[j].visible){
						
						for(k = 0; k < data[i].genres.length; k++){
							if(categories[j].name == data[i].genres[k] && counter == 0){
								counter++;
								result.push(data[i]);
								auxGraph.push(data[i]);
							}
							
						}
					}
				}	
			}				
		}				
		
		
		return result;
	}
	
	//Function that updates all views
	function click(min, max){
		quantityPerGenre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		graphy = convertToGraph(createNodesAndLinks(getPeriod(min,max), auxNodes, auxLinks, auxGraph))
		updateGraph(graphy);
		updateBarChart();
	}
	
	//Plotting graph and simulation
	var linkGroup = svg.append("g").attr("class", "links");
	var linkElements = linkGroup.selectAll("line")
		.data(graphy.links);
	var nodeGroup = svg.append("g").attr("class", "nodes");
	var nodeElements = nodeGroup.selectAll("nodes")
		.data(graphy.nodes);	
	
	function updateGraph(graph){
		linkElements = linkGroup.selectAll("line")
		.data(graph.links);
		
		nodeElements = nodeGroup.selectAll("circle")
		.data(graph.nodes);
		
		linkElements.exit().transition()
				  .attr("stroke-opacity", 0)
				  .attrTween("x1", function(d) { return function() { return d.source.x; }; })
				  .attrTween("x2", function(d) { return function() { return d.target.x; }; })
				  .attrTween("y1", function(d) { return function() { return d.source.y; }; })
				  .attrTween("y2", function(d) { return function() { return d.target.y; }; })
				  .remove();
		
		nodeElements.exit().transition()
					  .attr("r", 0)
					  .remove();
		
		var linkEnter = linkElements.enter().append("line")
		.call(function(linkElements) { linkElements.transition().attr("stroke-opacity", 1); 
								   linkElements.transition().attr("stroke-width", function(d) { return Math.sqrt(d.value); });});
				
		var nodeEnter = nodeElements.enter().append("circle")
		  .attr("fill", function(d) { return color(d.group); })
		  .call(function(nodeElements) { nodeElements.transition().attr("r", 5);})
		  .call(d3.drag().on("start", dragstarted)
											  .on("drag", dragged)
											  .on("end", dragended))
											  
		//Event that shows the movie information moving the mouse over a node
		.on("mouseover", function(d) {
		  tooltip
              .style("left", d3.event.pageX + 5 + "px")
              .style("top", d3.event.pageY + "px")
              .style("display", "inline-block")
              .html((d.id) + "<br>" 
			  + "Director: " + (d.director) + "<br>"
			  + "Genres: " + (d.genres) + "<br>"
			  + "Budget: $ " + (d.budget) + "<br>" 
			  + "Revenue: $ " + (d.revenue) + "<br>"
			  + "Release Year: " + (d.release_date) + "<br>"
			  + "Popularity: " + d.popularity + "<br>"
			  + "Companies: " + d.companies);
       })
		.on("mouseout", function(d){ tooltip.style("display", "none");})
		
		//Event that shows the cast information from a selected node
		.on("click", function(d){ tooltipCast
									.html((d.cast.replace(/\"/g, "<br>")));});
		
		linkElements = linkEnter.merge(linkElements);
		
		nodeElements = nodeEnter.merge(nodeElements);

		simulation
		  .nodes(graph.nodes)
		  .on("tick", ticked);

		simulation.force("link")
		  .links(graph.links);

		simulation.restart();
		
		//Functions to turn possible the moviments of nodes and links displayed in graph
		function ticked() {
			
			linkElements
			.attr("x1", function(d) { if(d.source.x < 5){
										return 5;
									}else if(d.source.x > width-5){
										return width-5;
									}else{
										return d.source.x; 
									}})
			.attr("y1", function(d) { if(d.source.y < 5){
										return 5;
									}else if(d.source.y > height-5){
										return height-5;
									}else{
										return d.source.y; 
									}})
			.attr("x2", function(d) { if(d.target.x < 5){
										return 5;
									}else if(d.target.x > width-5){
										return width-5;
									}else{
										return d.target.x; 
									}})
			.attr("y2", function(d) { if(d.target.y < 5){
										return 5;
									}else if(d.target.y > height-5){
										return height-5;
									}else{
										return d.target.y; 
									}});

			nodeElements
			.attr("cx", function(d) { if(d.x < 5){
										return 5;
									}else if(d.x > width-5){
										return width-5;
									}else{
										return d.x;
									}})
			.attr("cy", function(d) { if(d.y < 5){
										return 5;
									}else if(d.y > height-5){
										return height-5;
									}else{
										return d.y; 
									}});
		}
	}
	
	//Getting and fixing original data from movies from https://www.kaggle.com/tmdb/tmdb-movie-metadata
	if(start == 0){
		start = 1;
		d3.csv("tmdb_5000_movies.csv", function(error2, dataset2) {
			if (error2) throw error;
			movies = dataset2;
			
			movies[4553].release_date = "2015";
				movies[3971].genres = "[{\"id\": 12, \"name\": \"Adventure\"}, {\"id\": 80, \"name\": \"Crime\"}, {\"id\": 18, \"name\": \"Drama\"}]";
				movies[3992].genres = "[{\"id\": 27, \"name\": \"Horror\"}, {\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 14, \"name\": \"Fantasy\"}]";
				movies[4068].genres = "[{\"id\": 18, \"name\": \"Drama\"}, {\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 9648, \"name\": \"Mystery\"}]";
				movies[4105].genres = "[{\"id\": 12, \"name\": \"Adventure\"}]";
				movies[4118].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 10749, \"name\": \"Romance\"}, {\"id\": 28, \"name\": \"Action\"}]";
				movies[4293].genres = "[{\"id\": 10749, \"name\": \"Romance\"}, {\"id\": 28, \"name\": \"Action\"}, {\"id\": 53, \"name\": \"Thriller\"}]";
				movies[4314].genres = "[{\"id\": 53, \"name\": \"Thriller\"}, {\"id\": 9648, \"name\": \"Mystery\"}, {\"id\": 27, \"name\": \"Horror\"}]";
				movies[4385].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 18, \"name\": \"Drama\"}]";
				movies[4400].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 18, \"name\": \"Drama\"}]";
				movies[4413].genres = "[{\"id\": 18, \"name\": \"Drama\"}]";
				movies[4458].genres = "[{\"id\": 18, \"name\": \"Drama\"}]";
				movies[4504].genres = "[{\"id\": 18, \"name\": \"Drama\"}, {\"id\": 28, \"name\": \"Action\"}, {\"id\": 53, \"name\": \"Thriller\"}]";
				movies[4550].genres = "[{\"id\": 99, \"name\": \"Documentary\"}]";
				movies[4553].genres = "[{\"id\": 36, \"name\": \"History\"}]";
				movies[4562].genres = "[{\"id\": 10751, \"name\": \"Family\"}]";
				movies[4566].genres = "[{\"id\": 28, \"name\": \"Action\"}]";
				movies[4569].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 10749, \"name\": \"Romance\"}]";
				movies[4571].genres = "[{\"id\": 99, \"name\": \"Documentary\"}]";
				movies[4581].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 14, \"name\": \"Fantasy\"}, {\"id\": 27, \"name\": \"Horror\"}]";
				movies[4611].genres = "[{\"id\": 18, \"name\": \"Drama\"}]";
				movies[4622].genres = "[{\"id\": 18, \"name\": \"Drama\"}, {\"id\": 10402, \"name\": \"Music\"}]";
				movies[4633].genres = "[{\"id\": 28, \"name\": \"Action\"}, {\"id\": 12, \"name\": \"Adventure\"}, {\"id\": 9648, \"name\": \"Mystery\"}]";
				movies[4657].genres = "[{\"id\": 99, \"name\": \"Documentary\"}]";
				movies[4674].genres = "[{\"id\": 99, \"name\": \"Documentary\"}]";
				movies[4681].genres = "[{\"id\": 35, \"name\": \"Comedy\"}]";
				movies[4714].genres = "[{\"id\": 18, \"name\": \"Drama\"}]";
				movies[4716].genres = "[{\"id\": 99, \"name\": \"Documentary\"}, {\"id\": 10752, \"name\": \"War\"}]";
				movies[4801].genres = "[{\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 18, \"name\": \"Drama\"}, {\"id\": 10749, \"name\": \"Romance\"}]";
				movies[1011].production_companies = ""; movies[1360].production_companies = ""; movies[1669].production_companies = "";
				movies[1754].production_companies = ""; movies[1898].production_companies = ""; movies[1937].production_companies = "";
				movies[1985].production_companies = ""; movies[2059].production_companies = ""; movies[2174].production_companies = "";
				movies[2211].production_companies = ""; movies[2226].production_companies = ""; movies[2248].production_companies = "";
				movies[2256].production_companies = ""; movies[2265].production_companies = ""; movies[2272].production_companies = "";
				movies[2379].production_companies = ""; movies[2401].production_companies = ""; movies[2498].production_companies = "";
				movies[2506].production_companies = ""; movies[2614].production_companies = ""; movies[2631].production_companies = "";
				movies[2648].production_companies = ""; movies[2650].production_companies = ""; movies[2677].production_companies = "";
				movies[2705].production_companies = ""; movies[2713].production_companies = ""; movies[2728].production_companies = "";
				movies[2764].production_companies = ""; movies[2848].production_companies = ""; movies[2878].production_companies = "";
				movies[2894].production_companies = ""; movies[2899].production_companies = ""; movies[2903].production_companies = "";
				movies[2906].production_companies = ""; movies[2971].production_companies = ""; movies[3049].production_companies = "";
				movies[3089].production_companies = ""; movies[3098].production_companies = ""; movies[3103].production_companies = "";
				movies[3112].production_companies = ""; movies[3116].production_companies = ""; movies[3122].production_companies = "";
				movies[3151].production_companies = ""; movies[3180].production_companies = ""; movies[3187].production_companies = "";
				movies[3192].production_companies = ""; movies[3225].production_companies = ""; movies[3226].production_companies = "";
				movies[3241].production_companies = ""; movies[3243].production_companies = ""; movies[3248].production_companies = "";
				movies[3268].production_companies = ""; movies[3289].production_companies = ""; movies[3292].production_companies = "";
				movies[3298].production_companies = ""; movies[3317].production_companies = ""; movies[3319].production_companies = "";
				movies[3322].production_companies = ""; movies[3324].production_companies = ""; movies[3361].production_companies = "";
				movies[3369].production_companies = ""; movies[3377].production_companies = ""; movies[3382].production_companies = "";
				movies[3388].production_companies = ""; movies[3408].production_companies = ""; movies[3410].production_companies = "";
				movies[3419].production_companies = ""; movies[3432].production_companies = ""; movies[3452].production_companies = "";
				movies[3496].production_companies = ""; movies[3500].production_companies = ""; movies[3502].production_companies = "";
				movies[3503].production_companies = ""; movies[3510].production_companies = ""; movies[3517].production_companies = "";
				movies[3519].production_companies = ""; movies[3521].production_companies = ""; movies[3523].production_companies = "";
				movies[3525].production_companies = ""; movies[3540].production_companies = ""; movies[3544].production_companies = "";
				movies[3547].production_companies = ""; movies[3553].production_companies = ""; movies[3578].production_companies = "";
				movies[3588].production_companies = ""; movies[3610].production_companies = ""; movies[3614].production_companies = "";
				movies[3625].production_companies = ""; movies[3630].production_companies = ""; movies[3645].production_companies = "";
				movies[3649].production_companies = ""; movies[3652].production_companies = ""; movies[3661].production_companies = "";
				movies[3673].production_companies = ""; movies[3681].production_companies = ""; movies[3686].production_companies = "";
				movies[3687].production_companies = ""; movies[3693].production_companies = ""; movies[3707].production_companies = "";
				movies[3718].production_companies = ""; movies[3756].production_companies = ""; movies[3768].production_companies = "";
				movies[3771].production_companies = ""; movies[3787].production_companies = ""; movies[3800].production_companies = "";
				movies[3805].production_companies = ""; movies[3818].production_companies = ""; movies[3842].production_companies = "";
				movies[3844].production_companies = ""; movies[3846].production_companies = ""; movies[3852].production_companies = "";
				movies[3856].production_companies = ""; movies[3859].production_companies = ""; movies[3863].production_companies = "";
				movies[3897].production_companies = ""; movies[3917].production_companies = ""; movies[3921].production_companies = "";
				movies[3922].production_companies = ""; movies[3932].production_companies = ""; movies[3943].production_companies = "";
				movies[3945].production_companies = ""; movies[3953].production_companies = ""; movies[3957].production_companies = "";
				movies[3960].production_companies = ""; movies[3965].production_companies = ""; movies[3971].production_companies = "";
				movies[3977].production_companies = ""; movies[3989].production_companies = ""; movies[3992].production_companies = "";
				movies[3995].production_companies = ""; movies[4002].production_companies = ""; movies[4004].production_companies = "";
				movies[4007].production_companies = ""; movies[4009].production_companies = ""; movies[4020].production_companies = "";
				movies[4026].production_companies = ""; movies[4027].production_companies = ""; movies[4029].production_companies = "";
				movies[4034].production_companies = ""; movies[4054].production_companies = ""; movies[4056].production_companies = "";
				movies[4059].production_companies = ""; movies[4067].production_companies = ""; movies[4068].production_companies = "";
				movies[4087].production_companies = ""; movies[4102].production_companies = ""; movies[4105].production_companies = "";
				movies[4106].production_companies = ""; movies[4110].production_companies = ""; movies[4112].production_companies = "";
				movies[4118].production_companies = ""; movies[4119].production_companies = ""; movies[4120].production_companies = "";
				movies[4124].production_companies = ""; movies[4136].production_companies = ""; movies[4142].production_companies = "";
				movies[4148].production_companies = ""; movies[4149].production_companies = ""; movies[4154].production_companies = "";
				movies[4160].production_companies = ""; movies[4169].production_companies = ""; movies[4178].production_companies = "";
				movies[4179].production_companies = ""; movies[4181].production_companies = ""; movies[4186].production_companies = "";
				movies[4188].production_companies = ""; movies[4197].production_companies = ""; movies[4205].production_companies = "";
				movies[4212].production_companies = ""; movies[4223].production_companies = ""; movies[4233].production_companies = "";
				movies[4235].production_companies = ""; movies[4236].production_companies = ""; movies[4239].production_companies = "";
				movies[4241].production_companies = ""; movies[4247].production_companies = ""; movies[4252].production_companies = "";
				movies[4255].production_companies = ""; movies[4258].production_companies = ""; movies[4262].production_companies = "";
				movies[4271].production_companies = ""; movies[4272].production_companies = ""; movies[4273].production_companies = "";
				movies[4285].production_companies = ""; movies[4305].production_companies = ""; movies[4307].production_companies = "";
				movies[4309].production_companies = ""; movies[4310].production_companies = ""; movies[4313].production_companies = "";
				movies[4314].production_companies = ""; movies[4315].production_companies = ""; movies[4316].production_companies = "";
				movies[4318].production_companies = ""; movies[4322].production_companies = ""; movies[4327].production_companies = "";
				movies[4328].production_companies = ""; movies[4357].production_companies = ""; movies[4358].production_companies = "";
				movies[4367].production_companies = ""; movies[4369].production_companies = ""; movies[4371].production_companies = "";
				movies[4374].production_companies = ""; movies[4375].production_companies = ""; movies[4383].production_companies = "";
				movies[4384].production_companies = ""; movies[4385].production_companies = ""; movies[4388].production_companies = "";
				movies[4389].production_companies = ""; movies[4400].production_companies = ""; movies[4401].production_companies = "";
				movies[4402].production_companies = ""; movies[4405].production_companies = ""; movies[4408].production_companies = "";
				movies[4411].production_companies = ""; movies[4413].production_companies = ""; movies[4415].production_companies = "";
				movies[4417].production_companies = ""; movies[4422].production_companies = ""; movies[4426].production_companies = "";
				movies[4430].production_companies = ""; movies[4431].production_companies = ""; movies[4435].production_companies = "";
				movies[4445].production_companies = ""; movies[4454].production_companies = ""; movies[4456].production_companies = "";
				movies[4458].production_companies = ""; movies[4461].production_companies = ""; movies[4462].production_companies = "";
				movies[4468].production_companies = ""; movies[4478].production_companies = ""; movies[4482].production_companies = "";
				movies[4483].production_companies = ""; movies[4487].production_companies = ""; movies[4488].production_companies = "";
				movies[4490].production_companies = ""; movies[4491].production_companies = ""; movies[4493].production_companies = "";
				movies[4494].production_companies = ""; movies[4499].production_companies = ""; movies[4501].production_companies = "";
				movies[4502].production_companies = ""; movies[4504].production_companies = ""; movies[4506].production_companies = "";
				movies[4508].production_companies = ""; movies[4513].production_companies = ""; movies[4515].production_companies = "";
				movies[4517].production_companies = ""; movies[4519].production_companies = ""; movies[4520].production_companies = "";
				movies[4524].production_companies = ""; movies[4525].production_companies = ""; movies[4527].production_companies = "";
				movies[4530].production_companies = ""; movies[4531].production_companies = ""; movies[4536].production_companies = "";
				movies[4538].production_companies = ""; movies[4540].production_companies = ""; movies[4541].production_companies = "";
				movies[4544].production_companies = ""; movies[4546].production_companies = ""; movies[4547].production_companies = "";
				movies[4550].production_companies = ""; movies[4553].production_companies = ""; movies[4556].production_companies = "";
				movies[4561].production_companies = ""; movies[4562].production_companies = ""; movies[4564].production_companies = "";
				movies[4566].production_companies = ""; movies[4569].production_companies = ""; movies[4571].production_companies = "";
				movies[4574].production_companies = ""; movies[4580].production_companies = ""; movies[4581].production_companies = "";
				movies[4582].production_companies = ""; movies[4583].production_companies = ""; movies[4589].production_companies = "";
				movies[4593].production_companies = ""; movies[4611].production_companies = ""; movies[4620].production_companies = "";
				movies[4624].production_companies = ""; movies[4625].production_companies = ""; movies[4628].production_companies = "";
				movies[4629].production_companies = ""; movies[4632].production_companies = ""; movies[4633].production_companies = "";
				movies[4634].production_companies = ""; movies[4635].production_companies = ""; movies[4636].production_companies = "";
				movies[4637].production_companies = ""; movies[4640].production_companies = ""; movies[4644].production_companies = "";
				movies[4646].production_companies = ""; movies[4651].production_companies = ""; movies[4653].production_companies = "";
				movies[4657].production_companies = ""; movies[4658].production_companies = ""; movies[4660].production_companies = "";
				movies[4667].production_companies = ""; movies[4668].production_companies = ""; movies[4674].production_companies = "";
				movies[4676].production_companies = ""; movies[4679].production_companies = ""; movies[4680].production_companies = "";
				movies[4689].production_companies = ""; movies[4690].production_companies = ""; movies[4691].production_companies = "";
				movies[4693].production_companies = ""; movies[4694].production_companies = ""; movies[4698].production_companies = "";
				movies[4699].production_companies = ""; movies[4702].production_companies = ""; movies[4705].production_companies = "";
				movies[4706].production_companies = ""; movies[4710].production_companies = ""; movies[4712].production_companies = "";
				movies[4714].production_companies = ""; movies[4716].production_companies = ""; movies[4721].production_companies = "";
				movies[4725].production_companies = ""; movies[4727].production_companies = ""; movies[4729].production_companies = "";
				movies[4737].production_companies = ""; movies[4739].production_companies = ""; movies[4746].production_companies = "";
				movies[4747].production_companies = ""; movies[4753].production_companies = ""; movies[4754].production_companies = "";
				movies[4755].production_companies = ""; movies[4757].production_companies = ""; movies[4760].production_companies = "";
				movies[4762].production_companies = ""; movies[4763].production_companies = ""; movies[4764].production_companies = "";
				movies[4765].production_companies = ""; movies[4768].production_companies = ""; movies[4769].production_companies = "";
				movies[4770].production_companies = ""; movies[4771].production_companies = ""; movies[4772].production_companies = "";
				movies[4775].production_companies = ""; movies[4777].production_companies = ""; movies[4779].production_companies = "";
				movies[4780].production_companies = ""; movies[4781].production_companies = ""; movies[4782].production_companies = "";
				movies[4784].production_companies = ""; movies[4785].production_companies = ""; movies[4786].production_companies = "";
				movies[4789].production_companies = ""; movies[4797].production_companies = ""; movies[4799].production_companies = "";
				movies[4801].production_companies = ""; 
		});
		
		//Getting and treating original data from cast and crew from https://www.kaggle.com/tmdb/tmdb-movie-metadata
		d3.csv("tmdb_5000_credits.csv", function(error, dataset) {
			if (error) throw error;
				
			var i;
			for(i = 0; i < movies.length; i++){
				resultado = [];
				var indice = 0;
				
					aux = dataset[i].cast.substr(1, dataset[i].cast.length-2);
					
					aux = aux.split("}, {");
					
					var n;
					result = [];
					//Treating cast information
					for(n = 0; n < aux.length; n++){
						splitted = aux[n].split(", \"");
						
						if(splitted != ""){
							result.push({cast_id: splitted[0].substr(splitted[0].indexOf(":")+1, splitted[0].length).trim(), 
									character: splitted[1].substr(splitted[1].indexOf(":")+3, splitted[1].length-14).trim(), 
									credit_id: splitted[2].substr(splitted[2].indexOf(":")+1, splitted[2].length).trim(), 
									gender: splitted[3].substr(splitted[3].indexOf(":")+1, splitted[3].length).trim(), 
									id: splitted[4].substr(splitted[4].indexOf(":")+1, splitted[4].length).trim(), 
									name: splitted[5].substr(splitted[5].indexOf(":")+2, splitted[5].length).trim(), 
									order: splitted[6].substr(splitted[6].indexOf(":")+1, splitted[6].length).trim()
									});
						}else{
							result.push({});
						}
					}
					
					
				
				//Getting director from crew data
				director = dataset[i].crew.slice(dataset[i].crew.indexOf("\"Director\", \"name\": \""), dataset[0].crew.length-2);
				director = director.slice(director.indexOf("\"name\": \"") +9, director.indexOf("\"}, {\"credit_id\""));
				
				var j;
				var genre = movies[i].genres.slice(movies[i].genres.indexOf("\"name\": \""), movies[i].genres.length);
				genres = [];
				//Treating genre information
				for(j = 0; j < movies[i].genres.match(/"name\": "/g).length; j++){
					genre = genre.slice(genre.indexOf("\"name\": \"") +9, movies[i].genres.length);
					genres.push(genre.slice(0, genre.indexOf("\"}")));
					
				}
				
				//Treating companies information
				if(movies[i].production_companies == ""){
					companies.push("Not Registered");
					
				}else{
					
					var company = movies[i].production_companies.slice(movies[i].production_companies.indexOf("\"name\": \""), movies[i].production_companies.length);
					
					var companies = [];
					for(j = 0; j < movies[i].production_companies.match(/"name\": "/g).length; j++){
						
						companies.push(company.slice(company.indexOf("\"name\": \"") +9, company.indexOf("\", \"id\"")));
						company = company.slice(company.indexOf("\", \"id\"") +7, company.length);
						
					}
				}
				
				//Appending all information together
				if(dataset[i].movie_id == movies[i].id){
						data.push({movie_id: dataset[i].movie_id, title: dataset[i].title.replace(/,/g, ""), cast: result, director: director, 
						budget: movies[i].budget, genres: genres, popularity: movies[i].popularity, runtime: movies[i].runtime,
						revenue: movies[i].revenue, vote_average: movies[i].vote_average, vote_count: movies[i].vote_count,
						release_date: movies[i].release_date.split("-")[0], production_companies: companies});
					
					movies[i].title = movies[i].title.replace(/,/g, "");
				}
			}
		});
	}

graphy = {"nodes": [],"links": []};

//Functions to make the simulation happens
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Creating color legends of node colors
var ext_color_domain = [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var legend_labels = ["Not Registered", "< Budget", "> Budget+", "> 2*Budget+", "> 4*Budget+", "> 6*Budget+", 
					"> 8*Budget+", "> 10*Budget+", "> 15*Budget+", "> 20*Budget+", "> 25*Budget+"]
  
var legend = svg.selectAll("g.legend")
  .data(ext_color_domain)
  .enter().append("g")
  .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

  svg.append("text")
  .attr("x", width + 30)
  .attr("y", function(d, i){ return 10;})
  .text("Revenue");
  
  legend.append("rect")
  .attr("x", width + 5)
  .attr("y", function(d, i){ return 260 - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", width + 30)
  .attr("y", function(d, i){ return 260 - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });
  
svg.append("text")
  .attr("x", width + 5)
  .attr("y", height - 45)
  .text("Links represent the ");
  
  svg.append("text")
  .attr("x", width + 5)
  .attr("y", height - 30)
  .text("degree of similarity ");
  
  svg.append("text")
  .attr("x", width + 5)
  .attr("y", height -15)
  .text("between casts.");
  
//Creating the genre Selection Menu

	var colorLabel = "#756bb1";
	var yScale = d3.scaleLinear().range([height-(margin.top+margin.bottom), 0]);

	var yAxis = d3.axisLeft().scale(yScale); 
	
	var issue = d3.select("svg")
		.append("g").attr("transform", "translate(" + (-(width + 10)) + "," + (margin.top ) + " )")
		.selectAll(".issue")
      .data(categories) // Select nested data and append to new svg group elements
    .enter().append("g")
      .attr("class", "issue"); 
	  
	 issue.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") // Stop line interferring with cursor
      .attr("id", function(d) {
        return "line-" + d.name;
      })
      
      .style("stroke", function(d) { return colorLabel; });

  var legendSpace = 450 / categories.length; // 450/number of issues    

  issue.append("rect")
      .attr("width", 10)
      .attr("height", 10)                                    
      .attr("x", width + (margin.right/3) - 15) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 18; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? colorLabel : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
      })
      .attr("class", "legend-box")
      .on("click", function(d){ // On click make d.visible
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
		click(minDate, maxDate);
      })
		//Makes the 
      .on("mouseover", function(d){
        d3.select(this)
          .transition()
          .attr("fill", function(d) { return "#cccbb1"; }); 
      })
      .on("mouseout", function(d){
        d3.select(this)
          .transition()
          .attr("fill", function(d) {
          return d.visible ? colorLabel : "#F1F1F2";});

      })
	// Setting the labels of the genre menu
  var labels = d3.select("svg")
		.append("g").attr("transform", "translate(" + 590 + "," + (margin.top ) + " )")
		.selectAll(".labels")
      .data(categories) // Select nested data and append to new svg group elements
    .enter().append("g")
      .attr("class", "labels")
	.append("text")
      .attr("x", (-width) + (margin.right/3)) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 10; })  // (return (11.25/2 =) 5.625) + i * (5.625) 
      .text(function(d) { return d.name; }); 

	  //Creating Brush Selection to get a period of years
	 var x = d3.scaleLinear()
        .domain([1950,2017])
        .range([0, width]);
		
	  var brush = d3.brushX()
        .extent([[0,0], [width,20]])
        .on("brush", brushed);

    var timeLine = svg
      .append("g")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(d3.axisBottom()
            .scale(x)
            .ticks(5));

    var brushg = timeLine.append("g")
        .attr("class", "brush")
        .call(brush)
    
	function brushed() {
	
      var range = d3.brushSelection(this)
          .map(x.invert);
      minDate = Math.round(range[0]);
	  maxDate = Math.round(range[1]);
	  
	  click(minDate, maxDate);
	  
    }
	brush.move(brushg, [2000, 2010].map(x));
	
	//Creating Bar Chart 
	var height2 = 300;
	var bar = svg2.selectAll(".bar");
	  
	var xScale = d3.scaleBand()
			  .range([0, width])
			  .padding(0.1)
			  .domain(allCategories.map(function(d) { return d; }));

	var xAxisBar = svg2.append("g").attr("transform", "translate("+ 80 +"," + (height2-20) + ")")
      .call(d3.axisBottom(xScale)).selectAll("text").attr("transform", " rotate(45)")
		.attr("y", 5)
		.attr("x", 5)
		.attr("dy", ".35em")
		.style("text-anchor", "start");
		
	var filteredData = [], verify = 0;
	//Function that updates Bar Chart graph and yAxis
function updateBarChart(){
	
	const WIDTH = 400;
	const HEIGHT = 200;
	const INNER_HEIGHT = HEIGHT - 20;
	const BAR_WIDTH = 24;
	const BAR_GAP = 2;
	
	xScale = d3.scaleBand()
			  .range([0, width])
			  .padding(0.1)
			  .domain(allCategories.map(function(d) { return d; }));
			
    var y = d3.scaleLinear().range([300, 0]).domain([0, d3.max(quantityPerGenre, function(d) { return d; })]);
    var yAxisCall = d3.axisLeft().scale(y) ;
     
	
  //append the rectangles to the bar chart
  bar = svg2.selectAll(".bar")
    .data(quantityPerGenre, d => d);
	
	//Makes old bars to desapear
  bar.exit().transition().style('opacity', 0).remove();
	 
	 //Making old bars to desapear
	  bar = bar.select("rect")
    .call(function(d){bar.transition().attr("height", function(d) { return height - y(d); })})
	  .merge(bar);  										
   
  //Creating new bars and appending them
  bar.data(quantityPerGenre, d => d)
        .enter().append("rect").attr("transform", "translate("+ 80 +"," + (-20) + ")")
		 
		 //Showing tooltip with quantity information
		 .on("mouseover", function(d) {
		  tooltip
              .style("left", d3.event.pageX + (-110) + "px")
              .style("top", d3.event.pageY + (-41) + "px")
              .style("display", "inline-block")
              .html((d));
       })
		.on("mouseout", function(d){ tooltip.style("display", "none");})
		.attr("fill", "#756bb1")
		.on("click", function(d, i){
			  if(d3.select(this).attr("fill") == "#756bb1"){
				d3.select(this).attr("fill", "#cccbb1");
				verify = verify + 1;
				
				 if(verify > 0){
					filterGraph(i);
				 }else{
					updateGraph(graphy)
				 }
			  }else{
				  d3.select(this).attr("fill", "#756bb1");
				  verify = verify -1;
				 
				 if(verify > 0){
					filterGraph(i);
				 }else{
					updateGraph(graphy)
				 }
			  }
			  
		  })
          .attr("class", "bar")
		  .attr('y', height2) //Inicialize the y to show effect of growing bars after merging them
		  .attr("x", 
			  function(d,i) {
				if(i == 0){return xScale("Action");}else 		if(i == 1){return xScale("Adventure");}else
				if(i == 2){return xScale("Animation");}else 	if(i == 3){return xScale("Comedy");}else
				if(i == 4){return xScale("Crime");}else 		if(i == 5){return xScale("Documentary");}else
				if(i == 6){return xScale("Drama");}else 		if(i == 7){return xScale("Family");}else
				if(i == 8){return xScale("Fantasy");}else 	if(i == 9){return xScale("Foreign");}else
				if(i == 10){return xScale("History");}else 	if(i == 11){return xScale("Horror");}else
				if(i == 12){return xScale("Music");}else 		if(i == 13){return xScale("Mystery");}else
				if(i == 14){return xScale("Romance");}else 	if(i == 15){return xScale("Science Fiction");}else
				if(i == 16){return xScale("TV Movie");}else 	if(i == 17){return xScale("Thriller");}else
				if(i == 18){return xScale("War");}else 		if(i == 19){return xScale("Western");} })
		  .merge(bar)
		  .transition()
          .attr("width", xScale.bandwidth())
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return 300 - y(d); }) //<- Shows message error, but still works. Stops if replaced by the constant 300, ps: height2 = 300
		  ;
  //Updating yAxis range
	var yAxisBar	= svg2.selectAll(".y")
            .data(["dummy"]);
            
        var newY = yAxisBar.enter().append("g").attr("transform", "translate("+ 80 +"," + (-20) + ")")
            .attr("class", "y axis");

        yAxisBar.merge(newY).transition().call(yAxisCall);		
}
	function filterGraph(i){
		filteredData = [];
		var aux, k = 0, l = 0, aux = 0;
		 d3.selectAll(".bar").each(function(d,i){
			 for(j = 0; j < auxGraph.length; j++){
				if (d3.select(this).attr("fill") == "#cccbb1"){
					if(i == 0){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Action"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
						
					}else if(i == 1){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Adventure"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 2){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Animation"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 3){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Comedy"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 4){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Crime"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 5){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Documentary"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 6){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Drama"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 7){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Family"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 8){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Fantasy"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 9){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Foreign"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 10){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "History"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 11){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Horror"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 12){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Music"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 13){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Mystery"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 14){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Romance"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 15){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Science Fiction"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 16){
						for(k = 0; k< auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "TV Movie"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 17){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Thriller"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 18){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "War"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}else if(i == 19){
						for(k = 0; k < auxGraph[j].genres.length; k++){
							if(auxGraph[j].genres[k] == "Western"){
								aux = 0;
								for(l = 0; l < filteredData.length; l++){
								
									if(filteredData[l] == auxGraph[j]){aux = 1; break;}else{}
									
								}
								if(aux == 0){
									filteredData.push(auxGraph[j]);
								}
							}
						}
					}
				}
			 }
		 });
		 var g = convertToGraph(createNodesAndLinks(filteredData, auxNodes, auxLinks, auxGraph));
	updateGraph(g);
	}
