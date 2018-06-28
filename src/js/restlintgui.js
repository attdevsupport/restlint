 var loadedFiles = [],
     xlsdata = [],
     readers = [];

/**
* @description handle drag enter for files drop
*/
function dragenter(e) {
    // event.stopPropagation();
    $('droparea').addClass('darea-dragover');
    // event.preventDefault();

    return;
}

/**
* @description handle drag enter for files drop
*/
function dragleave(e) {
    // event.stopPropagation();
    $('droparea').removeClass("darea-dragover");
    // event.preventDefault();

    return;
}

/**
* @description handle drop over for files drop
*/
function dragover(e) {
    // event.stopPropagation();
    // ev.dataTransfer.dropEffect = "copy";

    // e = e.originalEvent;
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    return;
}

function output(text)
{
  var txt = $('#droparea').html();
  txt += text;
  $('#droparea').html(txt);
  return;
}

/**
* @description handle drop for files drop
*/
function drop(e) {
    // event.stopPropagation();
    // e = e.originalEvent;
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    document.getElementById('droparea').textContent = '';
    var count = files.length;
    // output("File Count: " + count + "\n");

    output('<ol>');
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        // console.log('YYYYYYY ' + f);
        output('<li>' + files[i].name);

        var reader = new FileReader();

        readers.push(reader);

        reader.onerror = function(e) {
            if(e.target.error.code === e.target.error.ABORT_ERR) {
                return;
            }
        };

        reader.onprogress = function(e) {
        };

        reader.onload = function(e) {
            f.content = e.target.result;
            // console.log('XXXXXXXXXXXXXXXXXX ' + f.content);
            loadedFiles.push(f);
            // progressBar.removeClass("active");
        };

        reader.readAsText(f); 
    }
    output('</ol>');

    // $('#results').collapse('show');
    return;
}


function addRow(cat, num, item, level, msg) {
    var lvl = level;
    if (level === 'error') {
        lvl = 'danger';
    }
    row = $("<tr class='table-" + lvl + "'></tr>");
    cells = `<td>${num}</td><td>${item}</td><td>${msg}</td>`;
    // cells = `<td>${num}</td><td>${item}</td><td>${level}</td><td>${msg}</td>`;
    row.append(cells);
    $("#" + cat + "-table-body").append(row);
    xlsdata[cat].push([num, item, level, msg]);
    return;
};

function addSummaryRow(cat, infos, warnings, errors) {
    var total = infos + warnings + errors;
    if (cat === 'total') {
        row = `<tr><th>${capitalize(cat)}</th><th class='table-info'>${infos}</th><th class='table-warning'>${warnings}</th><th class='table-danger'>${errors}</th><th>${total}</th></tr>`;
        $("#summary-table-footer").append(row);
    } else {
        row = `<tr><td>${capitalize(cat)}</td><td class='table-info'>${infos}</td><td class='table-warning'>${warnings}</td><td class='table-danger'>${errors}</td><td>${total}</td><tr>`;
        $("#summary-table-body").append(row);
    }
    xlsdata['summary'].push([capitalize(cat), infos, warnings, errors, total]);
    return;
};

function readFiles() {
    for (var file of loadedFiles) {
        console.log('FILE NAME: ' + file.name);
        console.log(file.content);
        var jsdata = JSON.parse(file.content);

        loadJson(file.content);
        checkDefinitions();
        checkGeneral();
        checkPathStructure('paths', getData('paths'));
        checkResources(getData('paths'));
        checkBasePath();
        checkStatusCodes(getData('statuscodes'));
        // checkMethods(getData('statuscodes'));
        checkMethods(getData('httpmethods'));
        $('#export-btn').removeClass('disabled');
        $('#clear-btn').removeClass('disabled');

        // var xlsdata = {};
        xlsdata['summary'] = [];
        xlsdata['summary'].push(['Category', '# of Infos', '# of Warnings', '# on Errors', 'Total']);
        var wt = 0, et = 0, it = 0;
        var cats = getCategories();
        // var index = cats.indexOf('summary');
        // cats.splice(index, 1);
        cats.forEach(function(cat, idx) {
            if (cat.title === 'summary') {return;}
            console.log('CAT: ' + cat.title);
            xlsdata[cat.title] = [];
            // xlsdata[cat.title].push(['#', 'Issue', 'Level', 'Message']);
            xlsdata[cat.title].push(cat.columns);
            var w = 0, e = 0, i = 0, cnt = 1;
            getErrors(cat.title).forEach(function(key) {
                addRow(cat.title, cnt, key.name, key.level, key.msg);
                // xlsdata[cat].push([cnt, key.name, key.level, key.msg]);
                cnt += 1;
                if (key.level === 'warning') {
                    w++;
                } else if (key.level === 'error') {
                    e++;
                } else if (key.level === 'info') {
                    i++;
                }
            });
            $('#' + cat.title + '-issues').html(`Total ${capitalize(cat.title)} issues: ${w+e+i}; error: ${e}; warning: ${w}; info: ${i}`);
            addSummaryRow(cat.title, i, w, e);
            // xlsdata['summary'].push([cat, i, w, e, i+w+e]);
            it += i;
            wt += w;
            et += e;
        });

        addSummaryRow('total', it, wt, et);
        // xlsdata['summary'].push(['total', it, wt, et, it+wt+et]);
    }

    return;
};


function clearTables() {
    getCategories().forEach(function(k) {
        $("#"+k.title+"-table-body").children("tr").remove();
        $("#"+k.title+"-issues").html('');
        if (typeof xlsdata[k.title] !== 'undefined') {
            xlsdata[k.title].length = 0;
        }
    });
    $("#summary-table-footer").children("tr").remove();
    $("#output").html('');
    
    // getCategories().forEach(function(key) {
    //     xlsdata[k.title].length = 0;
    // });

    $('#export_btn').addClass('disabled');
    $('#clear_btn').addClass('disabled');

    return;
}

$(document).ready(function(){


    // This just initializes the tooptips
    $('[data-toggle="tooltip"]').tooltip();


    // $('.nav-tabs a[href="#parameters"]').tab('show');
    // $('.nav-tabs a[href="#summary"]').tab('show');
    $("#analyze-btn").click(function () {
        readFiles();
        $('#results').collapse('show');
    });

    $("#clear-btn").click(function() {
        clearTables();
        clearData();
    });
    $("#export-btn").click(function() {

        if (Object.keys(xlsdata).length === 0) {
            return;
        }
        var wb = XLSX.utils.book_new();
        getCategories().forEach(function(key, idx) {
            // var tbl = document.getElementById(key + '-table');
            // var ws = XLSX.utils.table_to_sheet(tbl);
            var ws = XLSX.utils.aoa_to_sheet(xlsdata[key.title]);
            var ws_name = capitalize(key.title);

            // /* make worksheet */
            // var ws_data = [
            //   [ "S", "h", "e", "e", "t", "J", "S" ],
            //   [  1 ,  2 ,  3 ,  4 ,  5 ]
            // ];
            // var ws = XLSX.utils.aoa_to_sheet(ws_data);

            /* Add the worksheet to the workbook */
            XLSX.utils.book_append_sheet(wb, ws, ws_name);
        });

        XLSX.writeFile(wb, 'out.xlsb');
        delete wb;
    });
});

$('.bfd-dropfield-inner').on('click', function() {
	console.log('CLOCKED:');
	$('#file-upload').trigger('click');
});