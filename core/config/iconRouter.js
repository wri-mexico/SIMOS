define(function(){
    var sprite = {
		//base router from sprite
		zoologico:'zoologico',
		hospital:'hospital',
		iglesia:'iglesia',
		escuela:'escuela',
		ccomercial:'ccomercial',
		departamental:'departamental',
		autobus:'autobus',
		historico:'historico',
		hotel:'hotel',
		museo:'museo',
		restaurant:'restaurant',
		
		gasolinera:'gasolinera',
		
		banco:'banco',
		
		aeropuerto:'aeropuerto',
		
		edo:'edo',
		mun:'mun',
		loc:'loc',
		locurb:'loc-urb',
		ageb:'ageb',
		col:'col',
		mzn:'mzn',
		calle:'calle',
		dom:'dom',
		dom2:'dom2',
		hidro:'hidro',
		geodesia:'geodesia',
		oro:'oro',
		
		//router class
		entidadfederativa:'edo',
		localidad:'loc',
		localidadurbana:'loc',
		localidadrural:'loc-urb',
		municipio:'mun',
		rasgoshidrograficos:'hidro',
		rasgosorograficos:'oro',
		domicilio:'dom',
		calles:'calle',
		colonia:'col',
		manzana:'mzn',
		marcasgeodesicas:'geodesia',
		restaurante:'restaurant',
		tiendadepartamental:'departamental',
		sitiohistorico:'historico',
		centraldeautobuses:'autobus',
		supermercado:'ccomercial',
		layer:'layer',
		
	}
    var getIcon = function(text){
        var icon = '';
        var list = sprite;
        if (!(list[text] === undefined)){
            icon = 'mainSprite mainSprite-icon-'+list[text];
        }else{
            icon = 'mainSprite mainSprite-icon-loc-urb';
        }
        return icon;
    }
    return {list:sprite,getIcon:getIcon};
})