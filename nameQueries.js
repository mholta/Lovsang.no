function addNameLinks(textId) {
  var elem = document.getElementById(textId);
  if (elem != null) {
  	var personsLst = elem.innerHTML.match(/([\wæøåÆØÅäéáëö]+(\s|\.\s|\-|))+((\(.*?\))|)/g) || []; 
  	elem.appendChild(addLinksToString(personsLst));
  	elem.removeChild(elem.childNodes[0]);
  };
};

function addLinksToString(lst) {
  var p = document.createElement('p');
  var len = lst.length;
  lst.forEach( function(item, i) {
    var name = item.replace(/ *\(.*\)/g, "");
    var role = item.match(/ *\(.*\)/g);
    p.appendChild(generateDeepLink(name));
    if (role != null) p.innerHTML += role;
    if (i < len - 2) p.innerHTML += ", ";
    else if (i < len - 1) p.innerHTML += " & ";
  });
  return p;
};

function generateDeepLink(str) {
  var a = document.createElement('a');
  var link = document.createTextNode(str);
  a.appendChild(link);
  var query = str.replace(/\s/g, "+");
  var badKeyWords = ["Anne", "Ned"];
  for (const word of badKeyWords) {
    query = query.replace(word, "");
  };
  a.href = "/search?query=" + query;
  console.log(query);
  return a;
};
