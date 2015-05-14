/******************************************
 String manipulations
 ******************************************/
String.format = function ()
{
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++)
	{
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}

	return s;
};

function tryParseInt(value)
{
	var result = parseInt(value);
	return isNaN(result) ? 0 : result;
}

if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) == str;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str){
		return this.slice(-str.length) == str;
	};
}

/******************************************
 Array manipulations
 ******************************************/
Array.prototype.RemoveValue = function (itemName, value)
{
	var index = -1;
	for (var i = 0; i < this.length; i++)
	{
		if (this[i][itemName] == value)
		{
			index = i;
			break;
		}
	}

	if (index >= 0)
	{
		this.splice(index, 1);
	}
};

Array.prototype.GetItemByValue = function (itemName, value)
{
	var index = -1;
	for (var i = 0; i < this.length; i++)
	{
		if (this[i][itemName] == value)
		{
			index = i;
			break;
		}
	}

	return index >= 0 ? this[i] : null;
};

Array.prototype.RemoveItem = function(itemToRemove)
{
	var index = this.indexOf(itemToRemove);

	this.splice(index, 1);
};

Array.prototype.RemoveItems = function(itemsToRemove)
{
	var indices = [];

	for(var i = 0; i < itemsToRemove.length; i++)
	{
		var item = itemsToRemove[i];
		var index = this.indexOf(item);

		while(index > -1)
		{
			indices.push(index);
			index = this.indexOf(item, index + 1);
		}
	}

	indices.sort();

	for(var i = 0; i < indices.length; i++)
	{
		var index = indices[i] - i;
		this.splice(index, 1);
	}
};

Array.prototype.Contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

/*******************************
 Namespacing
 *******************************/
function namespace(namespaceString) {
	var parts = namespaceString.split('.'),
		parent = window,
		currentPart = '';

	for(var i = 0, length = parts.length; i < length; i++) {
		currentPart = parts[i];
		parent[currentPart] = parent[currentPart] || {};
		parent = parent[currentPart];
	}

	return parent;
}

//LOAD CSS FROM CODE
var loadedCSS = [];
function LoadCss(url)
{
	if(url instanceof Array)
	{
		var raf = requestAnimationFrame || mozRequestAnimationFrame ||
			webkitRequestAnimationFrame || msRequestAnimationFrame;
		if (raf) raf(function()
		{
			for(var i = 0; i < url.length; i++)
			{
				if(!loadedCSS.Contains(url[i].toLowerCase()))
				{
					var link = document.createElement("link");
					link.type = "text/css";
					link.rel = "stylesheet";
					link.href = String.format("{0}", url[i]);

					document.getElementsByTagName("head")[0].appendChild(link);
					loadedCSS.push(url[i].toLowerCase());
				}
			}
		});
		else window.addEventListener('load', function()
		{
			for(var i = 0; i < url.length; i++)
			{
				if(!loadedCSS.Contains(url[i].toLowerCase()))
				{
					var link = document.createElement("link");
					link.type = "text/css";
					link.rel = "stylesheet";
					link.href = String.format("{0}", url[i]);

					document.getElementsByTagName("head")[0].appendChild(link);
					loadedCSS.push(url[i].toLowerCase());
				}
			}
		});
	}
	else
	{
		if(!loadedCSS.Contains(url.toLowerCase()))
		{
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = String.format("{0}", url);

			var raf = requestAnimationFrame || mozRequestAnimationFrame ||
				webkitRequestAnimationFrame || msRequestAnimationFrame;
			if (raf) raf(function()
			{
				document.getElementsByTagName("head")[0].appendChild(link);
				loadedCSS.push(url.toLowerCase());
			});
			else window.addEventListener('load', function()
			{
				document.getElementsByTagName("head")[0].appendChild(link);
				loadedCSS.push(url.toLowerCase());
			});
		}
	}
}