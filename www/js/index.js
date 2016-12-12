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

var scale = 1;
var init_posX = (30*32 - $(window).width())/-2;
var init_posY = (30*32 - $(window).height())/-2;

var workspace = {
    initialize: function() {
        text_displayed = false;
        this.newGrid(32);
        elements_ongrid = [];
        element_id = null;

        interact('.workspace-grid')
        .draggable({
            inertia: true,
            onmove: workspace.dragMoveListener
        })
        .gesturable({
            onmove: function (event) {
                scale = scale * (1 + event.ds);
                scale = scale < 1 ? Math.max(scale, .8) : Math.min(scale, 1.2);
                workspace.dragMoveListener(event);
            }
        });
        
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
            var workspaceElement = document.getElementsByClassName('workspace-grid')[0];
            scale = 1;

            workspaceElement.style.webkitTransform =
            workspaceElement.style.transform =
              'translate(' + init_posX + 'px, ' + init_posY + 'px)';

            workspaceElement.setAttribute('data-x', init_posX);
            workspaceElement.setAttribute('data-y', init_posY);
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

        $('#camera-button').click();
    },

    dragMoveListener: function(event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
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
        var size = 30;

        for (var k = 0; k < n; k++) {
            for (var i = 0; i < n; i++) {
                $(".workspace-grid").append($("<div></div>").data('row', i).data('col', k).addClass("square").height(size).width(size).css({'marginLeft': distance + 'px', 'marginTop': (jumpline * size) + 'px'}));
                distance += size;
            }

            distance = 0;
            jumpline++;
        }
    }
};

app.initialize();