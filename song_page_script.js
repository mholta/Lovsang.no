// State
var mode = 0;           // query
var transpose = 0;      // query
var onlyChords = false
var twoCol = false
getQuery()


// Required variables (deafult)
var transp_btn_up_id = "transpose-up"
var transp_btn_down_id = "transpose-down"
var transp_btn_reset_id = "transpose-reset"
var print_btn_id = "print"
var gen_PDF_id = "generatePDF"

var info_col_id = "info-column"
var sheet_col_id = "chords-column"
var info_switch_wrapper_id = "show-hide-info-switch-wrapper"
var info_switch_id = "show-hide-info-switch-wrapper"
var columns_switch_wrap_id = "columns-switch-wrapper"
var columns_switch_wrapper_id = "col-wrap"
var columns_switch_id = "columns-switch"

var chords_btn_id = "chords"
var lyrics_btn_id = "lyrics"
var nashville_btn_id = "nashville"
var chords_btn_id = "chords"
var cp_target_id = "cp-target"
var print_target_id = "print-target"
var print_content_id = "print-content" // brukes denne?
var transpose_wrap_id = "transpose-wrap"
var text_grow_id = "text-grow"
var text_shrink_id = "text-shrink"
var active_class = "cp-active"
var pdf_name = "Akkorder fra Lovsang.no"

var infoColumn = document.getElementById(info_col_id);
var chordsColumn = document.getElementById(sheet_col_id);

const infoSwitchWrap = document.getElementById(info_switch_wrapper_id);
const infoSwitch = document.getElementById(info_switch_id);
const columnsSwitchWrap = document.getElementById(columns_switch_wrap_id);
const colWrap = document.getElementById(columns_btn_wrapper_id)
const columnsSwitch = document.getElementById(columns_switch_wrap_id);

const c = document.getElementById(chords_btn_id)
const l = document.getElementById(lyrics_btn_id)
const n = document.getElementById(nashville_btn_id)
const cpTarg = document.getElementById(cp_target_id)
const printTarget = document.getElementById(print_target_id)
const printContent = document.getElementById(print_content_id) 
const transposeWrap = document.getElementById(transpose_wrap_id)
const textGrow = document.getElementById(text_grow_id)
const textShrink = document.getElementById(text_shrink_id)
  
function getQuery() {
	if (window.location.href.indexOf('?') != -1) {
  console.log('getQuery')
    var queryParams = new URLSearchParams(window.location.search)
    for (const [key, value] of queryParams) {
      if (key == 't' && value != "") transpose = parseInt(value)
      else if (key == 'm' && value != "") mode = parseInt(value)
      else queryParams.delete(key)
    console.log('ToVar', mode, transpose)
    window.history.pushState(null, null, "/"+window.location.href.substring(window.location.href.indexOf('/') + 1).split("?")[0]);
    }
  }
}

parseSheets();
console.log('values on load', 'm='+mode,'t='+transpose)

c.addEventListener("click", function() {
  mode = 0
  parseSheets()
})
l.addEventListener("click", function() {
  mode = 1
  parseSheets()
})
n.addEventListener("click", function() {
  mode = 2
  parseSheets()
})

function styleChanges(print_mode = false) {
try {
  var meta = document.querySelectorAll(".cp-meta-block")
  var keyText = document.querySelectorAll(".cp-key")
  
  if (mode == 0 || print_mode == true) {
    var p = document.querySelector("." + active_class)
    if (p) p.classList.remove(active_class)
    c.classList.add(active_class)
    meta.forEach( function(e) {e.style.display = "block"})
    keyText.forEach( function(e) {e.style.display = "block"})
    transposeWrap.classList.remove("hide")
  }	
  
  else if (mode == 1) {
    var p = document.querySelector(active_class)
    if (p) p.classList.remove(active_class)
    l.classList.add(active_class)
    meta.forEach(function(e){e.style.display = "none"})
    transposeWrap.classList.add("hide")
  } 
  
  else if (mode == 2) {
    var p = document.querySelector(active_class)
    if (p) p.classList.remove(active_class)
    n.classList.add(active_class)
    meta.forEach(function(e){e.style.display = "block"})
    keyText.forEach(function(e){e.style.display = "none"})
    transposeWrap.classList.add("hide")
  }
} catch (error) {
cpTarg.innerHTML = "Feil oppsto. Prøv en annen nettleser eller ta kontakt med oss.";
}
}

function parseSheets(){
  console.log('parse', mode, transpose)
cpTarg.innerHTML = parseChordPro(text,key,mode,transpose);
printTarget.innerHTML = parseChordPro(text,key,mode,transpose);
styleChanges()
}


document.getElementById(transp_btn_up_id).addEventListener("click", function(){transpose+=1; parseSheets();});
document.getElementById(transp_btn_down_id).addEventListener("click", function(){transpose-=1; parseSheets();});
document.getElementById(transp_btn_reset_id).addEventListener("click", function(){transpose=0; parseSheets();});

document.getElementById(print_btn_id).addEventListener("click", function() {
printOutSheet()
})
document.getElementById(gen_PDF_id).addEventListener("click", function() {
generatePDF()
})
function printOutSheet() {
styleChanges(true)
window.print()
}

var currentKey = function() {
const orig = key;
var transp = transpose;
const all_keys = ["A", "Bb", "B", "Cb", "C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab"];
const sep_keys = [["A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab"],["A", "Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]];
const notes = [['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'], ['A', 'Bb', 'Cb', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']];
var chordregex= /\[([^\]]*)\]/;
var inword    = /[a-z]$/;
var buffer    = [];
var chords    = [];
var last_was_lyric = false;
var is_bkey = function(k){
  const bkey = [false, true, false, true, false, false, true, false, true, false, true, false, true, false, true];
  return bkey[all_keys.indexOf(k)];
}

var transpose_chord = function(chord, trans, use_b) {
  var regex = /([A-Z][b#]?)/g;
  var modulo = function(n, m) {
      return ((n % m) + m) % m;
  }
  return chord.replace( regex, function( $1 ) {
    var index = notes[0].indexOf( $1 );
    if( index == -1 ) index = notes[1].indexOf( $1 );
    if( index != -1 ) {
      index = modulo( ( index + trans ), notes[0].length );
      return notes[use_b?1:0][index];
    }
    return '';
  });
}
return transpose_chord(orig, transp, is_bkey(orig))
}

function setQuery() {
	var queryParams = new URLSearchParams(window.location.search)
	console.log('setQuery', mode, transpose)
  if (0 < mode < 2) queryParams.set('m', mode)
  else if (queryParams.has('m')) queryParams.delete('m')
  if (transpose > 0) queryParams.set('t', transpose)
  else if (queryParams.has('t')) queryParams.delete('t')
  //test.innerHTML = queryParams;
  console.log(mode, transpose)
  history.replaceState(null, null, "?"+queryParams.toString())
}
function generatePDF() {
var loading = document.getElementById('loading')
setQuery()
var href = '//pdfcrowd.com/url_to_pdf/'
href += '?use_print_media=1'
href += '&width=210mm'
href += '&height=297mm'
href += '&pdf_name=' + pdf_name + ' (' + currentKey() + ')'
href += '&footer_text=Finn flere ressurser på Lovsang.no'
window.location.href = href
window.history.pushState(null, null, "/"+window.location.href.substring(window.location.href.indexOf('/') + 1).split("?")[0]);
}



columnsSwitchWrap.addEventListener("click", function() {
if (columnsSwitch.checked == true) { 
  cpTarg.classList.add("cp-two-columns")
  twoCol = true
} else { 
  cpTarg.classList.remove("cp-two-columns");
  twoCol = false
}
});

infoSwitchWrap.addEventListener("click", function() {
if (infoSwitch.checked == false) {
  infoColumn.classList.remove("hide");
  chordsColumn.classList.remove("chordsColGrow");
  cpTarg.classList.remove("cp-two-columns");
  colWrap.classList.add("hide");
  }
else {
  infoColumn.classList.add("hide");
  chordsColumn.classList.add("chordsColGrow");
  colWrap.classList.remove("hide");
  if (twoCol == true) cpTarg.classList.add("cp-two-columns");
  };
})

textGrow.addEventListener('click', function() {
  var style = window.getComputedStyle(cpTarg, null).getPropertyValue('font-size');
  var fontSize = parseFloat(style); 
  cpTarg.style.fontSize = (fontSize + 2) + 'px';
})

textShrink.addEventListener('click', function() {
  var style = window.getComputedStyle(cpTarg, null).getPropertyValue('font-size');
  var fontSize = parseFloat(style); 
  cpTarg.style.fontSize = (fontSize - 2) + 'px';
})
