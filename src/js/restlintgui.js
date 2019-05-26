 {
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

/**
* @description helper function to print to the drop area
* @param {string} text - text to add to the drop area
*/
function output(text)
{
  // var txt = $('#droparea').html();
  // txt += text;
  // $('#droparea').html(txt);
  $('#droparea').append(txt);
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
    
    var count = files.length;
    // output("File Count: " + count + "\n");

    // output('<ol>');
    $('#droparea-title').addClass('d-none');
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        // console.log('YYYYYYY ' + f);
        // output('<li>' + files[i].name);
        $('#droparea-filelist').append('<li>' + files[i].name);

        genReader(f);
    }
    // output('</ol>');

    // $('#results').collapse('show');
    return;
}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function genReader(f) {
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


/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function addRow(cat, num, item, level, msg) {
    var lvl = level, row = '', cells = '';
    if (level === 'error') {
        lvl = 'danger';
    }
    row = $("<tr class='table-" + lvl + "'></tr>");
    cells = `<td>${num}</td><td>${item}</td><td>${msg}</td>`;
    // cells = `<td>${num}</td><td>${item}</td><td>${level}</td><td>${msg}</td>`;
    row.append(cells);
    $("#" + cat + "-table-body").append(row);
    var arr = [num, item, level, msg];
    xlsdata[cat].push(arr);
    return;
}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function addSummaryRow(cat, infos, warnings, errors) {
    var total = infos + warnings + errors, row = '';
    if (cat === 'total') {
        row = `<tr><th>${capitalize(cat)}</th><th class='table-info'>${infos}</th><th class='table-warning'>${warnings}</th><th class='table-danger'>${errors}</th><th>${total}</th></tr>`;
        $("#summary-table-footer").append(row);
    } else {
        row = `<tr><td>${capitalize(cat)}</td><td class='table-info'>${infos}</td><td class='table-warning'>${warnings}</td><td class='table-danger'>${errors}</td><td>${total}</td><tr>`;
        $("#summary-table-body").append(row);
    }
    xlsdata.summary.push([capitalize(cat), infos, warnings, errors, total]);
    return;
}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function getFiles(files) {
    var inp = $('#file-upload');

    // 'files' in input
    if (true) {

        if (files.length === 0) {
            alert('Select one or more files');
            return;
        }

        $('#droparea-title').addClass('d-none');
        // output('<ol>');
        Object.keys(files).forEach((key, idx) => {
            // loadedFiles.push(file);
            genReader(files[idx]);

            // output('<li>' + file.name);
            $('#droparea-filelist').append('<li>' + files[idx].name);

        });

        readFiles();
    }
}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function readFiles() {
    for (var file of loadedFiles) {
        // console.log('FILE NAME: ' + file.name);
        // console.log(file.content);
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
        xlsdata.summary = [];
        xlsdata.summary.push(['Category', '# of Infos', '# of Warnings', '# on Errors', 'Total']);
        var wt = 0, et = 0, it = 0;
        var cats = getCategories();

        // var index = cats.indexOf('summary');
        // cats.splice(index, 1);
        cats.forEach((cat, idx) => {
            if (cat.title === 'summary') {return;}
            // console.log('CAT: ' + cat.title);
            xlsdata[cat.title] = [];
            // xlsdata[cat.title].push(['#', 'Issue', 'Level', 'Message']);
            var cp = cat.columns.slice(0);
            console.log('CP: ' + cp);
            cp.splice(2,0,'Level');
            console.log('CP2: ' + cp);
            xlsdata[cat.title].push(cp);
            var w = 0, e = 0, i = 0, cnt = 1;
            getErrors(cat.title).forEach((key) => {
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
}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function clearTables() {
    getCategories().forEach((k) => {
        $("#"+k.title+"-table-body").children("tr").remove();
        $("#"+k.title+"-issues").html('');
        if (typeof xlsdata[k.title] !== 'undefined') {
            xlsdata[k.title].length = 0;
        }
        
    });
    xlsdata= [];
    $("#summary-table-footer").children("tr").remove();
    $('#droparea-title').removeClass('d-none');

    $('#export-btn').addClass('disabled');
    $('#clear-btn').addClass('disabled');
    $('#droparea-filelist').text('');
    $('#file-upload').val('');
    loadedFiles.length = 0;
    return;
}

/**
* @description Represents a book
* @constructor
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
$(document).ready(function(){


    // This just initializes the tooptips
    $('[data-toggle="tooltip"]').tooltip();

    $("#analyze-btn").click(function () {
        if (loadedFiles.length === 0) {
            return;
        }
        readFiles();
        $('#results').collapse('show');
        $('#summary-tab').tab('show');
    });

    $("#cancel-btn").click(function() {
        clearTables();
        clearData();
    });

    $("#clear-btn").click(function() {
        clearTables();
        clearData();
    });
    $("#export-btn").click(function() {

        console.log('KEYS: ' + Object.keys(xlsdata));
        if (Object.keys(xlsdata).length === 0) {
            return;
        }

        var colors = {
            info: 'D6DBDF',
            warning: 'F5CBA7',
            error: 'F1948A'
        };

        XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            for (var cat of getCategories()) {
                const newSheet = workbook.addSheet(capitalize(cat.title));
                // newSheet.column
                var cnt = 1;
                for (var row of xlsdata[cat.title]) {
                    // console.log('ROW ' + row);
                    // console.log('ROW UP' + row[3]);
                    // console.log(typeof row[3]);
                    const lvl = row[2];
                    if (typeof row[3] === 'string') {
                        row[3] = row[3].replace(/<em>|<\/em>|<u>|<\/u>/gi, '');
                    }
                    // var nrow = row[3];
                    // row[3] = nrow.replace(/<em>|<\/em>/gi, '');
                    newSheet.cell('A' + cnt).value([row]);
                    var clrrow = 'A'+cnt+':D'+cnt;
                    if (typeof colors[lvl] != 'undefined') {
                        newSheet.range(clrrow).style("fill", colors[lvl]);
                    }
                    cnt++;
                }
                newSheet.row(1).style("bold", true);
                // newSheet.column(1).style("bold", true);
                // workbook.sheet("cat.title").cell("A1").value("This is neat!");
            
            }

            var numrows = xlsdata.summary.length;
            workbook.sheet('Summary').range("B2:B"+numrows).style("fill", colors.info);
            workbook.sheet('Summary').range("C2:C"+numrows).style("fill", colors.warning);
            workbook.sheet('Summary').range("D2:D"+numrows).style("fill", colors.error);
            
            workbook.deleteSheet("Sheet1");
            // return workbook.toFileAsync(nm);
            workbook.outputAsync()
            .then(function (blob) {
                const nm = 'restlint-' + new Date().toISOString() + '.xlsx';
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // If IE, you must uses a different method.
                    window.navigator.msSaveOrOpenBlob(blob, nm);
                } else {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    a.download = nm;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }
            });
        });

    });
});

 }