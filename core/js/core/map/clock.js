define(function() {
     
    function Timer(){//time,funcion,valuation,active
        var a = arguments[0];
        this.active = ((a[3]==undefined)||(a[3]==null))?true:a[3];
        this.valuation = a[2] || true;        
        this.time = a[0] || 100;
        this.funcion = a[1];
        this.setTime = function(totalTime){
            this.time = totalTime;
        };
        this.clear = function(){
            clearTimeout(this.timer);
        };
        this.activate = function(){
                this.active = true;
        };
        this.deactivate = function(){
                this.active = false;
        };
        this.timer = null
        this.execute = function(){
            var obj = this;
            if(obj.active){
                if(obj.timer!=null){
                    obj.clear();
                }
                obj.timer = setTimeout(function(){
                    obj.funcion();
                },obj.time);
            }
        };
    };
    
    var get = function(){
        return new Timer(arguments);
    };

    return{
        define:get
    };
});