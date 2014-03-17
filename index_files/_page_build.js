domino.settings({
    shortcutPrefix: "::" // Hack: preventing a bug related to a port in a URL for Ajax
    ,verbose: false
})

;(function($, domino, undefined){
    var D = new domino({
        name: "main"
        ,properties: [
            {
                id:'layoutTypes'
                ,type: 'array'
                ,value: ['FA2', 'FA2_LL', 'FR', 'YH']
            },{
                id:'networks'
                ,type: 'object'
                ,value: {}
                ,dispatch: 'networks_updated'
                ,triggers: 'update_networks'
            },{
                id:'networksAttributes'
                ,type:'object'
                ,value:{}
                ,dispatch: 'networksAttributes_updated'
                ,triggers: 'update_networksAttributes'
            },{
                id:'curves'
                ,type: 'array'
                ,value: []
                ,dispatch: 'curves_updated'
                ,triggers: 'update_curves'
            },{
                id:'csv'
                ,type: 'array'
                ,dispatch: 'csv_updated'
                ,triggers: 'update_csv'
            },{
                id:'filesToFetch'
                ,type: 'array'
                ,values: []
                ,dispatch: 'filesToFetch_updated'
                ,triggers: 'update_filesToFetch'
            },{
                id:'pendingFiles'
                ,dispatch: 'pendingFiles_updated'
                ,triggers: 'update_pendingFiles'
            }
        ],services: [
            {
                id: 'getSummary'
                ,url: 'data/summary.csv'
                ,dataType: 'string'
                ,success: function(data, input){
                    var lines = d3.csv.parseRows(data)
                        ,headline = lines.shift()
                        ,networks = this.get('networks')
                        ,networksAttributes = this.get('networksAttributes')

                    // Add networks attributes
                    headline.forEach(function(colName){
                        networksAttributes[colName] = true
                    })

                    // Init networks
                    lines.forEach(function(row){
                        var id = row[0]
                        networks[id] = {}
                    })

                    // Fill table
                    lines.forEach(function(row){
                        var id = row[0].toLowerCase().trim()
                        headline.forEach(function(colName, i){
                            networks[id][colName] = row[i].trim()
                        })
                    })

                    this.update('networksAttributes', networksAttributes)
                    this.update('networks', networks)
                    this.dispatchEvent('networks_loaded')
                }
            },{
                id: 'getBenchmarkCsvFile'
                ,dataType: 'string'
                ,url: function(input){return input.url}
                ,success: function(data, input){
                    var lines = data.split('\n')
                        ,curves_byId = {}
                        ,layout = input.layoutType
                    lines.filter(function(l){
                        return l.split(',').length > 1
                    }).forEach(function(l){
                        var a = l.split(',')
                            ,step = parseInt(a[0])
                            ,atedgelength = parseFloat(a[1])
                            ,timestamp = parseFloat(a[2])

                        if(isNaN(atedgelength) || isNaN(timestamp)){
                            console.log('Parsing : NaN for line '+l)
                        }

                        var curve = curves_byId[layout] || {atedgelength:{}, timestamp:{}}
                        curve.atedgelength[step] = atedgelength
                        curve.timestamp[step] = timestamp
                        curves_byId[layout] = curve
                    })

                    var curves = this.get('curves')
                    this.get('layoutTypes').forEach(function(layout){
                        var parsedCurve = curves_byId[layout]
                        if(parsedCurve !== undefined){
                            curves.push({
                                network: input.id
                                ,experimentType: input.experimentType
                                ,randomization: input.randomization
                                ,layout:layout
                                ,measure:'atedgelength'
                                ,values: parsedCurve.atedgelength
                                ,time: parsedCurve.timestamp
                            })
                        }
                    })

                    var networks_byId = this.get('networks')
                        ,network = networks_byId[input.id]
                    network[input.experimentType+'_fetched'] = true

                    this.update('networks', networks_byId)
                    this.update('curves', curves)
                    var pendingFiles = this.get('pendingFiles') - 1
                    this.update('pendingFiles',  pendingFiles)
                }
                ,error: function(data, xhr, input){
                    var networks_byId = this.get('networks')
                        ,network = networks_byId[input.id]
                    network['pow2_fetched'] = true

                    this.update('networks', networks_byId)
                    var pendingFiles = this.get('pendingFiles') - 1
                    this.update('pendingFiles',  pendingFiles)
                }
            }
        ],hacks:[
            {
                // Events that need to be declared somewhere
                triggers: [
                    ]
            },{
                // Init: load the networks
                triggers: ['init']
                ,method: function(e){
                    this.request('getSummary')
                }
            },{
                // When the summary file is loaded, load a data file
                triggers: ['networks_loaded']
                ,method: function(e){
                    var networks_byId = this.get('networks')
                        ,id
                        ,layoutTypes = this.get('layoutTypes')
                        ,j
                        ,r
                        ,filesToFetch = []

                    // Load the data from the "pow2" experiment
                    for(id in networks_byId){
                        var network = networks_byId[id]
                        for(j in layoutTypes){
                            var layoutType = layoutTypes[j]

                            for(r=1; r<=3; r++){
                                filesToFetch.push({url:"data/pow2/randomization_"+r+"/"+layoutType+"_"+id+".gexf.csv", id:id, experimentType:'pow2', layoutType: layoutType, randomization:r})
                            }
                        }
                    }
                    this.update('pendingFiles', filesToFetch.length)
                    this.update('filesToFetch', filesToFetch)
                    this.dispatchEvent('fetchCsvFile')
                }
            },{
                // Fetch a file
                triggers: ['fetchCsvFile']
                ,method: function(e){
                    var filesToFetch = this.get('filesToFetch')
                    if(filesToFetch && filesToFetch.length > 0){
                        var fileObj = filesToFetch.pop()
                        this.request('getBenchmarkCsvFile', fileObj)

                        this.update('filesToFetch', filesToFetch)
                    }
                }
            },{
                // When there are no more files to parse, analyze
                triggers: ['pendingFiles_updated']
                ,method: function(e){
                    if(this.get('pendingFiles') == 0){
                        this.dispatchEvent('require_analyze_curve')
                    } else if(this.get('pendingFiles') > 0){
                        this.dispatchEvent('fetchCsvFile')
                    } else {
                        console.log('Error: Negative pending files ????', this.get('pendingFiles'))
                    }
                }
            },{
                // Analyze a curve
                triggers: ['require_analyze_curve']
                ,method: function(e){
                    var curves = this.get('curves')
                        ,curve = curves.pop()

                    if(curve.experimentType == 'pow2'){
                        var step
                            ,pow2
                            ,lastValue
                            ,maxQuality = 0
                            ,benchmarkComputed_count = d3.keys(curve.values).length
                            ,stepComputed_count = d3.keys(curve.values).pop()
                            ,successiveBenchmarks = 0
                            ,totalSuccessiveBenchmarkTime = 0
                            ,lastStep
                            ,issue = false

                        var stepTime = (curve.time[stepComputed_count] - curve.time[0]) / (stepComputed_count + benchmarkComputed_count)

                        curve.averaged = {}
                        curve.quality = {}
                        curve.averaged[0] = curve.values[0]
                        for(pow2 = 0; pow2 <= 11; pow2++){
                            var value
                            if(curve.values[Math.pow(2, pow2)] && curve.values[Math.pow(2, pow2) - 1]){
                                value = (curve.values[Math.pow(2, pow2)] + curve.values[Math.pow(2, pow2) - 1]) / 2;
                            } else {
                                value = lastValue
                            }
                            curve.averaged[Math.pow(2, pow2)] = value
                            if(value > 0){
                                curve.quality[Math.pow(2, pow2)] = 1/value
                            } else {
                                console.log("Issue with <=0 value of "+curve.network)
                            }
                            if(1/value > maxQuality){
                                maxQuality = 1/value
                            }
                            lastValue = value
                        }

                        // Compute the "quick and dirty" point and the "quasi-optimal" point
                        var quickDirtyQuality = 0.5 * maxQuality
                            ,quasiOptimalQuality = 0.9 * maxQuality
                            ,quickDirtyStep
                            ,quasiOptimalStep
                        for(pow2 = 0; pow2 <= 10; pow2++){
                            step = Math.pow(2, pow2)
                            if(quickDirtyStep === undefined && curve.quality[2*step] > quickDirtyQuality){
                                // Interpolate
                                quickDirtyStep = step + step * (quickDirtyQuality - curve.quality[step]) / Math.abs(curve.quality[2*step] - curve.quality[step])
                                quickDirtyStep = Math.min(Math.max(quickDirtyStep, step), 2*step)
                                if(isNaN(quickDirtyStep))
                                    console.log("quickDirtyStep", quickDirtyStep, " = step + step * (quickDirtyQuality - curve.quality[step]) / (curve.quality[2*step] - curve.quality[step])  = "+step+" + "+step+" * ("+quickDirtyQuality+" - "+curve.quality[step]+") / ("+curve.quality[2*step]+" - "+curve.quality[step]+")")
                            }
                            if(quasiOptimalStep === undefined && curve.quality[2*step] > quasiOptimalQuality){
                                // Interpolate
                                quasiOptimalStep = step + step * (quasiOptimalQuality - curve.quality[step]) / Math.abs(curve.quality[2*step] - curve.quality[step])
                                quasiOptimalStep = Math.min(Math.max(quasiOptimalStep, step), 2*step)
                                if(isNaN(quasiOptimalStep) || quasiOptimalStep>2048)
                                    console.log("quasiOptimalStep", quasiOptimalStep, " = step + step * (quasiOptimalQuality - curve.quality[step]) / (curve.quality[2*step] - curve.quality[step]) = "+step+" + "+step+" * ("+quasiOptimalQuality+" - "+curve.quality[step]+") / ("+curve.quality[2*step]+" - "+curve.quality[step]+")")
                            }
                        }
                        if(quickDirtyStep === undefined){
                            quickDirtyStep = 2048
                        }
                        if(quasiOptimalStep === undefined){
                            quasiOptimalStep = 2048
                        }

                        if(isNaN(maxQuality)
                            || isNaN(quickDirtyStep)
                            || isNaN(quasiOptimalStep)
                            || isNaN(quickDirtyQuality)
                            || isNaN(quasiOptimalQuality)
                            || (curve.quality[1] == curve.quality[2] && curve.quality[2] == curve.quality[4])
                        ){
                            issue = true
                        }

                        curve.analysis = {
                            maxQuality: maxQuality
                            ,quickDirtyStep: quickDirtyStep
                            ,quickDirtyTime: quickDirtyStep * stepTime
                            ,quasiOptimalStep: quasiOptimalStep
                            ,quasiOptimalTime: quasiOptimalStep * stepTime
                            ,quickDirtyQuality: quickDirtyQuality
                            ,quasiOptimalQuality: quasiOptimalQuality
                            ,stepTime: stepTime
                            ,issue: issue
                        }
                        if(issue)
                            console.log('Curve issue', curve)

                        this.dispatchEvent('drawCurve', {curve:curve})

                        var networks_byId = this.get('networks')
                            ,network = networks_byId[curve.network]
                            ,layout = network[curve.layout] || {}
                            ,experimentType = layout[curve.experimentType] || {}
                            ,data = experimentType[curve.measure] || {}

                        data.issue = data.issue || ['missing', 'missing', 'missing']
                        data.issue[curve.randomization - 1] = (issue)?('issue'):('ok')

                        data.maxQuality = data.maxQuality || []
                        data.quickDirtyStep = data.quickDirtyStep || []
                        data.quickDirtyTime = data.quickDirtyTime || []
                        data.quasiOptimalStep = data.quasiOptimalStep || []
                        data.quasiOptimalTime = data.quasiOptimalTime || []
                        data.quickDirtyQuality = data.quickDirtyQuality || []
                        data.quasiOptimalQuality = data.quasiOptimalQuality || []
                        data.stepTime = data.stepTime || []

                        data.maxQuality.push(curve.analysis.maxQuality)
                        data.quickDirtyStep.push(curve.analysis.quickDirtyStep)
                        data.quickDirtyTime.push(curve.analysis.quickDirtyTime)
                        data.quasiOptimalStep.push(curve.analysis.quasiOptimalStep)
                        data.quasiOptimalTime.push(curve.analysis.quasiOptimalTime)
                        data.quickDirtyQuality.push(curve.analysis.quickDirtyQuality)
                        data.quasiOptimalQuality.push(curve.analysis.quasiOptimalQuality)
                        data.stepTime.push(curve.analysis.stepTime)

                        experimentType[curve.measure] = data
                        layout[curve.experimentType] = experimentType
                        network[curve.layout] = layout
                        networks_byId[curve.network] = network

                        this.update('networks', networks_byId)
                    }

                    this.update('curves', curves)

                    if(curves.length > 0)
                        this.dispatchEvent('require_analyze_curve')
                    else
                        this.dispatchEvent('curves_processed')
                }
            },{
                // When the curves are processed, build the csv
                triggers:['curves_processed']
                ,method: function(e){
                    var csv = []
                        ,networks_byId = this.get('networks')
                        ,id
                        ,row
                        ,attributes = d3.keys(this.get('networksAttributes'))
                        ,headline = attributes.slice(0)
                        ,layoutTypes = this.get('layoutTypes')

                    layoutTypes.forEach(function(lt){
                        // headline.push(lt + ' R1 status')
                        // headline.push(lt + ' R2 status')
                        // headline.push(lt + ' R3 status')
                        headline.push(lt + ' Max Quality')
                        headline.push(lt + ' Quasi-optimal Quality')
                        // headline.push(lt + ' Quasi-optimal Step')
                        headline.push(lt + ' Quasi-optimal Time')
                        headline.push(lt + ' Quick-Dirty Quality')
                        // headline.push(lt + ' Quick-Dirty Step')
                        headline.push(lt + ' Quick-Dirty Time')
                        // headline.push(lt + ' Step time')
                        headline.push(lt + ' QO Performance Index')
                        headline.push(lt + ' QND Performance Index')
                    })
                    
                    headline.push('Top QO Performance')
                    headline.push('Top QND Performance')
                    headline.push('Top Quality')
                    headline.push('Top QO Time')
                    headline.push('Top QND Time')

                    headline.push('Max QO Performance')
                    headline.push('Max QND Performance')
                    headline.push('Max Quality')
                    headline.push('Min QO Time')
                    headline.push('Min QND Time')
                    
                    csv.push(headline)

                    for(id in networks_byId){
                        var network = networks_byId[id]
                            ,row = attributes.slice(0).map(function(attribute){return network[attribute]})
                            ,maxQOPerformance = 0
                            ,maxQNDPerformance = 0
                            ,maxQuality = 0
                            ,minQOTime = 1000000000
                            ,minQNDTime = 1000000000

                        layoutTypes.forEach(function(lt){
                            // [0,1,2].forEach(function(randomization){
                            //     if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                            //         row.push(network[lt].pow2.atedgelength.issue[randomization])
                            //     } else {
                            //         row.push('unknown')
                            //     }
                            // })
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var qoPerformance = d3.mean(network[lt].pow2.atedgelength.quasiOptimalQuality) / d3.mean(network[lt].pow2.atedgelength.quasiOptimalTime)
                                    ,qndPerformance = d3.mean(network[lt].pow2.atedgelength.quickDirtyQuality) / d3.mean(network[lt].pow2.atedgelength.quickDirtyTime)

                                maxQOPerformance = Math.max(maxQOPerformance, qoPerformance)
                                maxQNDPerformance = Math.max(maxQNDPerformance, qndPerformance)
                                maxQuality = Math.max(maxQuality, d3.mean(network[lt].pow2.atedgelength.maxQuality))
                                minQOTime = Math.min(minQOTime, d3.mean(network[lt].pow2.atedgelength.quasiOptimalTime))
                                minQNDTime = Math.min(minQNDTime, d3.mean(network[lt].pow2.atedgelength.quickDirtyTime))

                                row.push(d3.mean(network[lt].pow2.atedgelength.maxQuality))
                                row.push(d3.mean(network[lt].pow2.atedgelength.quasiOptimalQuality))
                                // row.push(d3.mean(network[lt].pow2.atedgelength.quasiOptimalStep))
                                row.push(d3.mean(network[lt].pow2.atedgelength.quasiOptimalTime))
                                row.push(d3.mean(network[lt].pow2.atedgelength.quickDirtyQuality))
                                // row.push(d3.mean(network[lt].pow2.atedgelength.quickDirtyStep))
                                row.push(d3.mean(network[lt].pow2.atedgelength.quickDirtyTime))
                                // row.push(d3.mean(network[lt].pow2.atedgelength.stepTime))
                                row.push(qoPerformance)
                                row.push(qndPerformance)

                            } else {

                                row.push(undefined)
                                row.push(undefined)
                                // row.push(undefined)
                                row.push(undefined)
                                row.push(undefined)
                                // row.push(undefined)
                                row.push(undefined)
                                // row.push(undefined)
                                row.push(undefined)
                                row.push(undefined)
                            }
                        })

                        // Best performance
                        if(!layoutTypes.some(function(lt){
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var qoPerformance = d3.mean(network[lt].pow2.atedgelength.quasiOptimalQuality) / d3.mean(network[lt].pow2.atedgelength.quasiOptimalTime)
                                if(qoPerformance == maxQOPerformance){
                                    row.push(lt)
                                    return true
                                }
                            }
                            return false
                        })){
                            row.push('N/A')
                        }
                        if(!layoutTypes.some(function(lt){
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var qndPerformance = d3.mean(network[lt].pow2.atedgelength.quickDirtyQuality) / d3.mean(network[lt].pow2.atedgelength.quickDirtyTime)
                                if(qndPerformance == maxQNDPerformance){
                                    row.push(lt)
                                    return true
                                }
                            }
                            return false
                        })){
                            row.push('N/A')
                        }
                        if(!layoutTypes.some(function(lt){
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var quality = d3.mean(network[lt].pow2.atedgelength.maxQuality)
                                if(quality == maxQuality){
                                    row.push(lt)
                                    return true
                                }
                            }
                            return false
                        })){
                            row.push('N/A')
                        }
                        if(!layoutTypes.some(function(lt){
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var qoTime = d3.mean(network[lt].pow2.atedgelength.quasiOptimalTime)
                                if(qoTime == minQOTime){
                                    row.push(lt)
                                    return true
                                }
                            }
                            return false
                        })){
                            row.push('N/A')
                        }
                        if(!layoutTypes.some(function(lt){
                            if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                                var qndTime = d3.mean(network[lt].pow2.atedgelength.quickDirtyTime)
                                if(qndTime == minQNDTime){
                                    row.push(lt)
                                    return true
                                }
                            }
                            return false
                        })){
                            row.push('N/A')
                        }

                        //
                        row.push(maxQOPerformance)
                        row.push(maxQNDPerformance)
                        row.push(maxQuality)
                        row.push(minQOTime)
                        row.push(minQNDTime)
                        
                        csv.push(row)
                    }

                    this.update('csv', csv)
                }
            },{
                // When the CSV is made, download the JSON and CSV
                triggers:['csv_updated']
                ,method: function(e){
                    var csv_data = this.get('csv')
                        ,csv = csv_data.map(function(row){
                            return row.map(function(d){return '"'+(''+d).replace('"', '""')+'"'}).join(',')
                        }).join('\n')

                    // Download
                    var blob = new Blob([csv], {'type':'application/csv;charset=utf-8'})
                        ,filename = "Benchmark.csv"
                    // saveAs(blob, filename)
                }
            }
        ]
    })
    

    //// On load
    $( document ).ready(function() {
        D.dispatchEvent('init')
    })

    //// Modules

    // Report
    D.addModule(function(){
        domino.module.call(this)

        var _self = this
            ,container = $('#report')
            ,reportContainer = container.find('.reportText')

        this.triggers.events['csv_updated'] = function(provider, e){
            var text = ''
            
            /*
            text +=   'Data crunched'
            text += '\n-------------------------------------------------------------'
            text += '\n\n\n'
            */

            // Network issues
            text +=   'Network issues'
            text += '\n-------------------------------------------------------------'
            var networks_byId = provider.get('networks')
                ,layoutTypes = provider.get('layoutTypes')
            for(id in networks_byId){
                var network = networks_byId[id]
                    ,networkText = ""
                layoutTypes.forEach(function(lt){
                    if(network[lt] && network[lt].pow2 && network[lt].pow2.atedgelength){
                        [0,1,2].forEach(function(randomization){
                            var issue = network[lt].pow2.atedgelength.issue[randomization]
                            if(issue != "ok"){
                                networkText += "\n" + (randomization+1) + "-" + lt + ": " + issue
                            }
                        })
                    } else {
                        networkText += "\n# " + lt + ": Unknown"
                    }
                })
                if(networkText != ""){
                    text += "\n\n:: " + network.id + networkText
                }
            }
            text += '\n\n\n'

            reportContainer.text(text)
        }
    })

    // Display a curve
    D.addModule(function(){
        domino.module.call(this)

        var _self = this
            ,container = $('#viz_preview')

        var addThumbnail = function(provider, e){
            var tn = $('<li class="span4"/>')
                ,curve = e.data.curve
                ,svgEl = $('<div class="svg"/>')

            if(curve.analysis.issue)
                svgEl.addClass('issue')

            tn.append(
                    $('<div class="thumbnail"/>').append(
                            svgEl
                        ).append(
                            $('<div class="caption"/>').append(
                                    $('<strong/>').text(curve.layout)
                                ).append(
                                    $('<span class="text-info"/>').text(" - "+curve.network)
                                ).append($('<br/>')).append(
                                    $('<small/>').text(
                                            "Max quality: " + (Math.round(100 * curve.analysis.maxQuality) / 100)
                                            // + " - Step: " + (Math.round(100 * curve.analysis.stepTime) / 100) + "ms"
                                        )
                                ).append($('<br/>')).append(
                                    $('<small/>').html(
                                            "<span style='color:#E20;'>•</span>Quick and dirty: " + (Math.round(curve.analysis.quickDirtyStep * curve.analysis.stepTime / 1000) ) + "s"
                                            + " <span style='color:#13E;'>•</span>Quasi-optimal stage: " + (Math.round(curve.analysis.quasiOptimalStep * curve.analysis.stepTime / 1000) ) + "s"
                                        )
                                )
                        )
                )

            container.append(tn)
            
            svgEl.svg({onLoad: draw})

            function draw(svg) {
                var width = svgEl.width()
                    ,height = svgEl.height()
                    ,g = svg.group()
                
                // Precompute
                var min_step = 1000000
                    ,max_step = 0
                    ,min_value = 1000000
                    ,max_value = -1
                    ,points = []
                    ,points_raw = []
                    ,step

                for(step in curve.quality){
                    var value = parseFloat(curve.quality[step])
                    min_step = Math.min(min_step, step)
                    max_step = Math.max(max_step, step)
                    min_value = Math.min(min_value, value)
                    max_value = Math.max(max_value, value)
                    points.push(step)
                }

                // Fine tune things
                min_value = 0
                max_value *= 1.05

                if(max_value <= min_value){
                    console.log('We have an issue in the values of this curve', curve)
                } else {

                    // Draw
                    svg.line(g, 0, 0, 0, height, {strokeWidth: 0.5, stroke:'#666'})
                    svg.line(g, 0, height, width, height, {strokeWidth: 0.5, stroke:'#666'})
                    svg.text(g, 2, 12, "Quality", {fill:"#999", fontSize:"10px"})
                    svg.text(g, width - 30, height - 2, "Time", {fill:"#999", fontSize:"10px"})
                    var i
                    for(i = 1; i<points.length; i++){
                        var step1 = parseInt(points[i-1])
                            ,step2 = parseInt(points[i])
                            ,x1 = width * (step1 - min_step) / (max_step - min_step)
                            ,y1 = height - height * (curve.quality[step1] - min_value) / (max_value - min_value)
                            ,x2 = width * (step2 - min_step) / (max_step - min_step)
                            ,y2 = height - height * (curve.quality[step2] - min_value) / (max_value - min_value)
                            
                        svg.line(g, x1, y1, x2, y2, {strokeWidth: 0.5, stroke:'#000'})
                    }

                    // Draw the important points
                    var xQD = width * (curve.analysis.quickDirtyStep - min_step) / (max_step - min_step)
                        ,yQD = height - height * (curve.analysis.quickDirtyQuality - min_value) / (max_value - min_value)
                        ,xQO = width * (curve.analysis.quasiOptimalStep - min_step) / (max_step - min_step)
                        ,yQO = height - height * (curve.analysis.quasiOptimalQuality - min_value) / (max_value - min_value)
                    if(!isNaN(xQD+yQD+xQO+yQO)){
                        svg.circle(g, xQD, yQD, 4, {fill:'#E20'})
                        svg.circle(g, xQO, yQO, 4, {fill:'#13E'})
                    }

                    /*if(curve.analysis && curve.analysis.hasTheProfile){
                        if(curve.analysis.min_tangent_step && curve.analysis.min_tangent_step<max_step){
                            var x = width * (curve.analysis.min_tangent_step - min_step) / (max_step - min_step)
                                ,y = height - height * (curve.smoothed[curve.analysis.min_tangent_step] - min_value) / (max_value - min_value)
                            svg.circle(g, x, y, 2, {fill:'#333'})

                            if(curve.analysis.quality_at_ideal_convergence_found){
                                var x2 = width * (curve.analysis.ideal_converence_step - min_step) / (max_step - min_step)
                                    ,y2 = height
                                svg.line(g, x, y, x2, y2, {strokeWidth: 0.3, stroke:'#F00'})

                                var y3 = height - height * (curve.analysis.quality_at_ideal_convergence - min_value) / (max_value - min_value)
                                svg.line(g, x2, y2, x2, y3, {strokeWidth: 0.3, stroke:'#F00'})
                                svg.circle(g, x2, y3, 2, {fill:'#F00'})
                            }
                        }
                    }*/
                }



            }
        }

        this.triggers.events['drawCurve'] = addThumbnail
    })

    // CSV
    D.addModule(function(){
        domino.module.call(this)

        var _self = this
            ,container = $('#csv_preview')
            ,reportContainer = container.find('.reportText')

        this.triggers.events['csv_updated'] = function(provider, e){
            var namesAttributes = d3.keys(provider.get('namesAttributes'))
                ,csv = provider.get('csv').map(function(row){
                        return row.map(function(d){return '"'+(''+d).replace('"', '""')+'"'}).join(',')
                    }).join('\n')

            reportContainer.text(csv)
        }
    })

    //// Data processing


})(jQuery, domino)


