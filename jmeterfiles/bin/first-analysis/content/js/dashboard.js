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

    var data = {"OkPercent": 92.3076923076923, "KoPercent": 7.6923076923076925};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7222222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "proceed checkout-90"], "isController": false}, {"data": [0.75, 500, 1500, "inf"], "isController": true}, {"data": [0.0, 500, 1500, "BeanShell Sampler"], "isController": false}, {"data": [0.75, 500, 1500, "selectcats-83"], "isController": false}, {"data": [0.75, 500, 1500, "addcart-89"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "selectproduct"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "enetrestore-78"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "launch"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "enetrestore"], "isController": true}, {"data": [0.75, 500, 1500, "selectcats"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "login-80"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "login-81"], "isController": false}, {"data": [0.75, 500, 1500, "inf-92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "selectproduct-88"], "isController": false}, {"data": [0.75, 500, 1500, "addcart"], "isController": true}, {"data": [0.75, 500, 1500, "conform-93"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "launch-73"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.75, 500, 1500, "conform"], "isController": true}, {"data": [0.75, 500, 1500, "returnpage-94"], "isController": false}, {"data": [0.75, 500, 1500, "proceed checkout"], "isController": true}, {"data": [0.75, 500, 1500, "returnpage"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 78, 6, 7.6923076923076925, 456.14102564102575, 0, 1763, 401.0, 852.6000000000005, 1254.7999999999997, 1763.0, 2.6313126201801436, 9.675588724572412, 1.6462505376480112], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["proceed checkout-90", 6, 0, 0.0, 515.5, 207, 949, 499.0, 949.0, 949.0, 949.0, 0.2639218791237794, 1.3649709685932963, 0.16516595462743028], "isController": false}, {"data": ["inf", 6, 0, 0.0, 522.0, 194, 903, 510.0, 903.0, 903.0, 903.0, 0.2688774367017701, 1.157958492045709, 0.3200796829486892], "isController": true}, {"data": ["BeanShell Sampler", 6, 6, 100.0, 9.833333333333334, 4, 13, 10.5, 13.0, 13.0, 13.0, 0.27753365095517835, 0.0, 0.0], "isController": false}, {"data": ["selectcats-83", 6, 0, 0.0, 512.1666666666666, 187, 847, 513.5, 847.0, 847.0, 847.0, 0.2629042152309175, 0.9478073514591184, 0.16110585454824292], "isController": false}, {"data": ["addcart-89", 6, 0, 0.0, 472.5, 181, 692, 491.5, 692.0, 692.0, 692.0, 0.26042796996397416, 1.161159474152524, 0.16810828920526064], "isController": false}, {"data": ["selectproduct", 6, 0, 0.0, 399.83333333333337, 181, 700, 326.0, 700.0, 700.0, 700.0, 0.26414263702399293, 1.0359344045784724, 0.17016220008804755], "isController": true}, {"data": ["enetrestore-78", 6, 0, 0.0, 812.3333333333333, 175, 1346, 847.0, 1346.0, 1346.0, 1346.0, 0.2575881166015541, 1.2974995170222814, 0.1377241150774911], "isController": false}, {"data": ["launch", 6, 0, 0.0, 502.83333333333337, 86, 1763, 293.0, 1763.0, 1763.0, 1763.0, 0.24049060082568438, 0.17042579361898272, 0.08196408172672251], "isController": true}, {"data": ["enetrestore", 6, 0, 0.0, 812.3333333333333, 175, 1346, 847.0, 1346.0, 1346.0, 1346.0, 0.25756600128783, 1.2973881197681905, 0.13771229072762395], "isController": true}, {"data": ["selectcats", 6, 0, 0.0, 512.1666666666666, 187, 847, 513.5, 847.0, 847.0, 847.0, 0.26289269596459713, 0.9477658228541384, 0.1610987956228366], "isController": true}, {"data": ["login", 12, 0, 0.0, 661.8333333333333, 179, 1740, 695.5, 1463.700000000001, 1740.0, 1740.0, 0.5254860746190225, 2.319143498751971, 0.6127249737256963], "isController": true}, {"data": ["login-80", 6, 0, 0.0, 633.1666666666666, 179, 1740, 438.5, 1740.0, 1740.0, 1740.0, 0.27122321670735017, 1.039203408936805, 0.1726929075128831], "isController": false}, {"data": ["login-81", 6, 0, 0.0, 690.5, 455, 819, 708.0, 819.0, 819.0, 819.0, 0.26748696001069944, 1.33612871138157, 0.45347398689313895], "isController": false}, {"data": ["inf-92", 6, 0, 0.0, 522.0, 194, 903, 510.0, 903.0, 903.0, 903.0, 0.2688653880623768, 1.1579066028858218, 0.32006533989066144], "isController": false}, {"data": ["selectproduct-88", 6, 0, 0.0, 399.83333333333337, 181, 700, 326.0, 700.0, 700.0, 700.0, 0.2641542660913974, 1.0359800123271992, 0.17016969159989434], "isController": false}, {"data": ["addcart", 6, 0, 0.0, 472.5, 181, 692, 491.5, 692.0, 692.0, 692.0, 0.26042796996397416, 1.161159474152524, 0.16810828920526064], "isController": true}, {"data": ["conform-93", 6, 0, 0.0, 500.6666666666667, 185, 821, 458.5, 821.0, 821.0, 821.0, 0.26880516105909236, 1.341794512454639, 0.161965609739707], "isController": false}, {"data": ["launch-73", 6, 0, 0.0, 502.83333333333337, 86, 1763, 293.0, 1763.0, 1763.0, 1763.0, 0.24103161531354195, 0.17080918832603542, 0.08214847045354115], "isController": false}, {"data": ["Debug Sampler", 6, 0, 0.0, 0.5, 0, 1, 0.5, 1.0, 1.0, 1.0, 0.2775721687638786, 0.5528402716737602, 0.0], "isController": false}, {"data": ["conform", 6, 0, 0.0, 500.6666666666667, 185, 821, 458.5, 821.0, 821.0, 821.0, 0.26879311889615626, 1.3417344015993191, 0.16195835386614102], "isController": true}, {"data": ["returnpage-94", 6, 0, 0.0, 358.0, 177, 550, 355.5, 550.0, 550.0, 550.0, 0.2709048221058335, 1.295528236183854, 0.16375984851905365], "isController": false}, {"data": ["proceed checkout", 6, 0, 0.0, 515.5, 207, 949, 499.0, 949.0, 949.0, 949.0, 0.2639218791237794, 1.3649709685932963, 0.16516595462743028], "isController": true}, {"data": ["returnpage", 6, 0, 0.0, 358.5, 177, 550, 356.5, 550.0, 550.0, 550.0, 0.27089259108763375, 1.8350063067181361, 0.16375245496410673], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/org.apache.jorphan.util.JMeterException: Error invoking bsh method: eval\\tSourced file: inline evaluation of: ``FileWriter f = new FileWriter(&quot;C:/Users/sanka/aswani/jmteroutput/jan6.txt&quot;,true) . . . '' Token Parsing Error: Lexical error at line 10, column 1.  Encountered: &quot;\\\\u200b&quot; (8203), after : &quot;&quot;", 6, 100.0, 7.6923076923076925], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 78, 6, "500/org.apache.jorphan.util.JMeterException: Error invoking bsh method: eval\\tSourced file: inline evaluation of: ``FileWriter f = new FileWriter(&quot;C:/Users/sanka/aswani/jmteroutput/jan6.txt&quot;,true) . . . '' Token Parsing Error: Lexical error at line 10, column 1.  Encountered: &quot;\\\\u200b&quot; (8203), after : &quot;&quot;", 6, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["BeanShell Sampler", 6, 6, "500/org.apache.jorphan.util.JMeterException: Error invoking bsh method: eval\\tSourced file: inline evaluation of: ``FileWriter f = new FileWriter(&quot;C:/Users/sanka/aswani/jmteroutput/jan6.txt&quot;,true) . . . '' Token Parsing Error: Lexical error at line 10, column 1.  Encountered: &quot;\\\\u200b&quot; (8203), after : &quot;&quot;", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
