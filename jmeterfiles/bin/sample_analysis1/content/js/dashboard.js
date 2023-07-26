/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9748317237342699, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "BeanShell Sampler"], "isController": false}, {"data": [0.9770992366412213, 500, 1500, "login-578"], "isController": false}, {"data": [1.0, 500, 1500, "login-577"], "isController": false}, {"data": [1.0, 500, 1500, "addcart-585"], "isController": false}, {"data": [1.0, 500, 1500, "select"], "isController": true}, {"data": [0.9962406015037594, 500, 1500, "launch-553"], "isController": false}, {"data": [0.9924812030075187, 500, 1500, "launch-550"], "isController": false}, {"data": [0.7518939393939394, 500, 1500, "login"], "isController": true}, {"data": [0.9774436090225563, 500, 1500, "enterstore-573"], "isController": false}, {"data": [1.0, 500, 1500, "addcart"], "isController": true}, {"data": [1.0, 500, 1500, "product-584"], "isController": false}, {"data": [0.9774436090225563, 500, 1500, "enterstore"], "isController": true}, {"data": [1.0, 500, 1500, "login-575"], "isController": false}, {"data": [1.0, 500, 1500, "returntohome"], "isController": true}, {"data": [1.0, 500, 1500, "inf-588"], "isController": false}, {"data": [1.0, 500, 1500, "inf"], "isController": true}, {"data": [1.0, 500, 1500, "product"], "isController": true}, {"data": [0.9962406015037594, 500, 1500, "launch-566"], "isController": false}, {"data": [1.0, 500, 1500, "returntohome-590"], "isController": false}, {"data": [0.9661654135338346, 500, 1500, "launch"], "isController": true}, {"data": [0.9809160305343512, 500, 1500, "proceedcheckout-586"], "isController": false}, {"data": [1.0, 500, 1500, "conform-589"], "isController": false}, {"data": [1.0, 500, 1500, "conform"], "isController": true}, {"data": [0.9809160305343512, 500, 1500, "proceedcheckout"], "isController": true}, {"data": [1.0, 500, 1500, "select-579"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1975, 0, 0.0, 167.0541772151898, 1, 1405, 179.0, 199.0, 359.1999999999998, 540.48, 16.442575864796236, 213.35617819381426, 11.249977235357782], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["BeanShell Sampler", 130, 0, 0.0, 3.4538461538461545, 1, 36, 3.0, 5.0, 6.449999999999989, 31.96999999999997, 1.1527377521613833, 0.0, 0.0], "isController": false}, {"data": ["login-578", 131, 0, 0.0, 198.27480916030535, 172, 573, 180.0, 191.8, 335.9999999999971, 572.04, 1.1459763981349453, 5.480318771159011, 0.7296646597499846], "isController": false}, {"data": ["login-577", 131, 0, 0.0, 362.40458015267177, 343, 396, 361.0, 377.0, 384.79999999999995, 395.68, 1.1441547665836935, 5.714931260644569, 1.939699877723918], "isController": false}, {"data": ["addcart-585", 131, 0, 0.0, 183.6412213740458, 173, 200, 183.0, 193.0, 194.79999999999998, 199.68, 1.1461869597172156, 5.110804110852028, 0.7398982704388759], "isController": false}, {"data": ["select", 131, 0, 0.0, 182.12213740458023, 170, 222, 181.0, 190.8, 194.39999999999998, 215.92000000000013, 1.1460064736243547, 4.152573388701776, 0.7017563943443268], "isController": true}, {"data": ["launch-553", 133, 0, 0.0, 58.172932330827045, 30, 1405, 36.0, 57.60000000000001, 148.29999999999995, 1067.3799999999965, 1.1120122404956398, 103.65180142847588, 0.9013380464954893], "isController": false}, {"data": ["launch-550", 133, 0, 0.0, 156.5338345864661, 116, 957, 129.0, 158.20000000000002, 381.1999999999998, 901.2399999999994, 1.124108320091957, 8.823497561614658, 0.6367019781770851], "isController": false}, {"data": ["login", 264, 0, 0.0, 369.5719696969697, 170, 953, 205.0, 558.0, 567.0, 933.0500000000001, 2.2784547933855763, 15.533966655482963, 3.3674499214623537], "isController": true}, {"data": ["enterstore-573", 133, 0, 0.0, 203.2255639097744, 171, 983, 180.0, 197.60000000000002, 378.7999999999993, 845.9799999999987, 1.1398892678996897, 5.464315720937109, 0.6376305810649823], "isController": false}, {"data": ["addcart", 131, 0, 0.0, 183.6412213740458, 173, 200, 183.0, 193.0, 194.79999999999998, 199.68, 1.146196988389287, 5.110848828319815, 0.7399047442493285], "isController": true}, {"data": ["product-584", 131, 0, 0.0, 181.5190839694657, 171, 216, 181.0, 190.0, 192.39999999999998, 212.48000000000008, 1.1461267913699278, 4.370949800630807, 0.7379284851878423], "isController": false}, {"data": ["enterstore", 133, 0, 0.0, 203.2255639097744, 171, 983, 180.0, 197.60000000000002, 378.7999999999993, 845.9799999999987, 1.1398892678996897, 5.464315720937109, 0.6376305810649823], "isController": true}, {"data": ["login-575", 133, 0, 0.0, 181.33834586466176, 170, 208, 181.0, 188.60000000000002, 192.0, 205.95999999999998, 1.1478678139591083, 4.480023769170687, 0.7308689596692759], "isController": false}, {"data": ["returntohome", 130, 0, 0.0, 183.16153846153856, 171, 315, 181.0, 191.0, 195.45, 293.60999999999984, 1.1495472552348613, 5.497265887516801, 0.6948923349515422], "isController": true}, {"data": ["inf-588", 131, 0, 0.0, 183.89312977099235, 174, 316, 181.0, 190.0, 196.2, 281.44000000000074, 1.1476831693577356, 4.949383667855234, 1.3716774818648538], "isController": false}, {"data": ["inf", 131, 0, 0.0, 183.89312977099235, 174, 316, 181.0, 190.0, 196.2, 281.44000000000074, 1.147673114662181, 4.949340306980655, 1.3716654647857092], "isController": true}, {"data": ["product", 131, 0, 0.0, 181.5190839694657, 171, 216, 181.0, 190.0, 192.39999999999998, 212.48000000000008, 1.1461267913699278, 4.370949800630807, 0.7379284851878423], "isController": true}, {"data": ["launch-566", 133, 0, 0.0, 48.54887218045115, 25, 885, 34.0, 49.60000000000001, 111.89999999999999, 718.7399999999983, 1.133033462822872, 48.25546024426242, 0.48131792610151297], "isController": false}, {"data": ["returntohome-590", 130, 0, 0.0, 183.16153846153856, 171, 315, 181.0, 191.0, 195.45, 293.60999999999984, 1.1495370902563469, 5.497217277431934, 0.694886190301444], "isController": false}, {"data": ["launch", 133, 0, 0.0, 263.25563909774434, 176, 3247, 203.0, 253.60000000000014, 646.2999999999998, 2687.359999999994, 1.1100539169045354, 159.45921419085, 2.0000483170789725], "isController": true}, {"data": ["proceedcheckout-586", 131, 0, 0.0, 196.46564885496178, 171, 562, 181.0, 192.0, 248.19999999999902, 560.4000000000001, 1.146277224084072, 5.9284025183098095, 0.7172863226595382], "isController": false}, {"data": ["conform-589", 130, 0, 0.0, 184.58461538461546, 174, 314, 183.0, 190.0, 195.89999999999998, 280.51999999999975, 1.1481056257175661, 5.738104618365274, 0.6917784873708381], "isController": false}, {"data": ["conform", 130, 0, 0.0, 184.58461538461546, 174, 314, 183.0, 190.0, 195.89999999999998, 280.51999999999975, 1.1480954862184383, 5.7380539422728765, 0.6917723779265396], "isController": true}, {"data": ["proceedcheckout", 131, 0, 0.0, 196.46564885496178, 171, 562, 181.0, 192.0, 248.19999999999902, 560.4000000000001, 1.14626719400791, 5.92835064400966, 0.7172800463100696], "isController": true}, {"data": ["select-579", 131, 0, 0.0, 182.12213740458023, 170, 222, 181.0, 190.8, 194.39999999999998, 215.92000000000013, 1.1460064736243547, 4.152573388701776, 0.7017563943443268], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1975, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
