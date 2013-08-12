(function( $ ){
    
    /* Plugin handlers and settings.*/
    var settings ={
            refreshContent : '.refresh-content',
            contentWrapper : '.content-wrapper',
            isLoading      : false
    };
        
            
    $.pullRefreshDone = function(){
        var elem = $(settings.refreshContent),
            h    = elem.height();

        elem.animate({ height: 0 }, 600, function () {
            elem.css({"position":'absolute', "height":h});
        });
    }
    
	$.fn.pullRefresh = function( params ) {
        
        var container    = $(this),
            content      = $(settings.contentWrapper),
            handle       = $(settings.refreshContent),
			handleHeight = handle.height(),
            isLoading    = true,
            params       = params || {};
        
            /* Push content up 1px to let you scroll down initially  */
			content.on('touchstart', function () {
                
                if (container.scrollTop() == 0) {
                    container.scrollTop(1);
				}
			}).on('touchmove', function () {
                var topPos =  container.scrollTop();
                if(topPos<0){
                    handle.css("position",'static');
                    isLoading = true;
                }
                
			}).on('touchend', function() {
                var topPos =  container.scrollTop();
                if(topPos>0 && !isLoading){
                    return;
                }
                
                if(params.callback && topPos<0){
                    /* Handle Async Callback  */     
                     if (typeof params.callback.then === "function") {
                        var callback = params.callback();
                        callback.done(function(){    
                           $.pullRefreshDone();
                            isLoading = false;                                           
                        });
                    }
                    else{ 
                    /* Handle normal Callback  (Set timeout is not needed, uncomment to simulate server request) */
                        setTimeout(function(){
                            params.callback();
                            $.pullRefreshDone();
                            isLoading = false;
                        },3000);
                        
                    }
                    
                }
			});
	};
})( jQuery );