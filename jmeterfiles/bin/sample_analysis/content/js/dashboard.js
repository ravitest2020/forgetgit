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

    var data = {"OkPercent": 99.95027349577325, "KoPercent": 0.04972650422675286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9732604945370903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "BeanShell Sampler"], "isController": false}, {"data": [0.9776119402985075, 500, 1500, "login-578"], "isController": false}, {"data": [0.9962962962962963, 500, 1500, "login-577"], "isController": false}, {"data": [1.0, 500, 1500, "addcart-585"], "isController": false}, {"data": [1.0, 500, 1500, "select"], "isController": true}, {"data": [0.9962962962962963, 500, 1500, "launch-553"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "launch-550"], "isController": false}, {"data": [0.7527675276752768, 500, 1500, "login"], "isController": true}, {"data": [0.9777777777777777, 500, 1500, "enterstore-573"], "isController": false}, {"data": [1.0, 500, 1500, "addcart"], "isController": true}, {"data": [1.0, 500, 1500, "product-584"], "isController": false}, {"data": [0.9742647058823529, 500, 1500, "enterstore"], "isController": true}, {"data": [1.0, 500, 1500, "login-575"], "isController": false}, {"data": [1.0, 500, 1500, "returntohome"], "isController": true}, {"data": [1.0, 500, 1500, "inf-588"], "isController": false}, {"data": [1.0, 500, 1500, "inf"], "isController": true}, {"data": [1.0, 500, 1500, "product"], "isController": true}, {"data": [1.0, 500, 1500, "launch-566"], "isController": false}, {"data": [1.0, 500, 1500, "returntohome-590"], "isController": false}, {"data": [0.9632352941176471, 500, 1500, "launch"], "isController": true}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9810606060606061, 500, 1500, "proceedcheckout-586"], "isController": false}, {"data": [0.9924242424242424, 500, 1500, "conform-589"], "isController": false}, {"data": [0.5, 500, 1500, "enterstore-23"], "isController": false}, {"data": [1.0, 500, 1500, "login-24"], "isController": false}, {"data": [0.9924242424242424, 500, 1500, "conform"], "isController": true}, {"data": [0.0, 500, 1500, "launch-10"], "isController": false}, {"data": [0.9810606060606061, 500, 1500, "proceedcheckout"], "isController": true}, {"data": [0.5, 500, 1500, "launch-15"], "isController": false}, {"data": [1.0, 500, 1500, "select-579"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2011, 1, 0.04972650422675286, 165.9890601690703, 1, 1855, 179.0, 193.0, 356.0, 547.6399999999996, 0.0061095313623055515, 0.0771180199574465, 0.004181706583719707], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["BeanShell Sampler", 132, 0, 0.0, 3.2424242424242427, 1, 17, 3.0, 5.0, 6.0, 15.019999999999925, 1.1638056444573757, 0.0, 0.0], "isController": false}, {"data": ["login-578", 134, 0, 0.0, 196.79104477611943, 168, 563, 180.5, 186.0, 295.75, 562.3, 1.1592698330305389, 5.543890988623583, 0.7381288389999134], "isController": false}, {"data": ["login-577", 135, 0, 0.0, 358.5185185185184, 336, 574, 356.0, 365.4, 371.0, 509.9199999999976, 1.1600728697624858, 5.794448178578181, 1.9666860370192143], "isController": false}, {"data": ["addcart-585", 132, 0, 0.0, 181.56818181818184, 167, 231, 181.0, 187.0, 189.0, 223.73999999999972, 1.1602151671764582, 5.176952040045002, 0.7487562844988221], "isController": false}, {"data": ["select", 134, 0, 0.0, 181.276119402985, 168, 234, 181.0, 185.5, 191.0, 228.4000000000001, 1.1593099510321319, 4.236175472159258, 0.7097157365511394], "isController": true}, {"data": ["launch-553", 135, 0, 0.0, 51.703703703703695, 29, 1355, 35.0, 50.400000000000006, 143.99999999999994, 929.1199999999839, 1.1310132202878638, 90.89756240470167, 0.9167392312880146], "isController": false}, {"data": ["launch-550", 135, 0, 0.0, 148.8444444444445, 116, 946, 126.0, 143.0, 393.7999999999999, 841.9599999999961, 1.142818444243158, 9.381982237109431, 0.6472995094346011], "isController": false}, {"data": ["login", 271, 0, 0.0, 366.79704797047975, 168, 934, 304.0, 544.0, 553.0, 917.0, 8.233221361725353E-4, 0.005607668597180361, 0.0012176091324276714], "isController": true}, {"data": ["enterstore-573", 135, 0, 0.0, 199.53333333333325, 168, 952, 179.0, 192.0, 280.3999999999964, 815.5599999999948, 1.1538658780491975, 5.531119188469034, 0.645468766025915], "isController": false}, {"data": ["addcart", 132, 0, 0.0, 181.56818181818184, 167, 231, 181.0, 187.0, 189.0, 223.73999999999972, 1.1602049695446195, 5.176906537579215, 0.7487497033566839], "isController": true}, {"data": ["product-584", 133, 0, 0.0, 181.14285714285705, 168, 217, 181.0, 186.0, 189.0, 213.25999999999996, 1.1513556563592922, 4.360783219424149, 0.7409772374606115], "isController": false}, {"data": ["enterstore", 136, 0, 0.0, 202.89705882352948, 168, 952, 179.0, 192.89999999999998, 534.6, 842.8499999999987, 4.1317992809217045E-4, 0.0019821148779283755, 2.3097773840929212E-4], "isController": true}, {"data": ["login-575", 135, 0, 0.0, 181.16296296296292, 168, 304, 180.0, 187.0, 189.2, 274.4799999999989, 1.1616700512855815, 4.533933336811173, 0.7396571029669914], "isController": false}, {"data": ["returntohome", 132, 0, 0.0, 180.93939393939394, 166, 350, 180.0, 184.7, 187.7, 306.1099999999983, 1.1602253649875627, 5.548331805227167, 0.7013471688743177], "isController": true}, {"data": ["inf-588", 132, 0, 0.0, 181.31818181818184, 169, 194, 181.0, 188.0, 192.0, 194.0, 1.1603987552086081, 5.004219631837122, 1.385081788332718], "isController": false}, {"data": ["inf", 132, 0, 0.0, 181.31818181818184, 169, 194, 181.0, 188.0, 192.0, 194.0, 1.1603987552086081, 5.004219631837122, 1.385081788332718], "isController": true}, {"data": ["product", 133, 0, 0.0, 181.14285714285705, 168, 217, 181.0, 186.0, 189.0, 213.25999999999996, 1.1513456893790524, 4.360745469281578, 0.7409708230173914], "isController": true}, {"data": ["launch-566", 135, 0, 0.0, 40.91851851851852, 23, 373, 33.0, 49.60000000000002, 103.99999999999994, 289.83999999999685, 1.1517297274239646, 57.2164482068208, 0.48926018694279744], "isController": false}, {"data": ["returntohome-590", 132, 0, 0.0, 180.93939393939394, 166, 350, 180.0, 184.7, 187.7, 306.1099999999983, 1.160235562977938, 5.548380573195922, 0.7013533334798278], "isController": false}, {"data": ["launch", 136, 0, 0.0, 260.7941176470589, 175, 2870, 195.0, 250.2, 679.9000000000001, 2797.479999999999, 4.1317647108862207E-4, 0.0569191442555141, 7.424680074952035E-4], "isController": true}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1270.01953125, 0.0], "isController": false}, {"data": ["proceedcheckout-586", 132, 0, 0.0, 194.75, 166, 589, 180.5, 188.7, 196.35, 584.0499999999998, 1.1602763567322398, 6.000804282474553, 0.7259881989126804], "isController": false}, {"data": ["conform-589", 132, 1, 0.7575757575757576, 184.38636363636374, 171, 379, 182.0, 189.0, 193.35, 326.859999999998, 1.160561993353145, 5.890319198508854, 0.6992839354481352], "isController": false}, {"data": ["enterstore-23", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 8.054782629375952, 0.7744125761035008], "isController": false}, {"data": ["login-24", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 21.489955357142858, 3.638392857142857], "isController": false}, {"data": ["conform", 132, 1, 0.7575757575757576, 184.38636363636374, 171, 379, 182.0, 189.0, 193.35, 326.859999999998, 1.160561993353145, 5.890319198508854, 0.6992839354481352], "isController": true}, {"data": ["launch-10", 1, 0, 0.0, 1855.0, 1855, 1855, 1855.0, 1855.0, 1855.0, 1855.0, 0.5390835579514826, 37.74163999326146, 0.4369524932614555], "isController": false}, {"data": ["proceedcheckout", 132, 0, 0.0, 194.75, 166, 589, 180.5, 188.7, 196.35, 584.0499999999998, 1.1602763567322398, 6.000804282474553, 0.7259881989126804], "isController": true}, {"data": ["launch-15", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.6985067733990148, 0.33578355911330054], "isController": false}, {"data": ["select-579", 134, 0, 0.0, 181.276119402985, 168, 234, 181.0, 185.5, 191.0, 228.4000000000001, 1.1593199809663883, 4.2362121220314055, 0.7097218767573648], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.04972650422675286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2011, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["conform-589", 132, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
