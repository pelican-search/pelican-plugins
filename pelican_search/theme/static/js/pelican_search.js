
var pelican_search_config =
{
	'summeryLength' : 300,
	'headlineTag': 'h2',
	'urlClass' : ''
}

function getURLP(name)
{
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
}

function escapeRegExp(str) {
	// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function pelican_search(query)
{
	
	$('#pelican_search_content').html('<img style="margin-left: auto; margin-right: auto; display:block;" src="theme/img/loading.gif">');

	if(query == null)
	{
		$('#pelican_search_content').html('<p>Invalid input.</p>');
		return
	}
	
	var queries = query.split(' ');
	var patterns = []
	for (var q = 0; q < queries.length; q++)
	{
		var regex = new RegExp(escapeRegExp(queries[q]), 'i')
		//console.log(regex)
		patterns.push(regex)
	}
	
	var results = []
	for (var i = 0 ; i < pelican_search_data.length; i++)
	{
		var entry = pelican_search_data[i]
		entry['score'] = 0
		for (var p = 0; p < patterns.length; p++)
		{
			var pattern = patterns[p]
			//console.log('Current pattern: '+pattern)
			if (entry['title'].search(pattern) != -1)
			{
				entry['score'] += 20
			}
			if (entry['category'] !== undefined && entry['category'].search(pattern) != -1)
			{
				entry['score'] += 10
			}
			if (entry['tags'] !== undefined)
			{
				for(var t = 0; t < entry['tags'].length; t++)
				{
					if (entry['tags'][t].search(pattern) != -1)
					{
						entry['score'] += 5
					}
				}
			}
			if (entry['content'].search(pattern) != -1)
			{
				entry['score'] += 1
			}
		}
		if (entry['score'] > 0)
		{
			results.push(entry)
		}
	}
	
	results.sort(
		function(a, b)
		{
			return b['score'] - a['score']
		}
	);
	
	var search_result_html = ''
	var search_result_html_resultNumber = results.length + ' result'
	
	if (results.length != 1)
	{
		search_result_html_resultNumber += 's'
	}
	
	for (var i = 0; i < results.length; i++)
	{
		var entry = results[i];
		var tag = pelican_search_config['headlineTag']
		search_result_html += '<'+tag+'><a href="' + entry['url'] + '">' +  entry['title'] + '</a></'+tag+'>';
		search_result_html += '<p>' + entry['content'].substring(0, pelican_search_config['summeryLength']) + ' ...</p>';
		/*search_result_html += 
		'<p class="text-muted" >Score: ' + entry['score'] + '</br>'
		+ 'Category: ' + entry['category'] + '</br>'
		+ 'Tags: ' + entry['tags']
		+ '</p>';*/
		
		var urlclass = ''
		if (pelican_search_config['urlClass'])
		{
			urlclass = 'class="'+ pelican_search_config['urlClass'] + '"'
		}
		search_result_html += '<p><a ' + urlclass + ' href="' + entry['url'] + '">' + entry['url'] + '</a></p>';
	}
	
	$('#pelican_search_resultNumber').text(search_result_html_resultNumber);
	$('#pelican_search_content').html(search_result_html);
	$('#pelican_search_content').slideDown(200);
}
