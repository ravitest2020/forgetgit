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

    var data = {"OkPercent": 99.92962702322308, "KoPercent": 0.07037297677691766};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7481835564053537, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7314814814814815, 500, 1500, "proceed checkout-90"], "isController": false}, {"data": [0.7037037037037037, 500, 1500, "inf"], "isController": true}, {"data": [1.0, 500, 1500, "BeanShell Sampler"], "isController": false}, {"data": [0.8287037037037037, 500, 1500, "selectcats-83"], "isController": false}, {"data": [0.7638888888888888, 500, 1500, "addcart-89"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "selectproduct"], "isController": true}, {"data": [0.4027777777777778, 500, 1500, "enetrestore-78"], "isController": false}, {"data": [0.8347457627118644, 500, 1500, "launch"], "isController": true}, {"data": [0.4342105263157895, 500, 1500, "enetrestore"], "isController": true}, {"data": [0.8287037037037037, 500, 1500, "selectcats"], "isController": true}, {"data": [0.7013888888888888, 500, 1500, "login"], "isController": true}, {"data": [0.8379629629629629, 500, 1500, "login-80"], "isController": false}, {"data": [0.5648148148148148, 500, 1500, "login-81"], "isController": false}, {"data": [0.7037037037037037, 500, 1500, "inf-92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "selectproduct-88"], "isController": false}, {"data": [0.7638888888888888, 500, 1500, "addcart"], "isController": true}, {"data": [0.7361111111111112, 500, 1500, "conform-93"], "isController": false}, {"data": [0.8347826086956521, 500, 1500, "launch-73"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.7361111111111112, 500, 1500, "conform"], "isController": true}, {"data": [0.7268518518518519, 500, 1500, "returnpage-94"], "isController": false}, {"data": [0.7314814814814815, 500, 1500, "proceed checkout"], "isController": true}, {"data": [0.7268518518518519, 500, 1500, "returnpage"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1421, 1, 0.07037297677691766, 518.5165376495424, 0, 6663, 419.0, 1051.8, 1329.8999999999999, 2253.5999999999967, 0.7912863833033562, 2.8678329042674338, 0.49193939642835266], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["proceed checkout-90", 108, 0, 0.0, 580.1851851851851, 199, 1679, 500.5, 1033.4, 1427.0, 1670.2699999999998, 0.06244601022033034, 0.322962959108271, 0.03908126903736006], "isController": false}, {"data": ["inf", 108, 0, 0.0, 617.3425925925925, 184, 2317, 530.5, 1142.5, 1592.3499999999997, 2261.379999999998, 0.06242724047319849, 0.2688516899285208, 0.07438297825913548], "isController": true}, {"data": ["BeanShell Sampler", 108, 0, 0.0, 3.4537037037037046, 1, 30, 3.0, 6.0, 7.549999999999997, 28.559999999999945, 0.062435071861033406, 0.0, 0.0], "isController": false}, {"data": ["selectcats-83", 108, 0, 0.0, 469.8703703703702, 185, 2566, 363.0, 890.5000000000001, 1031.8999999999999, 2509.299999999998, 0.062431246145015065, 0.2252090688032797, 0.0382286382169983], "isController": false}, {"data": ["addcart-89", 108, 0, 0.0, 524.5277777777776, 189, 1207, 437.0, 998.1, 1052.35, 1205.92, 0.06241735479873871, 0.2784252444535245, 0.04029427651639496], "isController": false}, {"data": ["selectproduct", 108, 0, 0.0, 463.44444444444446, 184, 2031, 322.0, 889.7000000000007, 1194.1499999999999, 1978.889999999998, 0.06242951389952663, 0.2375326942063677, 0.040190354379979545], "isController": true}, {"data": ["enetrestore-78", 108, 0, 0.0, 1181.9444444444446, 533, 6663, 974.0, 2086.3, 2430.1999999999994, 6332.789999999988, 0.06239719628598022, 0.3013427096675789, 0.03467752168447009], "isController": false}, {"data": ["launch", 118, 0, 0.0, 514.9152542372881, 0, 5899, 421.0, 824.5000000000001, 1132.6999999999994, 5072.88000000001, 0.06552312161035842, 0.044960925765357256, 0.021763857966695374], "isController": true}, {"data": ["enetrestore", 114, 0, 0.0, 1119.7368421052631, 0, 6663, 936.5, 2025.0, 2369.0, 6112.64999999998, 0.06363276082454661, 0.2911355796442147, 0.033502918943584536], "isController": true}, {"data": ["selectcats", 108, 0, 0.0, 469.8703703703702, 185, 2566, 363.0, 890.5000000000001, 1031.8999999999999, 2509.299999999998, 0.06243157095174618, 0.22521024048294289, 0.03822883710649323], "isController": true}, {"data": ["login", 216, 0, 0.0, 633.8518518518514, 181, 3518, 534.5, 1124.2000000000003, 1343.5499999999997, 2572.5299999999907, 0.12443837103259077, 0.5529885390675994, 0.1450970849735482], "isController": true}, {"data": ["login-80", 108, 0, 0.0, 458.7592592592594, 181, 2673, 306.5, 836.4000000000001, 1065.55, 2571.7499999999964, 0.06243312285277749, 0.2430291955058557, 0.039752339941416914], "isController": false}, {"data": ["login-81", 108, 0, 0.0, 808.9444444444443, 372, 3518, 650.5, 1305.7, 1605.3999999999999, 3388.759999999995, 0.06242103450149291, 0.31180038229993773, 0.10582316005331219], "isController": false}, {"data": ["inf-92", 108, 0, 0.0, 617.3425925925924, 184, 2317, 530.5, 1142.5, 1592.3499999999997, 2261.379999999998, 0.06242651878517995, 0.2688485818775816, 0.07438211835721147], "isController": false}, {"data": ["selectproduct-88", 108, 0, 0.0, 463.44444444444446, 184, 2031, 322.0, 889.7000000000007, 1194.1499999999999, 1978.889999999998, 0.062428972592524945, 0.23753063463385987, 0.040190005901850095], "isController": false}, {"data": ["addcart", 108, 0, 0.0, 524.5277777777776, 189, 1207, 437.0, 998.1, 1052.35, 1205.92, 0.06241760731349417, 0.27842637084670063, 0.04029443953034218], "isController": true}, {"data": ["conform-93", 108, 1, 0.9259259259259259, 565.7777777777777, 196, 1685, 504.0, 1026.5000000000002, 1283.5499999999997, 1673.2999999999995, 0.06241771553472911, 0.3174407477801255, 0.037609111801687356], "isController": false}, {"data": ["launch-73", 115, 0, 0.0, 484.8347826086957, 131, 1551, 425.0, 829.0000000000001, 1065.7999999999993, 1536.7600000000002, 0.06403795501751298, 0.045088136585997404, 0.02182543584092972], "isController": false}, {"data": ["Debug Sampler", 108, 0, 0.0, 0.2870370370370371, 0, 2, 0.0, 1.0, 1.0, 1.9099999999999966, 0.06243503576718207, 0.12444947961409367, 0.0], "isController": false}, {"data": ["conform", 108, 1, 0.9259259259259259, 565.7777777777777, 196, 1685, 504.0, 1026.5000000000002, 1283.5499999999997, 1673.2999999999995, 0.062418220572120785, 0.3174433162728347, 0.037609416106443874], "isController": true}, {"data": ["returnpage-94", 108, 0, 0.0, 576.9166666666669, 191, 2360, 524.0, 944.3000000000002, 1313.2999999999997, 2290.699999999997, 0.06241764338719745, 0.2984953121749081, 0.0377309777897219], "isController": false}, {"data": ["proceed checkout", 108, 0, 0.0, 580.1851851851851, 199, 1679, 500.5, 1033.4, 1427.0, 1670.2699999999998, 0.062445793581960105, 0.3229618386816999, 0.03908113345620121], "isController": true}, {"data": ["returnpage", 108, 0, 0.0, 577.2037037037037, 191, 2360, 524.0, 944.3000000000002, 1313.7499999999995, 2290.7899999999972, 0.06241771553472911, 0.42291061302721294, 0.03773102140234113], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.07037297677691766], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1421, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["conform-93", 108, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
