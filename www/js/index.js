/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        $('#app').load('views/workspace.html', function() {
            console.log('Workspace loaded!');
            workspace.initialize();
        });
    }
};

var workspace = {
    initialize: function() {
        text_displayed = false;
        this.newGrid(32);
        elements_ongrid = [];
        element_id = null;

        var $panzoom = $('.workspace-grid').panzoom({
            minScale: .5,
            maxScale: 2,
            onPan: onGridPan
        });
        
        $panzoom.parent().on('mousewheel.focal', function(e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 1,
                focal: e
            });
        });

        $panzoom.parent().on('gestureend', function(e) {
            if (e.scale < 1.0) {
                $('.workspace-grid').panzoom("zoomOut");
            } else if (e.scale > 1.0) {
                $('.workspace-grid').panzoom("zoomIn");
            }
        }, false);
        
        $('#text-button').on('click', function(e) {
            if(text_displayed) {
                $('.left-panel').animate({'left': -$('.left-panel').outerWidth()+40+'px'}, 'slow');
                $('.bottom-panel').animate({'left': $(window).width()/2 - $('.bottom-panel').outerWidth()/2+'px'}, 'slow')
            } else {
                $('.left-panel').animate({'left': '0'}, 'slow');
                $('.bottom-panel').animate({'left': $(window).width()*.75 - $('.bottom-panel').outerWidth()/2+'px'}, 'slow')
            }
            
            text_displayed = !text_displayed;
        });

        $('#start-button').on('click', function(e) {
            $('#start-window').animate({'opacity': '0'}, 'slow', function() {
                $('#start-window').hide();
            });
        });

        $('#camera-button').on('click', function(e) {
            $('.workspace-grid').css({'-webkit-transform': 'translate(0px, 0px)'});
        });

        $('.bottom-panel > img').on('click', function(e) {
            $('.bottom-panel').animate({'bottom': -$('.bottom-panel').outerHeight()+'px'}, 'slow');
            $('#cancel-button').show();
            element_id = $(this).attr('id');
            console.log('Item selected: ' + element_id);

            if(text_displayed) {
                $('#text-button').click();
            }
        });

        $('.square').on('click', function(e) {
            if(element_id !== null) {
                var row = $(this).data('row');
                var col = $(this).data('col');

                console.log('Square selected: ['+row+','+col+']');
            }
        });
    },

    toggleFinishButton: function(value) {
        if(value) {
            $('#finish-button').show();
            $('#camera-button').css('right', '80px');
        } else {
            $('#finish-button').hide();
            $('#camera-button').css('right', '0px');
        }
    },

    newGrid: function(n) {
        $(".square").remove();

        var distance = 0;
        var jumpline = 0;
        for (var k = 0; k < n; k++) {
            for (var i = 0; i < n; i++) {
                $(".workspace-grid").append($("<div></div>").data('row', i).data('col', k).addClass("square").height(56).width(128).css({'marginLeft': distance + 'px', 'marginTop': (jumpline * 58) + 'px'}));
                distance += 128;
            }

            distance = 0;
            jumpline++;
        }
    }
};

app.initialize();

function onGridPan(e, panzoom) {
    e.preventDefault();
    /*
    var transform = $('.workspace-grid').css('transform').slice(7, -1).split(',');

    var maxX = 683,
        minX = -2851,
        maxY = 683,
        minY = -856;

    if(parseInt(transform[0]) < 1) {
        maxX = 542;
        minX = -892;
        maxY = 604;
        minY = 19;
    } else if(parseInt(transform[0]) > 1) {
        maxX = 968;
        minX = -6667;
        maxY = 847;
        minY = -2554;
    }

    if(parseInt(transform[4]) > maxX)
        transform[4] = maxX
    else if(parseInt(transform[4]) < minX)
        transform[4] = minX

    if(parseInt(transform[5]) > maxY)
        transform[5] = maxY
    else if(parseInt(transform[5]) < minY)
        transform[5] = minY

    $('.workspace-grid').css('transform', 'matrix('+transform[0]+', 0, 0, '+transform[3]+', '+transform[4]+', '+transform[5]+')');
    */
}