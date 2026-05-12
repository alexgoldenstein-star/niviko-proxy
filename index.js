const express=require('express');
const cors=require('cors');
const fetch=require('node-fetch');
const app=express();
app.use(cors({origin:'*'}));
app.use(express.json({limit:'20mb'}));
app.use(express.urlencoded({extended:true,limit:'20mb'}));
app.use(express.urlencoded({extended:true}));
app.use((_,res,next)=>{res.set('Cache-Control','no-store');next();});

const ML='https://api.mercadolibre.com';
const AUTH='https://api.mercadolibre.com/oauth/token';
const CORD={1:3330,2:5355,3:6600};
const ZONA={"11 de septiembre":3,"9 de abril":3,"abasto":3,"acassuso":2,"adolf sourdeaux":3,"adrogue":3,"adrogué":3,"aeropuerto ezeiza":3,"aeropuerto internacional ezeiza":3,"alberti pilar":3,"aldo bonzi":3,"alejandro korn":3,"almirante brown":3,"almirante brown san josé":3,"alto los cardales":3,"altos de san lorenzo":3,"argentina":3,"arturo segui":3,"avellaneda":2,"avellaneda dock sud":2,"avellaneda m":2,"banfield":2,"banfield (villa centenario)":2,"banfield barrio sitra":2,"barrio el cazador":3,"barrio san josé (almirante brown)":3,"beccar":2,"béccar":2,"belén de escobar":3,"bella vista":3,"bella vista san miguel":3,"benavidez":3,"benavídez":3,"berazategui":3,"berazategui (barrio gutierrez)":3,"berazategui oeste":3,"berisso":3,"bernal":3,"bernal este":3,"bernal oeste":3,"billinghurst":3,"bosques":3,"boulogne":2,"boulogne sur mer":2,"brerazategui":3,"bs as":3,"buenos aire":3,"buenos aires":3,"buenosaires":3,"bulogne":2,"burzaco":2,"c. a. el pato":3,"campana":3,"campana bo. las lomadas":3,"campo de mayo":3,"canning":3,"canning ezeiza":3,"canning-e. echeverria":3,"cañuelas":3,"carapachay":2,"carlos spegazzini":3,"caseros":2,"castelar":2,"castelar sur":2,"centro agricola el pato":3,"centro agrícola el pato":3,"chilavert":2,"city bell":3,"ciudad del libertador general san martin":2,"ciudad evita":2,"ciudad jardín":3,"ciudad jardin del palomar":3,"ciudad jardín lomas del palomar":3,"ciudad madero":2,"ciudadela":2,"claypole":2,"crucesita":3,"cuartel v":3,"cuidad evita":2,"del viso":3,"dique lujan":3,"dique luján":3,"dique lujan tigre":3,"dock sud":3,"dock sud avellaneda":3,"don bosco":3,"don torcuato":3,"el jaguel":3,"el jagüel":3,"el palomar":2,"el palomar- moron":2,"el pato":3,"el pato berazategui":3,"el pato, berazategui.":3,"el talar":3,"enrique hudson":3,"ensenada":3,"escobar":3,"espeleta":3,"esteban echeverría":3,"esteban echeverria-canning":3,"estevan echeverria":3,"ezeiza":3,"ezeiza barrio vecinal":3,"ezeiza centro":3,"ezeiza tristan suarez":3,"ezpeleta":3,"ezpeleta este":3,"ezpeleta oeste":3,"ezpeleta, quilmes":3,"ezpeleta/quilmes":3,"fatima":3,"florencio varela":3,"florencio varela barrio luján":3,"florencio varela ingeniero allan":3,"florencio varela martin fierro":3,"florida":2,"florida oeste":2,"florida oeste - munro":2,"francisco alvarez":3,"francisco álvarez":3,"garín":3,"gdl":3,"general pacheco":3,"general pacheco ( barrio las tunas)":3,"general rodríguez":2,"general san martin":2,"general san martín":2,"gerli":2,"glew":3,"glew gendarmeria":3,"gonnet":3,"gonzalez catal":3,"gonzalez catan":3,"gonzález catan":3,"gonzález catán":3,"gral pacheco":3,"gral san martin":2,"gral san martín- billinghurst":2,"grand bourg":3,"grand bourg ( buenos aires)":3,"grandbourg":3,"gregorio de laferrere":3,"guernica":3,"guernica barrio privado el rebenque":3,"guernica, presidente peron":3,"guillermo e hudson":3,"guillermo e. hudson":3,"guillermo hudson":3,"guillermo hudson. barrio maritimo":3,"haedo":2,"hudson":3,"hudson sarmiento":3,"hurlingham":2,"hurlinghan":2,"ing. adolfo sourdeaux":2,"ingeniero adolfo sourdeaux":3,"ingeniero allan":3,"ingeniero budge":3,"ingeniero maschwitz":3,"ingeniero maschwitz (escobar)":3,"isidro casanova":3,"ituzaingi":2,"ituzaingo":2,"ituzaingó":2,"ituzaingo - villa udaondo":2,"ituzaingo centro":3,"j448rm zelaya, provincia de buenos aires":3,"jauregui":3,"jáuregui josé maría":3,"jose c paz":3,"jose c paz barrio vucetich":3,"josé c. paz":3,"jose clemente paz":3,"josé clemente paz":3,"josé ingenieros":3,"jose leon suarez":2,"josé león suarez":2,"josé león suárez":2,"jose marmol":3,"josé marmol":3,"josé mármol":3,"jose marnol":3,"josé.c.paz":3,"juan maria gutierrez":3,"juan maría gutiérrez":3,"la florida":2,"la lonja":3,"la lonja,pilar":3,"la lucila":2,"la matanza":3,"la plata":3,"la plata / gonnet":3,"la plata- los hornos":3,"la plata ringuelet":3,"la quebrada":2,"la reja":3,"la tablada":2,"la union":2,"la unión":3,"la unión - ezeiza":2,"la unión ezeiza":3,"la unión, ezeiza":3,"laferrere":2,"lagomarsino":3,"lanus":2,"lanús":2,"lanus - gerli":2,"lanus este":2,"lanús este":2,"lanus este, monte chingolo":2,"lanus oeste":2,"lanús oeste":2,"lavallol":2,"libertad":2,"libertad merlo gomez":2,"lisandro olmos":3,"llavallol":3,"loma del mirador (villa insuperable)":2,"loma hermosa":2,"loma hermosa san martín":2,"lomas de zamora":2,"lomas de zamora. villa fiorito":2,"lomas del mirador":2,"lomasdezamora":2,"longchamps":3,"los hornos":3,"los polvorines":3,"los troncos":3,"los troncos del talar pacheco":3,"luis guillon":3,"luján":3,"malvinas argentinas":3,"malvinas argentinas adrogue":3,"manuel alberdi":3,"manuel alberti":3,"manuel b gonnet":3,"manzanares":3,"maquinista f savio":3,"maquinista savio":3,"marcos paz":3,"mariano acosta":3,"marilo":3,"martin coronado":2,"martín coronado":2,"martinez":2,"martínez":2,"matheu":3,"melchor romero":3,"merlo":3,"merlo pontevedra":3,"monte chingolo":3,"monte grande":3,"monte grande .barrio grande":3,"montegrande":3,"moreno":3,"moreno  country san diego":2,"moreno centro":3,"moreno la reja cortejarena":3,"moreno trujui":3,"moreno trujuy villanueva":3,"moron":2,"morón":2,"munro":2,"muñiz":3,"nordelta":3,"nordelta barrio el palmar":3,"olivos":2,"open door":3,"pablo nogues":3,"pablo nogués":3,"pablo podesta":3,"pablo podestá":3,"pacheco":3,"palomar":2,"parque leloir":3,"parque san martin":2,"paso del rey":2,"pilar":3,"piñeyro":2,"platanos":2,"pontevedra":2,"presidente derqui":3,"presidente perón":3,"primero de mayo 832":3,"punta lara":3,"purtos de escobar":3,"quilmes":3,"quilmes oeste":3,"rafael calzada":3,"rafael castillo":3,"ramos meja":2,"ramos mejia":2,"ramos mejía":2,"ranelagh":3,"remedio de escalada":2,"remedios de escalada":2,"ricardo rojas":3,"ricardo rojas (tigre)":3,"rincon de milberg":3,"rincón de milberg":3,"saenz pena":2,"saenz peña":2,"sáenz peña":2,"san andres":2,"san andrés":2,"san antonio de padua":3,"san damian":3,"san fco.solano":3,"san fernando":3,"san francisco solano":3,"san isidro":2,"san isidro - boulogne":2,"san jose":3,"san justo":2,"san martin":2,"san martín":2,"san martin lanzone":2,"san miguel":3,"san miguel arcángel":3,"san vicente":3,"sanmartin":2,"santa maria":3,"santa rosa":3,"santos lugares":2,"sarandi":2,"sarandí":2,"sarandí avellaneda":2,"sol y verde":3,"solano":3,"sourigues":3,"st thomas este oeste":3,"tablada":3,"talar bro. alte. brown":3,"talar tigre":3,"tapiales":3,"temperley":2,"tierras altas":3,"tigre":3,"tigre, rincón de milberg":3,"tolosa":3,"tres de febrero":2,"tres de febrero-saenz peña":2,"tristan suarez":3,"tristán suarez":3,"tristán suárez":3,"troncos del talar":2,"trujui":3,"trujui moreno":3,"trujuy moreno":3,"turdera":2,"turdera lomas de zamora":3,"v dominico":3,"v luzuriaga":3,"valentin alsina":3,"valentín alsina":2,"valentin alsina, lanus oeste":2,"vicente lopez":2,"vicente lópez":2,"vicente lópez carapachay":2,"victoria":2,"villa adelina":2,"villa ballester":2,"villa bosch":3,"villa bosch (estación juan maría bosch)":2,"villa celina":2,"villa centenario":3,"villa de mayo":3,"villa dominico":3,"villa domínico":3,"villa elisa":3,"villa españa":3,"villa fiorito":2,"villa gobernador udaondo":3,"villa la florida":3,"villa luzuriaga":3,"villa lynch":2,"villa madero":2,"villa maipu":2,"villa maipú":2,"villa martelli":2,"villa mertelli":2,"villa raffo":2,"villa rosa":3,"villa sáenz peña":3,"villa santos tesei":2,"villa sarmiento":3,"villa tesei":2,"villa tesey":2,"villa tessei":2,"villa vatteone":3,"virrey del pino":3,"virreyes":3,"wilde":2,"wilde avellaneda":3,"william c. morris":3,"william morris":3,"zárate":3,"zeballos":3,"zelaya":3,"lomchamps":3,"gonzáles catan":3,"dique luján":3,"garin":3,"alejandro petión":3,"ringuelet":3,"san isidro martinez":3,"los cardales":3,"plátanos":3,"malvinas argentinas barrio la cabana":3,"jauregui josé maria":3,"campana los pioneros":3,"el sol":3,"de vicenzo grande":3,"pacheco tigre buenos aires":3,"san carlos":3,"quimes oeste":3,"c.a.b.a.":1,"san antonio de paua":3,"la reja - moreno":3,"pilar del este":3,"villa udaondo":2,"marti coronado":2,"avellaneda, dock sud":2,"once":1,"loma verde":2,"fátima":3,"luis guillón":3,"villa astolfi":3,"maswhitz":3,"maschwitz":3,"pilar_ villa rosa":3,"manuel b. gonnet":2,"arturo seguí":2,"caba":1,"el triángulo":3,"ballester":2,"baradero":3,"villa verde":3,"pueblo nuevo":3,"merlo-pontevedra":3,"barrio los jazmines -villa rosa - pilar":3,"lanus oeste, valentin alsina":3,"merlo san antonio de padua":3,"máximo paz":3,"general rodrigez":3,"monte grande.":3,"el encuentro":3,"ángel etcheverry":3,"kilometro 61":3,"belen de escobar":3,"villa numancia":3,"ciudadela /  localidad jose ingeniero":3,"ituzaingo norte":3,"santa maría":3,"melchor romeros":3,"campana villanueva":3,"billinghurst  san martín":3,"marcos paz b el zorzal":3,"villa bonich":3,"maximo paz":3,"josé hernández":2,"gobernador costa":3,"villa rosa pilar":3,"joaquín gorina":3,"villa elvira":2,"lomasde zamora,fiorito":2};
const PRODS=[{"sku":"15-FD0095WM","desc":"NOTEBOOK HP","usd":300.0,"ars":420000,"iva":21,"pub":true},{"sku":"29P387","desc":"Inflador De Pie Jilong 38 Cm Pileta, Pelota Colchon Inflable Color Negro","usd":2.0,"ars":2800,"iva":21,"pub":true},{"sku":"29P390","desc":"Inflador Doble Accion 30cm Pileta Pelota Colchon Inflable Color Negro","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"37213","desc":"Ballena Gigante Inflable Flotador Jilong Pileta Para Agua","usd":3.5,"ars":4900,"iva":21,"pub":true},{"sku":"37262","desc":"Flotador Bebé Asiento Jilong Kiddie Salvavidas Pileta 2-4 Años","usd":3.5,"ars":4900,"iva":21,"pub":true},{"sku":"37275","desc":"Colchoneta Flotadora Sillon Con Techo Red Inflable Jilong","usd":8.0,"ars":11200,"iva":21,"pub":true},{"sku":"37342","desc":"Colchoneta Flotadora Jilong Inflable Aro Frutilla Grande","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"37346","desc":"INFLABLE JILONG","usd":12.0,"ars":16800,"iva":21,"pub":true},{"sku":"37347","desc":"Colchoneta Inflable Media Sandía 180cm Para Pileta Flotador","usd":9.0,"ars":12600,"iva":21,"pub":true},{"sku":"37348","desc":"Colchoneta Flotadora Inflable Jilong Anana Piña Gigante","usd":9.4,"ars":13160,"iva":21,"pub":true},{"sku":"37351","desc":"Colchoneta Flotadora Jilong Inflable Palito Paleta Helado","usd":6.35,"ars":8890,"iva":21,"pub":true},{"sku":"37423","desc":"Colchoneta Flotadora Inflable Jilong Paleta Lolli Pop Multicolor","usd":7.5,"ars":10500,"iva":21,"pub":true},{"sku":"37425","desc":"Colchoneta Flotadora Jilong Inflable Papas Fritas Mc Burger","usd":8.1,"ars":11340,"iva":21,"pub":true},{"sku":"37426","desc":"Colchoneta Flotadora Jilong Inflable Cactus","usd":7.5,"ars":10500,"iva":21,"pub":true},{"sku":"37428","desc":"Colchoneta Flotadora Jilong Inflable Unicornio Gigante Blanco","usd":29.4,"ars":41160,"iva":21,"pub":true},{"sku":"37430","desc":"Colchoneta Flotadora Jilong Inflable Pelicano Gigante","usd":14.75,"ars":20650,"iva":21,"pub":true},{"sku":"6004-","desc":"Tendedero Tender Slim Mor Compact, Retráctil Y Reforzado Sin Alas Color Blanco","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"6005","desc":"Tender Para Ropa Mor  Plegable Acero Color Blanco","usd":6.0,"ars":8400,"iva":21,"pub":true},{"sku":"6104","desc":"Tender Para Ropa Mor 6104 Plegable Acero Color Blanco","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"6608","desc":"Coche Bebe Recién Nacido Paseo Cuna Paraguita","usd":35.0,"ars":49000,"iva":21,"pub":true},{"sku":"6920388616164","desc":"CENTRO DE JUEGOS INFLABLE JILONG","usd":21.0,"ars":29400,"iva":21,"pub":true},{"sku":"7220","desc":"Salvavidas Jilong Bote Para Chicos Pileta 100 X 70 Cm","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"82QD00DHUS","desc":"NOTEBOOK LENOVO","usd":300.0,"ars":420000,"iva":21,"pub":true},{"sku":"8629","desc":"Coche Bebe Recién Nacido Paseo Cuna Mecedor 3 Pos Toing","usd":45.0,"ars":63000,"iva":21,"pub":true},{"sku":"97224","desc":"Centro De Juego C/ Tobogan Y Tiro Aro Inflable Pileta Jilong","usd":18.95,"ars":26530,"iva":21,"pub":true},{"sku":"A-5120","desc":"RELOJ SMARTWATCH","usd":2.6,"ars":3640,"iva":21,"pub":true},{"sku":"A-6700-B","desc":"AURICULARES IN EAR","usd":2.8,"ars":3919,"iva":21,"pub":true},{"sku":"A-6700-N","desc":"AURICULARES IN EAR","usd":2.8,"ars":3919,"iva":21,"pub":true},{"sku":"A6S","desc":"Auriculares In-ear Inalámbricos Bluetooth A6s Negro Zhome","usd":2.8,"ars":3919,"iva":21,"pub":true},{"sku":"Araguaia","desc":"Parrilla Móvil Mor Araguaia 44cm De Ancho 75cm De Alto 72cm De Profundidad Negra","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"AUSTIN","desc":"Silla de Oficina Austin Negra","usd":22.0,"ars":30800,"iva":21,"pub":true},{"sku":"BOSTON-B","desc":"Silla De Oficina Escritorio Ejecutiva Lumba Zhome Color Negro Y Blanco Material Del Tapizado Mesh Z-2106-b","usd":26.0,"ars":36400,"iva":21,"pub":true},{"sku":"Boston-N","desc":"Silla Sillon Oficina Gerencial Smart Tech Ws6119 Color Negro Material Del Tapizado Cuero Sintético","usd":25.0,"ars":35000,"iva":21,"pub":true},{"sku":"DORAL","desc":"Silla De Oficina Alta Escritorio Ejecutiva Gerencial Zhome Color Gris Material Del Tapizado Mesh","usd":53.0,"ars":74200,"iva":21,"pub":true},{"sku":"DORAL-N","desc":"Silla De Oficina Alta Escritorio Ejecutiva Gerencial Zhome Color Negro Material Del Tapizado Mesh","usd":50.0,"ars":70000,"iva":21,"pub":true},{"sku":"DORAL-SB","desc":"Silla De Oficina Alta Escritorio Ejecutiva Gerencial Zhome Color Blanco Material Del Tapizado Mesh","usd":53.0,"ars":74200,"iva":21,"pub":true},{"sku":"DS-2CD1023G0E-I","desc":"CAMARA DE SEGURIDAD HIKVISION","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"DT70/32GB","desc":"Pendrive Kingston Datatraveler 70 Dt70 32gb 3.2 Gen 1 Tipo C","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"DTX/64GB","desc":"Pendrive Kingston Datatraveler Exodia Dtx/64 64gb 3.2 Gen Color Negro","usd":3.4,"ars":4760,"iva":21,"pub":true},{"sku":"DTXM/128GB","desc":"Pendrive Unidad Flash Kingston Datatraveler Exodia M De 128 Gb Dtxm 3.2 Color Rojo","usd":6.0,"ars":8400,"iva":21,"pub":true},{"sku":"F9-5","desc":"Auriculares Inalámbricos Tws F9-5 Plus","usd":2.0,"ars":2800,"iva":21,"pub":true},{"sku":"FITACTPROBK","desc":"Auriculares In-ear Inalámbricos Bluetooth Iluv Fit Active","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"FITACTPROMT","desc":"Auriculares In-ear Inalámbricos Bluetooth Iluv Fit Active Color Verde","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"FITACTPROWH","desc":"Auriculares In-ear Inalámbricos Bluetooth Iluv Fit Active Color Blanco","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"GE-V09","desc":"Cassette Limpia Cabezal De Video Vhs Seco Humedo Con Liquido","usd":0.01,"ars":14,"iva":21,"pub":true},{"sku":"KF432C16BB/8","desc":"MEMORIA RAM","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"KF432C16BBA/8","desc":"Memoria Ram Fury Beast Ddr4 Rgb Color Negro 8gb 1 Kingston","usd":20.0,"ars":28000,"iva":21,"pub":true},{"sku":"kl21g-44t","desc":"Soporte De Tv Led Lcd C/ Inclinación 32 37 39 40 42 49 50 55","usd":4.0,"ars":5600,"iva":21,"pub":true},{"sku":"KL22-22F","desc":"Soporte Universal Fijo De Tv Led Lcd Zhome 14 23 24 32 40 45 Negro","usd":1.05,"ars":1470,"iva":21,"pub":true},{"sku":"kl22-22t","desc":"Soporte Universal Fijo Tv Inclinación Led Lcd 23 24 32 40 42 Zhome Color Negro","usd":1.7,"ars":2380,"iva":21,"pub":true},{"sku":"kl22-44f","desc":"Soporte Vt-bracket Kl22-44f De Pared Para Tv/monitor De 55 Color Negro","usd":1.8,"ars":2520,"iva":21,"pub":true},{"sku":"kl22-44t","desc":"Soporte Universal Fijo De Tv Led Lcd 32 37 39 40 42 49 50 55 Zhome Color Negro","usd":2.0,"ars":2800,"iva":21,"pub":true},{"sku":"KL22G-22F","desc":"Soporte Universal Fijo Tv Led Lcd 23 24 32 40 42 Zhome Color Negro","usd":1.0,"ars":1400,"iva":21,"pub":true},{"sku":"KL22G-22T","desc":"Soporte Universal Fijo Tv Inclinación Led Lcd 23 24 32 40 42 Zhome Color Negro","usd":1.7,"ars":2380,"iva":21,"pub":true},{"sku":"KL22G-44F","desc":"Soporte Universal Fijo De Tv Led Lcd 32 37 39 40 42 49 50 55 Zhome Color Negro","usd":1.8,"ars":2520,"iva":21,"pub":true},{"sku":"KL22G-44T","desc":"Soporte Universal Fijo De Tv Led Lcd 32 37 39 40 42 49 50 55 Zhome Color Negro","usd":2.0,"ars":2800,"iva":21,"pub":true},{"sku":"KL22G-64F","desc":"Soporte Universal Fijo De Tv Led Lcd Zhome 37 40 42 49 50 55 65 70 Color Negro","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"KL22G-64T","desc":"Soporte De Tv Universal Fijo De Pared Con Inclinación Lcd Led Smart 37 42 50 55 65 70 Niviko Color Negro","usd":3.2,"ars":4480,"iva":21,"pub":true},{"sku":"LPA68-221","desc":"Soporte De Tv Led Lcd Brazo Extensible 23 24 32 40 42 Niviko","usd":4.2,"ars":5880,"iva":21,"pub":true},{"sku":"LPA68-441","desc":"Soporte De Tv Universal Led Lcd Brazo 23 24 32 40 42 50 55","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"LPA68-443","desc":"Soporte De Tv De Pared Con Brazo Articulado Movil Led Lcd Smart Niviko 32 37 40 42 49 50 55 Soporta 35 Kg Color Negro","usd":9.5,"ars":13300,"iva":21,"pub":true},{"sku":"LPA78-443","desc":"Soporte De Tv Universal De Pared Niviko Led Lcd Smart 32 37 40 42 49 50 55 Movil Brazo 35 Kg Color Negro","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"m3007","desc":"Parrilla Portátil Carbón Balcon Mor","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"M3009","desc":"Parrilla Portatil Camping Mor Amazonas Estructura Acero","usd":20.0,"ars":28000,"iva":21,"pub":true},{"sku":"M3011","desc":"Parrilla Portátil Carbón Balcon Mor California Plegable Mesa","usd":15.0,"ars":21000,"iva":21,"pub":true},{"sku":"M6021","desc":"TENDER PLEGABLE EXTENSIBLE","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"M6022","desc":"TENDER PLEGABLE EXTENSIBLE","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"m6023","desc":"Tendedero Tender Mor De Pared Ropa Plegable 1,2 Metros Acero","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"M6045","desc":"Tender De Piso Ropa Aluminio Slim Mor 6045 Color Aluminio Mor","usd":8.0,"ars":11200,"iva":21,"pub":true},{"sku":"Montana","desc":"Parrilla Portátil Carbón Balcon Mor","usd":6.0,"ars":8400,"iva":21,"pub":true},{"sku":"NVK-007-B-X4","desc":"Silla Living Comedor Cocina Nordica Niviko Plastica Set X4 Estructura De La Silla Marrón Claro Asiento Blanco Diseño De La Tela Blanco","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-007-N-X4","desc":"Silla Living Comedor Cocina Nordica Niviko Plastica Set X4 Estructura De La Silla Marrón Claro Asiento Negro Diseño De La Tela Negro","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-008-B-X4","desc":"Set 4 Silla Sillon Niviko Dublin Plastica Living Comedor Cocina Color Blanco Con Patas Marrón Claro","usd":90.0,"ars":126000,"iva":21,"pub":true},{"sku":"NVK-008-N-X4","desc":"Silla Sillon Living Comedor Cocina Niviko Plastica Set X4 Estructura De La Silla Marrón Claro Asiento Negro Diseño De La Tela Negro","usd":90.0,"ars":126000,"iva":21,"pub":true},{"sku":"NVK-011-B","desc":"Silla Living Comedor Cocina Tulip Eames Almohadón Niviko X4 Estructura De La Silla Marrón Claro Asiento Blanco Diseño De La Tela Cuerina","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-011-N","desc":"Silla Living Comedor Cocina Tulip Eames Almohadón Niviko X4 Estructura De La Silla Marrón Claro Asiento Negro Diseño De La Tela Cuerina","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-011-NX6","desc":"Silla Living Comedor Cocina Tulip Eames Almohadón Niviko X6 Estructura De La Silla Marrón Claro Asiento Blanco Diseño De La Tela Cuerina","usd":60.0,"ars":84000,"iva":21,"pub":true},{"sku":"NVK-033-B-X4","desc":"Silla Living Comedor Cocina Windsor Niviko X4 Estructura De La Silla Marrón Claro Asiento Blanco","usd":60.0,"ars":84000,"iva":21,"pub":true},{"sku":"NVK-033-B-X6","desc":"Silla Living Comedor Cocina Windsor Niviko X6 Estructura De La Silla Marrón Claro Asiento Blanco","usd":60.0,"ars":84000,"iva":21,"pub":true},{"sku":"NVK-033-N-X4","desc":"Silla Living Comedor Cocina Windsor Niviko X4 Estructura De La Silla Marrón Claro Asiento Negro","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-097-G","desc":"Silla De Oficina Alta Escritorio Ejecutiva Lino Gris Niviko","usd":22.0,"ars":30800,"iva":21,"pub":true},{"sku":"NVK-097-N","desc":"Silla De Oficina Alta Escritorio Ejecutiva Negra Niviko Color Negro","usd":20.0,"ars":28000,"iva":21,"pub":true},{"sku":"NVK-117-B-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Reforzada Niviko","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"nvk-117-bx6","desc":"Silla Living Comedor Cocina Set X6 Tapizada Niviko Reforzada Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Cuero Sintético","usd":66.0,"ars":92400,"iva":21,"pub":true},{"sku":"NVK-117-B-x6","desc":"Silla Living Comedor Cocina Set X6 Tapizada Reforzada Niviko","usd":66.0,"ars":92400,"iva":21,"pub":true},{"sku":"NVK-117-N-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Reforzada Niviko","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-120-B-X4","desc":"Silla Niviko Living Comedor Jardin Set X4 Plastica Apilable Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Polipropileno","usd":56.0,"ars":78400,"iva":21,"pub":true},{"sku":"NVK-120-N-X4","desc":"Silla Niviko Living Comedor Jardin Set X4 Plastica Apilable Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Polipropileno","usd":56.0,"ars":78400,"iva":21,"pub":true},{"sku":"NVK-1428-G-X4","desc":"Silla Living Comedor Set X4 Tela Tapizada Niviko Diseño Estructura De La Silla Marrón Claro Asiento Gris Diseño De La Tela","usd":72.0,"ars":100800,"iva":21,"pub":true},{"sku":"NVK-1428-N-X4","desc":"Silla Living Comedor Set X4 Tela Tapizada Niviko Diseño Estructura De La Silla Marrón Claro Asiento Negro","usd":72.0,"ars":100800,"iva":21,"pub":true},{"sku":"NVK-1516-B-X2","desc":"Silla Living Comedor Cocina Set X2 Tapizada Niviko Reforzada","usd":50.0,"ars":70000,"iva":21,"pub":true},{"sku":"NVK-1516-N-X2","desc":"Silla Living Comedor Cocina Set X2 Tapizada Niviko Reforzada","usd":50.0,"ars":70000,"iva":21,"pub":true},{"sku":"NVK-1614-B-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Cuero Sintético","usd":52.0,"ars":72800,"iva":21,"pub":true},{"sku":"nvk-1614-bx6","desc":"Silla Living Comedor Cocina Set X6 Tapizada Niviko Reforzada Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Cuero Sintético","usd":84.0,"ars":117600,"iva":21,"pub":true},{"sku":"NVK-1614-N-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Negro Asiento Negro Diseño De La Tela Cuero Sintético","usd":52.0,"ars":72800,"iva":21,"pub":true},{"sku":"NVK-1614-N-X6","desc":"Silla Living Comedor Cocina Set X6 Tapizada Niviko Reforzada Estructura De La Silla Negro Asiento Negro Diseño De La Tela Cuero Sintético","usd":84.0,"ars":117600,"iva":21,"pub":true},{"sku":"NVK-1812-GO-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Negro Asiento Gris Oscuro Diseño De La Tela Terciopelo","usd":120.0,"ars":168000,"iva":21,"pub":true},{"sku":"NVK-1824-G-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Gris Asiento Gris Diseño De La Tela Cuero Sintético","usd":120.0,"ars":168000,"iva":21,"pub":true},{"sku":"NVK-1939-GC-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Negro Asiento Gris Diseño De La Tela Velvet","usd":41.2,"ars":57680,"iva":21,"pub":true},{"sku":"NVK-1939-GO-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Estructura De La Silla Negro Asiento Gris Oscuro Diseño De La Tela Terciopelo","usd":41.2,"ars":57680,"iva":21,"pub":true},{"sku":"NVK-211A-B-X2","desc":"Taburete Banqueta Alta Set X2 Reforzada Metal Tolix Zhome Acabado De La Estructura Chapa Color Blanco","usd":24.0,"ars":33600,"iva":21,"pub":true},{"sku":"NVK-211A-B-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Metal Tolix Zhome Acabado De La Estructura Chapa Color Blanco","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-211A-G-X2","desc":"Taburete Banqueta Alta Set X2 Reforzada Zhome Metal Tolix Acabado De La Estructura Chapa Color Gris Oscuro","usd":24.0,"ars":33600,"iva":21,"pub":true},{"sku":"NVK-211A-N-X2","desc":"Taburete Banqueta Alta Set X2 Reforzada Zhome Tolix Metal Acabado De La Estructura Chapa Color Negro","usd":24.0,"ars":33600,"iva":21,"pub":true},{"sku":"NVK-211A-N-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Zhome","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-211A-R-X2","desc":"Taburete Banqueta Alta Set X2 Reforzada Zhome Metal Tolix Acabado De La Estructura Chapa Color Rojo","usd":24.0,"ars":33600,"iva":21,"pub":true},{"sku":"NVK-211A-R-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Zhome","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-211-B-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Niviko Acabado De La Estructura Laqueado Color Blanco","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-211-N-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Niviko Acabado De La Estructura Laqueado Color Negro","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-211-R-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Zhome","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-222","desc":"SILLA TOLIX POR UNIDAD","usd":12.75,"ars":17850,"iva":21,"pub":true},{"sku":"NVK22-22T","desc":"Soporte De Tv Led Lcd C/ Inclinación Zhome 15 23 32 40 42 Negro","usd":1.7,"ars":2380,"iva":21,"pub":true},{"sku":"NVK-222-B","desc":"Silla De Comedor Tolix De Hierro 4 Unidades Niviko Reforzada","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-BX2","desc":"Silla De Comedor Tolix Reforzada De Hierro 2 Unidades Niviko Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Metal","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-B-X2","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X2 Zhome","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-BX4","desc":"Silla De Comedor Tolix De Hierro 4 Unidades Niviko Reforzada","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-B-X4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Estructura De La Silla Blanco Asiento Blanco","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-BX6","desc":"Silla De Comedor Tolix De Hierro 6 Unidades Niviko Reforzada","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-B-X6","desc":"Silla De Comedor Tolix De Hierro 6 Unidades Niviko Reforzada","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-GX2","desc":"Silla De Comedor Tolix De Hierro 2 Unidades Niviko Reforzada","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-G-X2","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X2 Zhome","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-G-X4","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X4 Zhome","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-GX6","desc":"Silla De Comedor Tolix Reforzada De Hierro 6 Unidades Niviko Estructura De La Silla Gris Asiento Gris Diseño De La Tela Metal","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-G-X6","desc":"Silla De Comedor Tolix Reforzada De Hierro 6 Unidades Niviko Estructura De La Silla Gris Asiento Gris Diseño De La Tela Metal","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-NX2","desc":"Silla De Comedor Tolix De Hierro 2 Unidades Niviko Reforzada Estructura De La Silla Negro Asiento Negro Diseño De La Tela Metal","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-N-X2","desc":"Silla De Comedor Tolix De Hierro 2 Unidades Niviko Reforzada Estructura De La Silla Negro Asiento Negro Diseño De La Tela Metal","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-NX4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Estructura De La Silla Negro Asiento Negro","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-N-X4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Estructura De La Silla Negro Asiento Negro","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-NX6","desc":"Silla Manchester De Comedor Tolix De Hierro 6 Unidades Niviko Reforzada Estructura De La Silla Negro Asiento Negro Diseño De La Tela Metal","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-N-X6","desc":"Silla De Comedor Tolix Reforzada De Hierro 6 Unidades Niviko Estructura De La Silla Negro Asiento Negro Diseño De La Tela Metal","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK-222-RX2","desc":"Silla De Comedor Tolix De Hierro 2 Unidades Niviko Reforzada Estructura De La Silla Rojo Asiento Rojo Manchester","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-R-X2","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X2 Zhome","usd":25.5,"ars":35700,"iva":21,"pub":true},{"sku":"NVK-222-RX4","desc":"Silla De Comedor Tolix De Hierro 4 Unidades Niviko Reforzada Estructura De La Silla Rojo Asiento Rojo Manchester","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-R-X4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Estructura De La Silla Rojo Asiento Rojo Manchester","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-RX6","desc":"Silla De Comedor Tolix De Hierro 6 Unidades Niviko Reforzada","usd":76.5,"ars":107100,"iva":21,"pub":true},{"sku":"NVK22-44F","desc":"Soporte Universal Fijo De Tv Led Lcd  26 32 43 50 55 65 70","usd":1.8,"ars":2520,"iva":21,"pub":true},{"sku":"NVK22-44T","desc":"Soporte De Tv Led Lcd C/ Inclinación 32 37 39 40 42 49 50 55 Negro","usd":2.0,"ars":2800,"iva":21,"pub":true},{"sku":"NVK22-64F","desc":"Soporte Universal Fijo De Tv Led Lcd 32 43 50 55 65 70 75 85 Negro","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"NVK22-64T","desc":"Soporte De Tv Led Lcd C/ Inclinación 32 37 43 49 50 55 65 70 Negro","usd":3.2,"ars":4480,"iva":21,"pub":true},{"sku":"NVK22G-44T","desc":"Soporte De Tv Led Lcd C/ Inclinación 32 37 39 40 42 49 50 55 Color Negro","usd":1.96,"ars":2744,"iva":21,"pub":true},{"sku":"NVK22G-64T","desc":"Soporte De Tv Led Lcd C/ Inclinación 32 37 43 49 50 55 65 70 Negro","usd":3.2,"ars":4480,"iva":21,"pub":true},{"sku":"NVK-233-B-X2","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X2","usd":28.4,"ars":39760,"iva":21,"pub":true},{"sku":"NVK-233-B-X4","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro X4 Zhome","usd":56.8,"ars":79520,"iva":21,"pub":true},{"sku":"NVK-233-B-X6","desc":"Silla De Comedor Con Apoyabrazo Tolix X6 Reforzada De Hierro Zhome Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela Metal","usd":85.19999999999999,"ars":119279,"iva":21,"pub":true},{"sku":"NVK-233-G-X2","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X2","usd":28.4,"ars":39760,"iva":21,"pub":true},{"sku":"NVK-233-G-X4","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro X4 Zhome","usd":28.0,"ars":39200,"iva":21,"pub":true},{"sku":"NVK-233-G-X6","desc":"Silla De Comedor Con Apoyabrazo Tolix Zhome X6 Reforzada De Hierro Estructura De La Silla Gris Oscuro Asiento Gris Oscuro Diseño De La Tela Metal","usd":85.19999999999999,"ars":119279,"iva":21,"pub":true},{"sku":"NVK-233-N-X2","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X2","usd":28.4,"ars":39760,"iva":21,"pub":true},{"sku":"NVK-233-NX4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Estructura De La Silla Negro Asiento Negro","usd":56.8,"ars":79520,"iva":21,"pub":true},{"sku":"NVK-233-N-X4","desc":"Silla De Comedor Con Apoyabrazo Tolix Zhome X4 Reforzada De Hierro Estructura De La Silla Negro Asiento Negro Diseño De La Tela Metal","usd":56.8,"ars":79520,"iva":21,"pub":true},{"sku":"NVK-233-R-X2","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X2","usd":28.4,"ars":39760,"iva":21,"pub":true},{"sku":"NVK-233-R-X4","desc":"Silla De Comedor Con Apoyabrazo Tolix Reforzada De Hierro Zhome X4 Estructura De La Silla Rojo Asiento Rojo Diseño De La Tela Metal","usd":56.8,"ars":79520,"iva":21,"pub":true},{"sku":"NVK-233-R-X6","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X6","usd":85.19999999999999,"ars":119279,"iva":21,"pub":true},{"sku":"NVK-244A-B-X2","desc":"Banqueta Con Respaldo Tolix Alta Set X2 Reforzada Metal Zhome Acabado De La Estructura Chapa Color Blanco","usd":26.4,"ars":36960,"iva":21,"pub":true},{"sku":"NVK-244A-B-X4","desc":"Banqueta C/respaldo Alta Set X4 Reforzada Metal Tolix Zhome","usd":52.8,"ars":73920,"iva":21,"pub":true},{"sku":"NVK-244A-G-X4","desc":"Banqueta Con Respaldo Tolix Alta Set X2 Reforzada Metal Zhome Acabado De La Estructura Chapa Color Gris","usd":52.8,"ars":73920,"iva":21,"pub":true},{"sku":"NVK-244A-N-X2","desc":"Banqueta C/respaldo Alta Set X2 Reforzada Metal Tolix Zhome","usd":26.4,"ars":36960,"iva":21,"pub":true},{"sku":"NVK-244A-N-X4","desc":"Banqueta Con Respaldo Alta Set X4 Reforzada Metal Tolix Zhome Acabado De La Estructura Chapa Color Negro","usd":52.8,"ars":73920,"iva":21,"pub":true},{"sku":"NVK-244A-R-X2","desc":"Banqueta C/respaldo Alta Set X2 Reforzada Metal Tolix Zhome","usd":26.4,"ars":36960,"iva":21,"pub":true},{"sku":"NVK-244A-R-X4","desc":"Banqueta C/respaldo Alta Set X4 Reforzada Metal Tolix Zhome Z-244 Acabado De La Estructura Chapa Color Rojo","usd":52.8,"ars":73920,"iva":21,"pub":true},{"sku":"NVK-3000-A","desc":"Silla Gamer Oficina Pc Zhome Ergonómica Reclinable Alta Color Azul Material Del Tapizado Cuero Sintético","usd":40.8,"ars":57119,"iva":21,"pub":true},{"sku":"NVK-3000-B","desc":"Silla Gamer Oficina Zhome Alta Ergonómica Pc Reclinable Color Blanco Material Del Tapizado Cuero Sintético","usd":40.8,"ars":57119,"iva":21,"pub":true},{"sku":"NVK-3000-N","desc":"Silla Gamer Oficina Pc Zhome Ergonómica Reclinable Alta Color Negro Material Del Tapizado Cuero Sintético","usd":40.8,"ars":57119,"iva":21,"pub":true},{"sku":"NVK-3000-R","desc":"Silla Gamer Oficina Pc Zhome Ergonómica Reclinable Alta Color Roja Material Del Tapizado Cuero Sintético","usd":40.8,"ars":57119,"iva":21,"pub":true},{"sku":"NVK-3068-N","desc":"Silla De Oficina Reclinable Sillon Gerencial Ecocuero Negro Negro Cuero Sintético","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"NVK-333-B-X4","desc":"Sillon Silla Eames Tulip Niviko Set X4 Comedor Living Estructura De La Silla Marrón Claro Asiento Blanco Diseño De La Tela Blanco","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-333-N-X2","desc":"Sillon Silla Eames Tulip Niviko Set X2 Comedor Living","usd":21.0,"ars":29400,"iva":21,"pub":true},{"sku":"NVK-333-N-X4","desc":"Sillon Silla Eames Tulip Niviko Set X4 Comedor Living","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-337-B-X4","desc":"Silla Living Comedor Cocina Set X4 Eames Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Blanco","usd":32.0,"ars":44800,"iva":21,"pub":true},{"sku":"NVK-337-G-X4","desc":"Silla Living Comedor Cocina Set X4 Eames Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Gris","usd":32.0,"ars":44800,"iva":21,"pub":true},{"sku":"NVK-337-N-X2","desc":"Silla Living Comedor Cocina Set X2 Eames Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Negro","usd":16.0,"ars":22400,"iva":21,"pub":true},{"sku":"NVK-337-N-X4","desc":"Silla Living Comedor Cocina Set X4 Eames Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Negro","usd":32.0,"ars":44800,"iva":21,"pub":true},{"sku":"NVK-344-B-X4","desc":"Silla Living Comedor Cocina Set X4 Wishbone Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Blanco","usd":68.8,"ars":96320,"iva":21,"pub":true},{"sku":"NVK-344-N-X4","desc":"Silla Living Comedor Cocina Wishbone Niviko Plastica Set X4 Estructura De La Silla Marrón Claro Asiento Negro Diseño De La Tela Negro","usd":68.8,"ars":96320,"iva":21,"pub":true},{"sku":"NVK-3555-B","desc":"Silla Oficina Alta Escritorio Ejecutiva Blanca Zhome Cabezal Color Blanco Material Del Tapizado Mesh","usd":49.0,"ars":68600,"iva":21,"pub":true},{"sku":"NVK-3555-G","desc":"Silla Oficina Alta Escritorio Ejecutiva Gris Zhome Cabezal Material Del Tapizado Mesh","usd":49.0,"ars":68600,"iva":21,"pub":true},{"sku":"NVK-3555-N","desc":"Silla Oficina Alta Escritorio Ejecutiva Negra Zhome Cabezal Color Negro Material Del Tapizado Mesh","usd":47.0,"ars":65800,"iva":21,"pub":true},{"sku":"NVK-3785-B","desc":"Silla De Oficina Escritorio Alta Ergonomica Blanca Zhome Color Blanco Material Del Tapizado Mesh Apoyacabeza Apoyabrazos Moviles","usd":34.0,"ars":47600,"iva":21,"pub":true},{"sku":"NVK-3785-N","desc":"Silla De Oficina Escritorio Alta Ergonomica Negra Zhome Z-3785-n Color Negro Material Del Tapizado Mesh Apoyacabeza Apoyabrazos Moviles","usd":31.5,"ars":44100,"iva":21,"pub":true},{"sku":"NVK-4068-N","desc":"Silla De Oficina Reclinable Sillon Gerencial Ecocuero Negro Negro Cuero Sintético","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-444-B","desc":"Silla Living Comedor Cocina Set X4 Eames Niviko Reforzada Estructura De La Silla Marrón Claro Asiento Blanco","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-444-N","desc":"Silla Cuerina Living Comedor Cocina Eames Tulip Niviko X4 Estructura De La Silla Marrón Claro Asiento Negro","usd":48.0,"ars":67200,"iva":21,"pub":true},{"sku":"NVK-6180-BX2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Cromado Blanco","usd":33.5,"ars":46900,"iva":21,"pub":true},{"sku":"NVK-6180-NX2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Cromado Negro","usd":33.5,"ars":46900,"iva":21,"pub":true},{"sku":"NVK-6180-N-X2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Acabado De La Estructura Cromado Color Negro","usd":33.5,"ars":46900,"iva":21,"pub":true},{"sku":"NVK-6190-BX2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Cromado Blanco","usd":44.5,"ars":62300,"iva":21,"pub":true},{"sku":"NVK-6190-NX2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Acabado De La Estructura Cromado Color Negro","usd":44.5,"ars":62300,"iva":21,"pub":true},{"sku":"NVK-6700-B","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Color","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"NVK68-223","desc":"Soporte De Tv Led Lcd Brazo Extensible Zhome 14 24 32 40 42","usd":3.46,"ars":4844,"iva":21,"pub":true},{"sku":"NVK68-443","desc":"Soporte De Tv Led Lcd Brazo Extensible Zhome 26 32 43 50 52 Negro","usd":3.85,"ars":5390,"iva":21,"pub":true},{"sku":"NVK-697-B","desc":"Silla De Oficina Escritorio Alta Ergonomica Apoyacabeza Blanca Zhome Blanco Mesh","usd":19.0,"ars":26600,"iva":21,"pub":true},{"sku":"NVK-697-N","desc":"Silla De Oficina Escritorio Alta Ergonomica Negra Zhome","usd":17.5,"ars":24500,"iva":21,"pub":true},{"sku":"NVK78-446","desc":"Soporte De Tv Led Brazo Extensible Zhome 32 43 50 55 65 75 Negro","usd":9.85,"ars":13790,"iva":21,"pub":true},{"sku":"NVK-8092-G","desc":"Silla De Oficina Escritorio Pc Gerencial Ejecutiva Soporte Lumbar Gris Lino Zhome","usd":34.0,"ars":47600,"iva":21,"pub":true},{"sku":"NVK-860-B-X4","desc":"Silla Living Comedor Set X4 Eames Tulip C/ Almohadon Niviko Color De La Estructura De La Silla Marrón Claro Color Del Asiento Blanco Diseño De La Tela Cuerina","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-860-N-X4","desc":"Silla Living Comedor Set X4 Eames Tulip C/ Almohadon Relieve Niviko Color De La Estructura De La Silla Marrón Claro Color Del Asiento Negro Diseño De La Tela Cuerina","usd":42.0,"ars":58800,"iva":21,"pub":true},{"sku":"NVK-9055-N","desc":"Silla De Escritorio Tulip Oficina Ruedas Giratoria Pc Zhome Color Negro Material Del Tapizado Cuero Sintético","usd":20.6,"ars":28840,"iva":21,"pub":true},{"sku":"NVK-9085-B-X2","desc":"Banqueta Taburete Tulip Alta Regulable Cromada Set X2 Zhome Acabado De La Estructura Cromado Color Blanco","usd":35.5,"ars":49700,"iva":21,"pub":true},{"sku":"NVK-9085-N-X2","desc":"Zhome Z-9085 Banqueta Taburete Tulip Alta Regulable Cromada Set X2 Acabado De La Estructura Cromado Color Negro Zhome","usd":35.5,"ars":49700,"iva":21,"pub":true},{"sku":"NVK-A337-B-X4","desc":"Silla Living Comedor Set X4 Eames Tulip Moderno Niviko Color De La Estructura De La Silla Marrón Oscuro Color Del Asiento Blanco","usd":50.0,"ars":70000,"iva":21,"pub":true},{"sku":"NVK-A337-N-X4","desc":"Silla Living Comedor Set X4 Eames Tulip Moderno Niviko Color De La Estructura De La Silla Marrón Oscuro Color Del Asiento Negro","usd":50.0,"ars":70000,"iva":21,"pub":true},{"sku":"NVK-A5120","desc":"Reloj Smartwatch Smartband Zhome Deportivo Negro 0.96 Z5120 Negro Negro","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A5130","desc":"Reloj Smartwatch Smartband Zhome Deportivo Negro 0.96 Z5130 Negro Negro","usd":2.7,"ars":3780,"iva":21,"pub":true},{"sku":"NVK-A6600-B","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Color Blanco Z6600","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A6600-N","desc":"Auriculares In-ear Inalámbricos Bluetooth A6s Negro Zhome","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A6700","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Color","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A6700-B","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Color Blanco","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A6700-N","desc":"Auriculares In-ear Inalámbricos Bluetooth A6s Negro Zhome","usd":2.5,"ars":3500,"iva":21,"pub":true},{"sku":"NVK-A6790","desc":"Auriculares Bluetooth Niviko Tws In Ear Buds Nvk-a6790 Negro Luz Blanco","usd":8.0,"ars":11200,"iva":21,"pub":true},{"sku":"NVK-A6900","desc":"Reloj Smartwatch 1.99 Smartband Zhome Deportivo Negro Ultra Negro Silicona Negro Negro","usd":4.3,"ars":6020,"iva":21,"pub":true},{"sku":"NVK-A8590","desc":"Auriculares Bluetooth Niviko Tws In Ear Buds Nvk-a8590 Negro Luz Verde","usd":12.0,"ars":16800,"iva":21,"pub":true},{"sku":"NVK-A9760","desc":"Auriculares Inalámbricos Niviko Tws Earbuds Nvk-a9760 Negro Luz Verde","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"NVK-A9800-B","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Blanco","usd":4.0,"ars":5600,"iva":21,"pub":true},{"sku":"NVK-A9800-N","desc":"Auriculares In-ear Inalámbricos Bluetooth Zhome Tws Tactil Color Negro","usd":3.0,"ars":4200,"iva":21,"pub":true},{"sku":"NVK-AF501","desc":"Freidora De Aire Digital Sin Aceite Zhome 3.8l 1500w Negro Negro","usd":15.35,"ars":21490,"iva":21,"pub":true},{"sku":"NVK-AF502","desc":"Freidora De Aire Digital Sin Aceite Zhome 5.5l 1500w Negro","usd":17.9,"ars":25059,"iva":21,"pub":true},{"sku":"NVK-AN101","desc":"Anafe Electrico Zhome Cocina 1 Hornallas 1000w Negro","usd":4.8,"ars":6720,"iva":21,"pub":true},{"sku":"NVK-AN102","desc":"Anafe Electrico Niviko Cocina 2 Hornallas 2000w Negro Negro","usd":7.2,"ars":10080,"iva":21,"pub":true},{"sku":"NVK-CF101","desc":"Cafetera Electrica De Filtro Zhome 750ml Automatica 6 Tazas","usd":8.0,"ars":11200,"iva":21,"pub":true},{"sku":"NVK-MP180","desc":"Mesa Plegable 180x74x74cm Exterior Camping Reforzada Niviko Blanco","usd":19.3,"ars":27020,"iva":21,"pub":true},{"sku":"NVK-MP180-N","desc":"Mesa Plegable 180x70x74cm Exterior Camping Reforzada Zhome Negro","usd":19.6,"ars":27440,"iva":21,"pub":true},{"sku":"NVK-MP180-N-MADERA","desc":"Mesa Plegable 180x74x74cm Exterior Camping Reforzada Niviko Negro/madera","usd":25.0,"ars":35000,"iva":21,"pub":true},{"sku":"NVK-MP180-N-RATAN","desc":"Mesa Plegable Zhome 180x74cm Exterior Camping Ratan Negro 10 Personas Negro Ratan","usd":25.0,"ars":35000,"iva":21,"pub":true},{"sku":"NVK-P5120","desc":"Parlante 12'' Portátil Bluetooth Karaoke Usb Led Zhome Color Negro","usd":30.0,"ars":42000,"iva":21,"pub":true},{"sku":"NVK-P8280","desc":"Parlante 8'' Portátil Bluetooth Karaoke Usb Aux Led Zhome Color Negro","usd":16.5,"ars":23100,"iva":21,"pub":true},{"sku":"NVK-P9000","desc":"Auriculares Vincha Inalámbricos Bluetooth Zhome Negro Zp9000 Negro","usd":3.9,"ars":5460,"iva":21,"pub":true},{"sku":"NVK-P9820","desc":"Parlante 8'' Doble Portátil Bluetooth Usb Karaoke Led Zhome","usd":26.0,"ars":36400,"iva":21,"pub":true},{"sku":"NVK-PE1001","desc":"Jarra Pava Eléctrica Niviko Hervidora Acero Inox 1.8l Color Acero Inoxidable","usd":7.0,"ars":9800,"iva":21,"pub":true},{"sku":"NVK-PE1005","desc":"Jarra Pava Eléctrica Zhome Con Corte Cafe Mate 220v 1.8l","usd":7.5,"ars":10500,"iva":21,"pub":true},{"sku":"NVK-R3490","desc":"Reloj Smartwatch Smartband Niviko Deportivo 1.83'' Nvk-r3490 Caja Negro Malla Negro Bisel Negro Diseño De La Malla Lisa","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"NVK-R3590","desc":"Reloj Smartwatch Smartband Niviko Deportivo 1.83'' Nvk-r3590 Caja Negro Malla Negro Bisel Negro Diseño De La Malla Silicona","usd":9.0,"ars":12600,"iva":21,"pub":true},{"sku":"NVK-SM103","desc":"Sandwichera Electrica Grill Zhome 750w Compacta Acero Negro Negro","usd":7.3,"ars":10220,"iva":21,"pub":true},{"sku":"NVK-SM107","desc":"Sandwichera Zhome 3 En 1 Negro 750w Grill Waffles Sandwich","usd":12.0,"ars":16800,"iva":21,"pub":true},{"sku":"NVK-TS102","desc":"Tostadora Electrica Zhome 2 Rebanadas 7 Niveles 700w Negra Negro","usd":6.6,"ars":9240,"iva":21,"pub":true},{"sku":"NVK-YG106","desc":"Yogurtera Yogurt Electrica Niviko Acero Inoxidable 4 Jarros 720ml 20w Color Gris","usd":7.5,"ars":10500,"iva":21,"pub":true},{"sku":"Pack x6-Acetico-Negra","desc":"SILICONAS EDDY","usd":0.5,"ars":700,"iva":21,"pub":true},{"sku":"Pack x6-Acetico-Transpare","desc":"SILICONAS EDDY","usd":0.5,"ars":700,"iva":21,"pub":true},{"sku":"PS5 DIGITAL","desc":"Consola Sony Playstation 5 Slim Blanco 4k 1tb Digital","usd":460.0,"ars":644000,"iva":21,"pub":true},{"sku":"PS5 DISCO","desc":"Consola Sony Playstation 5 Slim Standard 1tb","usd":460.0,"ars":644000,"iva":21,"pub":true},{"sku":"QCY-T1CB","desc":"Auriculares In-ear Bluetooth Qcy T1c Color Blanco","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"sd128gb","desc":"Tarjeta De Memoria Kingston Sdcs2sp Canvas Select Plus Con Adaptador Sd 128gb","usd":7.28,"ars":10192,"iva":21,"pub":true},{"sku":"sd64gb","desc":"Tarjeta De Memoria Kingston Sdcs2/64gb Canvas Select Plus Con Adaptador Sd 64gb","usd":5.0,"ars":7000,"iva":21,"pub":true},{"sku":"TAMPA","desc":"Silla De Oficina Pc Ejecutiva Escritorio Lumbar Negro Zhome Material Del Tapizado Malla","usd":14.8,"ars":20720,"iva":21,"pub":true},{"sku":"TAMPA-B","desc":"Silla De Oficina Pc Ejecutiva Escritorio Lumbar Blanca Zhome Color Blanco Material Del Tapizado Malla Z-103-b","usd":15.7,"ars":21980,"iva":21,"pub":true},{"sku":"TRUEBTAIRWH","desc":"Auriculares In-ear Inalámbricos Bluetooth Iluv True Wireless","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"Z-AF501","desc":"Freidora De Aire Digital Sin Aceite Zhome 3.8l 1500w Negro Negro","usd":15.35,"ars":21490,"iva":21,"pub":true},{"sku":"Z-AF502","desc":"Freidora De Aire Digital Sin Aceite Zhome 5.5l 1500w Negro Negro","usd":17.9,"ars":25059,"iva":21,"pub":true},{"sku":"Z-AN101","desc":"Anafe Electrico Zhome Cocina 1 Hornallas 1000w Negro Negro","usd":4.4,"ars":6160,"iva":21,"pub":true},{"sku":"ZL02C","desc":"Smartband Lige Zl02d Display De 1.39  Con Correa De Silicona Con Correa Color Negro","usd":10.0,"ars":14000,"iva":21,"pub":true},{"sku":"Z-TS102","desc":"Tostadora Electrica Niviko 2 Rebanadas 7 Niveles 700w Negra Negro","usd":6.6,"ars":9240,"iva":21,"pub":true},{"sku":"Z-YG106","desc":"Yogurtera Electrica Zhome Acero Inoxidable 4 Jarros 720ml Gris","usd":7.5,"ars":10500,"iva":21,"pub":true},{"sku":"NVK-6190-N-X2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Acabado De La Estructura Cromado Color Negro","usd":44.5,"ars":62300,"iva":21,"pub":true},{"sku":"NVK78-446","desc":"Soporte De Tv Led Brazo Extensible Zhome 32 43 50 55 65 75 Negro","usd":9.5,"ars":13300,"iva":21,"pub":true},{"sku":"NVK-233-N-X6","desc":"Silla Comedor Apoyabrazo Tolix Reforzada De Hierro Zhome X6","usd":85.19999999999999,"ars":119279,"iva":21,"pub":true},{"sku":"NVK-6190-B-X2","desc":"Banqueta Taburete Alta Desayunador Barra Cromada X2 Zhome Cromado Blanco","usd":44.5,"ars":62300,"iva":21,"pub":true},{"sku":"NVK-6180-B-X2","desc":"Banqueta Alta Zhome Cromada Blanca 75cm Set X2 Rotación 360° Cromado Blanco","usd":33.6,"ars":47040,"iva":21,"pub":true},{"sku":"NVK-160-B-X4","desc":"Silla Living Comedor Jardin Set X4 Niviko Plastica Apilable Estructura De La Silla Blanco Asiento Blanco Diseño De La Tela","usd":40.0,"ars":56000,"iva":21,"pub":true},{"sku":"29P385","desc":"Inflador Manual Jilong 30cm Negro Para Colchones Piletas Pelotas Portátil","usd":1.4,"ars":1959,"iva":21,"pub":true},{"sku":"NVK-233-R","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko","usd":56.8,"ars":79520,"iva":21,"pub":true},{"sku":"37433","desc":"Colchoneta Flotadora Inflable Jilong Ojota Gigante","usd":7.9,"ars":11060,"iva":21,"pub":true},{"sku":"8613","desc":"Coche Bebe Recién Nacido Paseo Cuna 2 Pos Toing","usd":25.0,"ars":35000,"iva":21,"pub":true},{"sku":"NVK-MP180-N-OPENBOX","desc":"Mesa Plegable 180x70x74cm Reforzada Con Detalles Open Box Negro","usd":20.8,"ars":29120,"iva":21,"pub":true},{"sku":"NVK-MP180-OPENBOX","desc":"Mesa Plegable 180x70x74cm Reforzada Con Detalles Open Box Blanco","usd":19.0,"ars":26600,"iva":21,"pub":true},{"sku":"NVK-222-GX4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko","usd":51.0,"ars":71400,"iva":21,"pub":true},{"sku":"NVK-222-R-X6","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X6 Zhome","usd":76.5,"ars":107100,"iva":21,"pub":true}];

const PIDX={};
PRODS.forEach(p=>{if(p.sku){PIDX[p.sku]=p;PIDX[p.sku.toLowerCase()]=p;}});

// ── FIREBASE — cargar edits de productos y zonas al arrancar ─────────────────
const FIREBASE_URL='https://firestore.googleapis.com/v1/projects/niviko-app/databases/(default)/documents/ml_dashboard';
async function loadFirebaseEdits(){
  try{
    // Cargar edits de productos
    const rp=await fetch(`${FIREBASE_URL}/products`).then(r=>r.ok?r.json():{}).catch(()=>({}));
    const editsMap=rp.fields?.edits?.mapValue?.fields||{};
    Object.entries(editsMap).forEach(([sku,val])=>{
      const d=val.mapValue?.fields||{};
      const ars=parseFloat(d.ars?.doubleValue||d.ars?.integerValue||0);
      const iva=parseFloat(d.iva?.doubleValue||d.iva?.integerValue||21);
      if(ars>0){
        const entry={...(PIDX[sku]||{}),sku,ars,iva};
        PIDX[sku]=entry;
        PIDX[sku.toLowerCase()]=entry;
        console.log(`[firebase] prod edit: ${sku} = $${ars}`);
      }
    });
    // Cargar edits de zonas
    const rz=await fetch(`${FIREBASE_URL}/zonas`).then(r=>r.ok?r.json():{}).catch(()=>({}));
    const zonaEdits=rz.fields?.edits?.mapValue?.fields||{};
    Object.entries(zonaEdits).forEach(([loc,val])=>{
      const cord=parseInt(val.integerValue||val.doubleValue||0);
      if(cord===-1) delete ZONA[loc];
      else if(cord>0) ZONA[loc]=cord;
    });
    console.log(`[firebase] ${Object.keys(editsMap).length} prod edits, ${Object.keys(zonaEdits).length} zona edits cargados`);
  }catch(e){
    console.warn('[firebase] No se pudieron cargar edits:', e.message);
  }
}
loadFirebaseEdits();
// Recargar cada 5 minutos
setInterval(loadFirebaseEdits, 5*60*1000);

function findProd(sku){if(!sku||sku==='—')return null;const k=String(sku).trim();return PIDX[k]||PIDX[k.toLowerCase()]||null;}
function getCordon(ciudad){if(!ciudad)return 3;return ZONA[String(ciudad).toLowerCase().trim()]||3;}
function hdr(t){return t?{'Authorization':'Bearer '+t}:{};}

// ── MODALIDAD ─────────────────────────────────────────────────
// Confirmado con raw real de la API:
// ship.logistic_type = 'self_service'              → FLEX
// ship.logistic_type = 'fulfillment' |             → FULL
//   'self_service_fulfillment'
// ship.logistic_type = 'cross_docking' |           → CORREO
//   'xd_drop_off' | 'drop_off' | 'default'
// NOTA: ship.logistic (objeto anidado) puede ser null
//       el campo real es ship.logistic_type (top-level)
function getModal(order, ship){
  const tags = order.tags||[];
  const slt = ship?.logistic_type||'';
  const olt = order.shipping?.logistic_type||'';

  // Full
  if(slt==='fulfillment'||slt==='self_service_fulfillment'
    ||tags.includes('fulfillment')||olt==='fulfillment')
    return 'Full';

  // Flex: logistic_type = 'self_service' (confirmado con raw real)
  if(slt==='self_service'||olt==='self_service')
    return 'Flex';

  // Correo: cross_docking, xd_drop_off, drop_off, default
  return 'Correo';
}

// ── COSTO ENVÍO ───────────────────────────────────────────────
function getEnvio(order, ship, fees, modal, useBonifCost=false, cfg={}){
  if(modal==='Full'){
    const ventaTotal = order.total_amount||0;
    const qtyFull = order.order_items?.[0]?.quantity || 1;
    const precioUnit = ventaTotal / qtyFull;
    const umbral = cfg?.umbralFreeShip||33000;
    // Precio unitario < umbral: comprador paga el envío → vendedor $0
    if(precioUnit < umbral) return {costo:0, bonif:0, cordon:null};
    // Producto >= umbral: ML dice "gratis" al comprador → vendedor paga el costo
    // Verificar igual si total_paid > transaction (comprador pagó por alguna razón)
    const totalPaid = (order.payments||[]).reduce((s,p)=>s+(p.total_paid_amount||0),0);
    const transaction = (order.payments||[]).reduce((s,p)=>s+(p.transaction_amount||0),0);
    const compradorPagoEnvio = totalPaid > transaction + 100;
    if(compradorPagoEnvio) return {costo:0, bonif:0, cordon:null};
    // Vendedor paga el envío:
    // Fuente 1: fee_detail[shipping] negativo = monto exacto post-liquidacion
    const feeShipFull = (fees?.fee_detail||[]).find(f=>f.type==='shipping')?.value;
    if(typeof feeShipFull==='number' && feeShipFull<0)
      return {costo:Math.abs(feeShipFull), bonif:0, cordon:null};
    // Fuente 2: list_cost pre-liquidacion
    const listCost = ship?.shipping_option?.list_cost;
    if(typeof listCost==='number' && listCost>0)
      return {costo:listCost, bonif:0, cordon:null};
    return {costo:0, bonif:0, cordon:null};
  }
  const ciudad = ship?.receiver_address?.city?.name
    ||order.shipping?.receiver_address?.city?.name||'';
  if(modal==='Flex'){
    const cordon = getCordon(ciudad);
    const costoCordon = CORD[cordon]||CORD[3];
    const flexTags = order.tags||[];
    // Cuánto pagó el comprador por el envío Flex
    // Si shipping_option.cost > 0 → el comprador pagó ese monto
    // Si shipping_option.cost = 0 → ML subsidió el envío (new_buyer, churn, etc.)
    // En ese caso el vendedor paga el cordón completo sin ingreso compensatorio
    const soCost = ship?.shipping_option?.cost;
    const ltCost = ship?.lead_time?.cost;
    const mlSubsidiaFlex = flexTags.some(t=>['new_buyer_free_shipping','churn-buyer-free-shipping','buyer_free_shipping'].includes(t));
    
    // Si ML subsidia el envío al comprador (new_buyer, churn, etc.):
    // ML le paga al vendedor la bonificación de envío
    // El monto real está en fees.fee_detail post-entrega
    // Estimación: si ML subsidia, el ingreso ≈ costo del cordón (ML cubre el costo)
    // En la práctica ML puede pagar más o menos - usar fees post-entrega cuando disponible
    const feeShip = (fees?.fee_detail||[]).find(f=>f.type==='shipping')?.value;

    // loyal_discount=1 en cost_components = MercadoLider Platinum, ML cubre el envio
    const loyalDiscount = ship?.cost_components?.loyal_discount===1;
    // order_has_discount tag = ML aplico bonificacion (incluye envio gratis Flex)
    const hasDiscount = flexTags.includes('order_has_discount');
    // ML bonifica el envio al vendedor en cualquiera de estos casos
    const mlBonificaFlex = mlSubsidiaFlex || loyalDiscount || hasDiscount;

    // Lógica de ingreso Flex — siempre: gananciaEnvio = ingresoEnvio - costoCordon
    // El umbral se aplica al precio UNITARIO, no al total de la orden
    // loyal_discount=1 (MercadoLíder Platinum): ML bonifica $8.490 sin importar precio
    const ventaTotal = order.total_amount||0;
    const qty = order.order_items?.[0]?.quantity || 1;
    const precioUnitario = ventaTotal / qty;
    const umbralFlex = cfg?.umbralFreeShip||33000;
    const sobreUmbral = precioUnitario >= umbralFlex;
    // Bonificaciones Flex — configurables en Config (con defaults oficiales ML)
    const BONIF_BAJO  = {1: cfg?.bonif_bajo_c1||4490, 2: cfg?.bonif_bajo_c2||6490, 3: cfg?.bonif_bajo_c3||8490};
    const BONIF_ALTO  = {1: cfg?.bonif_alto_c1||449,  2: cfg?.bonif_alto_c2||649,  3: cfg?.bonif_alto_c3||849};
    const bonifTable  = sobreUmbral ? BONIF_ALTO : BONIF_BAJO;
    const bonifEstimada = bonifTable[cordon] || bonifTable[3]; // default cordón 3
    let ingresoEnvio;
    if(typeof feeShip==='number' && feeShip>0){
      // Fuente más precisa: fee_detail post-entrega (monto exacto de ML)
      ingresoEnvio = feeShip;
    } else if(sobreUmbral){
      // Precio unit >= $33k: ML bonifica según cordón (C1=$449, C2=$649, C3=$849)
      ingresoEnvio = bonifEstimada;
    } else {
      // Precio unit < $33k: ML le cobra el envío al comprador y te bonifica según cordón
      // Si hay soCost (comprador pagó), ese es el ingreso real
      // Si no, usamos la tabla de bonificaciones como estimación
      ingresoEnvio = (typeof soCost==='number' && soCost>0) ? soCost : bonifEstimada;
    }
    // gananciaEnvio puede ser negativa (perdida) si list_cost < costoCordon
    const gananciaEnvio = ingresoEnvio - costoCordon;
    return {costo:-gananciaEnvio, bonif:ingresoEnvio, cordon, ingresoEnvio, costoCordon};
  }
  // Correo: buscar costo en orden de disponibilidad
  // 1. fees.fee_detail[shipping] — post-liquidación (más preciso)
  const fShip = (fees?.fee_detail||[]).find(f=>f.type==='shipping')?.value;
  if(typeof fShip==='number'&&fShip<0) return {costo:Math.abs(fShip),bonif:0,cordon:null};

  // 2. ship.cost — negativo post-entrega
  if(typeof ship?.cost==='number'&&ship.cost<0) return {costo:Math.abs(ship.cost),bonif:0,cordon:null};

  // 3. cost_components.seller_shipping_cost
  const sc = ship?.cost_components?.seller_shipping_cost;
  if(typeof sc==='number'&&sc!==0) return {costo:Math.abs(sc),bonif:0,cordon:null};

  // Determinar quién paga el envío
  const freeShip = ship?.free_shipping===true || order.shipping?.free_shipping===true;
  const tags = order.tags||[];
  
  const umbralFreeShip = cfg?.umbralFreeShip || 33000;
  const ventaTotalC = order.total_amount||0;
  const qtyCorreo = order.order_items?.[0]?.quantity || 1;
  const precioUnitCorreo = ventaTotalC / qtyCorreo;
  const mlSubsidia = freeShip && precioUnitCorreo >= umbralFreeShip;

  // Precio unitario < umbral: comprador paga el envío → vendedor $0 siempre
  if(precioUnitCorreo < umbralFreeShip) return {costo:0, bonif:0, cordon:null};
  
  // Datos de envío disponibles
  const soCostVal = ship?.shipping_option?.cost;    // lo que pagó el comprador
  const listCostVal = ship?.shipping_option?.list_cost; // costo total del envío

  if(!freeShip){
    // fee_detail[shipping] negativo = ML ya liquidó, usar ese valor exacto
    const fShipFee=(fees?.fee_detail||[]).find(f=>f.type==='shipping')?.value;
    if(typeof fShipFee==='number' && fShipFee<0)
      return {costo:Math.abs(fShipFee),bonif:0,cordon:null};
    // Comprador pagó parte (soCost > 0), vendedor paga la diferencia
    if(typeof soCostVal==='number' && soCostVal>0 &&
       typeof listCostVal==='number' && listCostVal>soCostVal)
      return {costo:Math.round(listCostVal-soCostVal),bonif:0,cordon:null};
    // soCost === 0 y list_cost > 0 → vendedor paga todo el envío
    if((typeof soCostVal!=='number' || soCostVal===0) &&
       typeof listCostVal==='number' && listCostVal>0)
      return {costo:Math.round(listCostVal),bonif:0,cordon:null};
    // Comprador pagó todo → vendedor $0
    return {costo:0,bonif:0,cordon:null};
  }
  
  // free_shipping=true pero producto < umbral → ML bonifica al comprador
  // pero podría igual cobrarle al vendedor (verificar fees)
  if(freeShip && !mlSubsidia){
    const fShipFee=(fees?.fee_detail||[]).find(f=>f.type==='shipping')?.value;
    if(typeof fShipFee==='number' && fShipFee<0)
      return {costo:Math.abs(fShipFee),bonif:0,cordon:null};
    // Sin fee negativo → vendedor $0
    return {costo:0,bonif:0,cordon:null};
  }

  // 4. ship.lead_time.cost — SOLO si free_shipping (vendedor paga)
  const ltCost = ship?.lead_time?.cost;
  if(typeof ltCost==='number' && ltCost>0 && freeShip)
    return {costo:ltCost,bonif:0,cordon:null};

  // 5. ship.shipping_option.cost — SOLO si free_shipping
  const soCost = ship?.shipping_option?.cost;
  if(typeof soCost==='number' && soCost>0 && freeShip)
    return {costo:soCost,bonif:0,cordon:null};

  // Si el comprador pagó más que total_amount → pagó el envío → $0
  const buyerPaid=(order.payments||[]).reduce((s,p)=>s+Math.abs(p.total_paid_amount||0),0);
  if(buyerPaid > order.total_amount*1.05) return {costo:0,bonif:0,cordon:null};

  if((order.tags||[]).includes('no_shipping')) return {costo:0,bonif:0,cordon:null};

  // Fallback para not_delivered con free_shipping: usar list_cost como estimacion del costo
  // Cubre el caso cross_docking/correo donde fee_detail aun no esta disponible
  const listCostCorreo = ship?.shipping_option?.list_cost || ship?.lead_time?.list_cost;
  if(typeof listCostCorreo==='number' && listCostCorreo>0 && freeShip)
    return {costo:listCostCorreo, bonif:0, cordon:null};

  return {costo:0,bonif:0,cordon:null};
}

function calcular(order, ship, fees, useBonifCost=false, umbralFreeShip=33000){
  const item = order.order_items?.[0]||{};
  const venta = order.total_amount||0;
  const sku = item.item?.seller_sku||item.item?.id||'';
  const prod = findProd(sku);
  const tags = order.tags||[];

  // Comisión: fees.fee_detail[mercadolibre] es la fuente más precisa
  // IMPORTANTE: fee_detail[mercadolibre] incluye TODO lo que cobra ML:
  // - comisión porcentual, costo fijo, cuotas
  // Solo disponible DESPUÉS de la entrega (not_delivered → vacío)
  const feeML = (fees?.fee_detail||[]).find(f=>f.type==='mercadolibre'||f.type==='listing')?.value;
  const hasFeeDetail = feeML && feeML < 0;
  
  // Fallback para not_delivered: sale_fee puede ser el fee de 1 unidad
  // Para pack_order: multiplicar por cantidad para obtener el fee total
  const qty = item.quantity||1;
  const saleFeeTotal = Math.abs(item.sale_fee||0) * (tags.includes('pack_order') && qty>1 ? qty : 1);
  
  // Si sale_fee total es más razonable (>8% de venta), usarlo
  // Si no, estimar por porcentaje base (14%)
  const saleFeeRatio = venta>0 ? saleFeeTotal/venta : 0;
  const comisionFallback = saleFeeRatio > 0.08 ? saleFeeTotal : venta*0.14;
  
  const comision = hasFeeDetail
    ? Math.abs(feeML)        // fee_detail → más preciso, incluye todo
    : comisionFallback;      // fallback: sale_fee*qty para pack, o 14% estimado

  // ── CUOTAS ───────────────────────────────────────────────────
  // REGLA DEFINITIVA:
  // Las cuotas son costo del VENDEDOR solo cuando ML las cobra explícitamente.
  // Si el comprador paga en cuotas, el recargo puede ser del banco/ML al comprador,
  // NO necesariamente un descuento al vendedor.
  // Evidencia: Lenovo 9 cuotas → total_paid $1.173.998 pero sale_fee solo $99.999 (12.5%)
  // ML no cobró cuotas al vendedor en ese caso.
  // 
  // FUENTES CONFIABLES de cuotas del vendedor:
  // 1. hasFeeDetail=true → ya incluido en comision, cuotas=0
  // 2. tag 'financing_fee' → ML confirma que te cobra el costo
  // 3. Nada más → cuotas=0 (no podemos saber sin fee_detail)
  const hasFinancing = tags.includes('financing_fee');
  const cuotas = hasFeeDetail ? 0
    : hasFinancing
      ? (order.payments||[]).reduce((s,p)=>{
          const pagado=Math.abs(p.total_paid_amount||0);
          const base=Math.abs(p.transaction_amount||0);
          const diff=pagado>0&&base>0?Math.max(0,pagado-base):0;
          return diff>0&&diff<base*0.5?s+diff:s;
        },0)
      : 0;
  
const costo = prod ? prod.ars*(item.quantity||1) : 0; // multiplicar por unidades
  const ivaPct = prod?prod.iva/100:0.21;
  // IVA CORRECTO: el precio de venta YA incluye IVA → desglozar dividiendo
  // IVA = venta - venta/1.21  (o 1.105 para informática)
  const iva = Math.round(venta - venta/(1+ivaPct));
  // Precio sin IVA (base imponible)
  const ventaSinIva = venta - iva;
  // Publicidad: % sobre venta total (ML lo cobra sobre precio con IVA)
  const pub = (prod&&prod.pub===false)?0:Math.round(venta*0.05);
  // IIBB CORRECTO: se calcula sobre el precio SIN IVA
  const iibb = Math.round(ventaSinIva*0.04);

  const ciudad = ship?.receiver_address?.city?.name
    ||order.shipping?.receiver_address?.city?.name||'';
  const estado = ship?.receiver_address?.state?.name||'';
  const modal = getModal(order,ship);
  const envioData = getEnvio(order,ship,fees,modal,useBonifCost,{umbralFreeShip});
  const {costo:costoEnvio,bonif:bonifEnvio,cordon} = envioData;
  // Retenciones impositivas que ML descuenta automáticamente:
  // Impuesto Créditos y Débitos: 0.6% fijo
  // Retención IIBB SIRTAC: 0.6% fijo
  // IIBB provinciales: ~0.025% variable según provincia (no predecible por orden)
  // Total estimado: 1.2% del precio de venta
  const retencionesML = Math.round(venta * 0.012);
  // Fórmula de ganancia:
  // Para Flex: ML ya liquidó comisión, impuestos y bonificación de envío en total_paid.
  //   ganancia = total_paid - costoCordon - costo - iva - pub - iibb - retencionesML
  //   total_paid = lo que ML efectivamente te acredita (ya descontó comisión + bonificó envío)
  // Para Full/Correo: usamos venta - comision - costoEnvio (no hay total_paid limpio)
  const totalPaid = (order.payments||[]).reduce((s,p)=>s+(p.total_paid_amount||0),0);
  const costoCordonFlex = modal==='Flex' ? (envioData?.costoCordon||0) : 0;
  let ganancia;
  if(modal==='Flex' && totalPaid > 0){
    // total_paid ya incluye: venta - comision ML - bonif envio ML - impuestos ML
    // Solo falta descontar: logística (cordón) + costos propios
    ganancia = totalPaid - comision - cuotas - costoCordonFlex - costo - iva - pub - iibb - retencionesML;
  } else {
    // Full y Correo: fórmula estándar
    ganancia = venta - comision - cuotas - costo - iva - pub - iibb - retencionesML - Math.abs(costoEnvio);
  }

  return {
    id:order.id, fecha:(order.date_created||'').split('T')[0],
    sku:sku||'—', desc:item.item?.title||'—', unidades:item.quantity||1,
    ciudad, estado, modal, cordon, venta,
    comision:Math.round(comision), cuotas:Math.round(cuotas),
    costo:Math.round(costo), iva:Math.round(iva), ivaPct:prod?.iva||21,
    pub:Math.round(pub), iibb:Math.round(iibb),
    costoEnvio:Math.round(costoEnvio), bonifEnvio:Math.round(bonifEnvio||0),
    ingresoEnvio:Math.round(envioData?.ingresoEnvio||0),
    costoCordon:Math.round(envioData?.costoCordon||0),
    retencionesML:Math.round(retencionesML),
    ganancia:Math.round(ganancia), pct:venta>0?ganancia/venta:0,
    sinProducto:!prod,
    sinZona:modal==='Flex'&&!ZONA[String(ciudad).toLowerCase().trim()],
    _dbg:{
      logistic_type:ship?.logistic_type||'',
      logistic_obj:ship?.logistic||null,
      tags,
      hasFinancing
    }
  };
}

app.get('/',(req,res)=>res.json({status:'ok',v:'9.2',prods:PRODS.length,zones:Object.keys(ZONA).length}));

app.post('/auth/token',async(req,res)=>{
  try{const b=new URLSearchParams({grant_type:'authorization_code',...req.body});const r=await fetch(AUTH,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()});res.json(await r.json());}
  catch(e){res.status(500).json({error:e.message});}
});
app.post('/auth/refresh',async(req,res)=>{
  try{const b=new URLSearchParams({grant_type:'refresh_token',...req.body});const r=await fetch(AUTH,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()});res.json(await r.json());}
  catch(e){res.status(500).json({error:e.message});}
});
app.get('/me',async(req,res)=>{
  try{const r=await fetch(ML+'/users/me',{headers:hdr(req.headers['x-ml-token'])});res.json(await r.json());}
  catch(e){res.status(500).json({error:e.message});}
});

app.get('/orders/all',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id,from,to,envio_bonif,umbral_free_ship}=req.query;
  const useBonifCost = envio_bonif==='true';
  const umbralFreeShip = parseFloat(umbral_free_ship)||33000;
  try{
    let all=[],offset=0,total=null;
    while(total===null||offset<total){
      const p=new URLSearchParams({seller:seller_id,'order.date_created.from':from,'order.date_created.to':to,'order.status':'paid',offset,limit:50,sort:'date_desc'});
      const r=await fetch(ML+'/orders/search?'+p,{headers:hdr(token)});
      const data=await r.json();
      if(data.error||!data.results)break;
      // Filtrar en cliente también por si acaso: solo órdenes realmente pagadas
      const valid=data.results.filter(o=>{
        const s=o.status||'';
        const tags=o.tags||[];
        // Excluir canceladas, reembolsadas, inválidas
        if(s==='cancelled'||s==='invalid')return false;
        if(tags.includes('cancelled')||tags.includes('refunded'))return false;
        return true;
      });
      all=all.concat(valid);
      total=data.paging?.total||0;
      offset+=data.results.length; // usar results.length para paginar correctamente
      if(all.length>=total||!data.results.length)break;
    }
    const processed=[];
    for(let i=0;i<all.length;i+=5){
      const batch=all.slice(i,i+5);
      const results=await Promise.all(batch.map(async o=>{
        const[ship,fees]=await Promise.all([
          o.shipping?.id?fetch(ML+'/shipments/'+o.shipping.id,{headers:hdr(token)}).then(r=>r.ok?r.json():null).catch(()=>null):Promise.resolve(null),
          fetch(ML+'/orders/'+o.id+'/fees',{headers:hdr(token)}).then(r=>r.ok?r.json():null).catch(()=>null)
        ]);
        return calcular(o,ship,fees,useBonifCost,umbralFreeShip);
      }));
      processed.push(...results);
    }
    res.json({orders:processed,total:processed.length});
  }catch(e){res.status(500).json({error:e.message});}
});

app.get('/debug/order/:id',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  try{
    const[rO,rF]=await Promise.all([fetch(ML+'/orders/'+req.params.id,{headers:hdr(token)}),fetch(ML+'/orders/'+req.params.id+'/fees',{headers:hdr(token)})]);
    const order=await rO.json();
    const fees=await rF.json().catch(()=>({}));
    let ship=null;
    if(order.shipping?.id){const sr=await fetch(ML+'/shipments/'+order.shipping.id,{headers:hdr(token)});ship=await sr.json();}
    const item=order.order_items?.[0]||{};
    const modal=getModal(order,ship);
    const envio=getEnvio(order,ship,fees,modal,true,{umbralFreeShip:33000}); // debug
    res.json({
      id:order.id, sku:item.item?.seller_sku, titulo:item.item?.title,
      total_amount:order.total_amount, sale_fee:item.sale_fee,
      ORDER_STATUS:order.status, ORDER_TAGS:order.tags,
      ORDER_SHIPPING_MODE:order.shipping?.mode,
      ORDER_FREE_SHIPPING:order.shipping?.free_shipping,
      SHIP_LOGISTIC_TYPE:ship?.logistic_type,
      SHIP_LOGISTIC_OBJECT:ship?.logistic,
      SHIP_COST:ship?.cost,
      SHIP_COST_COMPONENTS:ship?.cost_components,
      SHIP_LEAD_TIME:ship?.lead_time,
      SHIP_SHIPPING_OPTION:ship?.shipping_option,
      SHIP_COST_COMPONENTS_FULL:ship?.cost_components,
      SHIP_RECEIVER_SHIPPING_COST:ship?.cost_components?.receiver_shipping_cost,
      SHIP_BUYER_SHIPPING_COST:ship?.cost_components?.buyer_shipping_cost,
      SHIP_COST_RAW:ship?.cost,
      FEE_DETAIL:fees?.fee_detail,
      FEE_SHIPPING:fees?.fee_detail?.find?.(f=>f.type==='shipping')?.value,
      LOYAL_DISCOUNT:ship?.cost_components?.loyal_discount,
      ORDER_HAS_DISCOUNT:(order.tags||[]).includes('order_has_discount'),
      PAYMENTS:order.payments?.map(p=>({
        total_paid:p.total_paid_amount,
        transaction:p.transaction_amount,
        cuotas:p.installments,
        status:p.status
      })),
      CIUDAD:ship?.receiver_address?.city?.name,
      MODAL_DETECTADA:modal,
      ENVIO:envio,
      CALCULO:calcular(order,ship,fees,false,33000)
    });
  }catch(e){res.status(500).json({error:e.message});}
});

app.post('/reconcile',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id,date_key,orders=[]}=req.body;
  if(!date_key)return res.status(400).json({error:'date_key requerido YYYYMMDD'});
  try{
    const genR=await fetch(`${ML}/billing/integration/periods/key/${date_key}/reports`,
      {method:'POST',headers:{...hdr(token),'Content-Type':'application/json'},
       body:JSON.stringify({type:'PAYMENT',document_type:'BILL',user_id:seller_id})});
    const gen=await genR.json();
    if(gen.error)return res.json({ok:false,step:'generate',error:gen.message||gen.error});
    const fileId=gen.file_id||gen.id;
    if(!fileId)return res.json({ok:false,step:'generate',error:'Sin file_id',raw:gen});
    let status='PROCESSING',tries=0;
    while(status==='PROCESSING'&&tries<20){
      await new Promise(r=>setTimeout(r,3000));
      const st=await fetch(`${ML}/billing/integration/reports/${fileId}/status`,{headers:hdr(token)});
      status=(await st.json()).status||'ERROR';tries++;
    }
    if(status!=='READY')return res.json({ok:false,step:'status',status});
    const csv=await fetch(`${ML}/billing/integration/reports/${fileId}`,{headers:hdr(token)}).then(r=>r.text());
    const rows=csv.split('\n').map(r=>r.split(',').map(c=>c.replace(/^"|"$/g,'').trim()));
    const header=rows[0]||[];
    const ci=n=>header.findIndex(h=>h.toLowerCase().includes(n));
    const cols={orden:ci('venta')<0?ci('orden'):ci('venta'),envio:ci('env'),modal:ci('modal')};
    const bd={};
    for(let i=1;i<rows.length;i++){
      const row=rows[i];if(!row[cols.orden])continue;
      const oid=String(row[cols.orden]).replace(/\D/g,'');
      if(!oid||oid.length<10)continue;
      const pn=v=>parseFloat(String(v||0).replace(/[^0-9.\-]/g,''))||0;
      bd[oid]={envio:Math.abs(pn(row[cols.envio])),modal:row[cols.modal]||''};
    }
    let matched=0;const diffs=[];
    orders.forEach(o=>{
      const ml=bd[String(o.id)];if(!ml)return;matched++;
      const mm=ml.modal.toLowerCase().includes('flex')?'Flex':ml.modal.toLowerCase().includes('full')?'Full':'Correo';
      const d={id:o.id,sku:o.sku};let diff=false;
      if(mm!==o.modal){d.modal_nuestro=o.modal;d.modal_ml=mm;diff=true;}
      if(ml.envio>0&&Math.abs(ml.envio-(o.costoEnvio||0))>200){d.envio_nuestro=o.costoEnvio;d.envio_ml=ml.envio;diff=true;}
      if(diff)diffs.push(d);
    });
    res.json({ok:true,rows:Object.keys(bd).length,matched,diffs,billing_data:bd});
  }catch(e){res.status(500).json({error:e.message});}
});

app.get('/mercado/search',async(req,res)=>{
  // ML bloquea IPs de servidores para búsqueda pública sin auth
  // Solución: usar access_token como query param (no como Bearer header)
  const token=req.headers['x-ml-token']||'';
  try{
    const{q,category,sort='sold_quantity_desc',limit=50}=req.query;
    const h={'Accept':'application/json','Accept-Language':'es-AR,es;q=0.9'};

    // Construir URL con access_token como query param
    const mkUrl=(sortVal)=>{
      let u=`${ML}/sites/MLA/search?limit=${limit}&sort=${sortVal}`;
      if(q) u+=`&q=${encodeURIComponent(q)}`;
      if(category) u+=`&category=${category}`;
      if(token) u+=`&access_token=${encodeURIComponent(token)}`;
      return u;
    };

    const[d1,d2]=await Promise.all([
      fetch(mkUrl('sold_quantity_desc'),{headers:h}).then(r=>r.json()).catch(()=>({})),
      fetch(mkUrl('relevance'),{headers:h}).then(r=>r.json()).catch(()=>({}))
    ]);

    // Retry sin categoría si no hay resultados
    if((!d1.results?.length&&!d2.results?.length)&&category&&q){
      let u3=`${ML}/sites/MLA/search?limit=${limit}&sort=sold_quantity_desc&q=${encodeURIComponent(q)}`;
      if(token) u3+=`&access_token=${encodeURIComponent(token)}`;
      const d3=await fetch(u3,{headers:h}).then(r=>r.json()).catch(()=>({}));
      if(d3.results?.length) return res.json(d3);
    }

    // Combinar y deduplicar
    const seen=new Set();
    const combined=[];
    for(const item of [...(d1.results||[]),...(d2.results||[])]){
      if(!seen.has(item.id)){seen.add(item.id);combined.push(item);}
    }
    res.json({...d1,results:combined,paging:{total:combined.length}});
  }catch(e){res.status(500).json({error:e.message});}
});


app.get('/mercado/seller',async(req,res)=>{
  const token=req.headers['x-ml-token']; // opcional para datos públicos
  const{q}=req.query;if(!/^\d+$/.test(q))return res.json({error:'User ID numérico',seller:{},items:[]});
  const bh={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36','Accept':'application/json','Referer':'https://www.mercadolibre.com.ar/'};
  if(token)bh['Authorization']=`Bearer ${token}`;
  try{const[sR,iR]=await Promise.all([fetch(ML+'/users/'+q,{headers:bh}),fetch(ML+'/sites/MLA/search?seller_id='+q+'&limit=50&sort=sold_quantity_desc',{headers:bh})]);res.json({seller:await sR.json(),items:(await iR.json()).results||[]});}
  catch(e){res.status(500).json({error:e.message});}
});
app.get('/mercado/item',async(req,res)=>{
  const token=req.headers['x-ml-token']; // opcional
  const bhi={'User-Agent':'Mozilla/5.0','Accept':'application/json'};if(token)bhi['Authorization']=`Bearer ${token}`;
  try{res.json(await fetch(ML+'/items/'+req.query.id,{headers:bhi}).then(r=>r.json()));}
  catch(e){res.status(500).json({error:e.message});}
});
app.get('/mercado/ean',async(req,res)=>{
  const token=req.headers['x-ml-token']; // opcional
  const bhe={'User-Agent':'Mozilla/5.0','Accept':'application/json'};if(token)bhe['Authorization']=`Bearer ${token}`;
  try{res.json(await fetch(ML+'/sites/MLA/search?q='+encodeURIComponent(req.query.code)+'&limit=20',{headers:bhe}).then(r=>r.json()));}
  catch(e){res.status(500).json({error:e.message});}
});

app.get('/products',(req,res)=>res.json({products:PRODS,total:PRODS.length}));
app.get('/zones',(req,res)=>res.json({zones:ZONA,total:Object.keys(ZONA).length}));

// ── CLAUDE AI PARA ANÁLISIS DE MERCADO ───────────────────────
// El browser no puede llamar a api.anthropic.com directamente (CORS)
// El proxy actúa de intermediario
app.post('/ai/market',async(req,res)=>{
  try{
    const{query,category}=req.body;
    if(!query)return res.status(400).json({error:'query requerido'});

    const prompt=`Analizá el mercado de "${query}" en MercadoLibre Argentina.
Buscá en mercadolibre.com.ar los productos más vendidos de esta categoría.

Respondé SOLO con un JSON válido, sin texto adicional, sin markdown:
{
  "precio_min": number,
  "precio_max": number,
  "precio_promedio": number,
  "precio_mediana": number,
  "total_publicaciones": number,
  "top_productos": [
    {"titulo": "string", "precio": number, "vendidos": number, "vendedor": "string"},
    {"titulo": "string", "precio": number, "vendidos": number, "vendedor": "string"},
    {"titulo": "string", "precio": number, "vendidos": number, "vendedor": "string"},
    {"titulo": "string", "precio": number, "vendidos": number, "vendedor": "string"},
    {"titulo": "string", "precio": number, "vendidos": number, "vendedor": "string"}
  ],
  "top_vendedores": [
    {"nombre": "string", "publicaciones": number, "ventas_estimadas": number},
    {"nombre": "string", "publicaciones": number, "ventas_estimadas": number},
    {"nombre": "string", "publicaciones": number, "ventas_estimadas": number}
  ],
  "insights": ["string", "string", "string"],
  "recomendacion_precio": number,
  "tendencia": "creciente|estable|decreciente",
  "nivel_competencia": "bajo|medio|alto",
  "ventas_diarias_estimadas": number
}`;

    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY||'',
        'anthropic-version':'2023-06-01',
        'anthropic-beta':'web-search-2025-03-05'
      },
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:2000,
        tools:[{type:'web_search_20250305',name:'web_search'}],
        messages:[{role:'user',content:prompt}]
      })
    });

    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data.error?.message||'Error de Claude API'});

    // Extraer texto de la respuesta
    const textBlock=data.content?.find(b=>b.type==='text');
    if(!textBlock?.text)return res.status(500).json({error:'Sin respuesta de IA'});

    // Parsear JSON
    const jsonMatch=textBlock.text.match(/\{[\s\S]*\}/);
    if(!jsonMatch)return res.status(500).json({error:'No se pudo parsear JSON',raw:textBlock.text.substring(0,200)});

    const marketData=JSON.parse(jsonMatch[0]);
    res.json({ok:true,data:marketData});
  }catch(e){res.status(500).json({error:e.message});}
});


// ── GESTIÓN DE PLATAFORMA ─────────────────────────────────────

// 1. REPUTACIÓN & MÉTRICAS DEL ALGORITMO
app.get('/plataforma/reputacion',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id}=req.query;
  try{
    const[repR,shipR,qR]=await Promise.all([
      fetch(`${ML}/users/${seller_id}`,{headers:hdr(token)}).then(r=>r.json()),
      fetch(`${ML}/users/${seller_id}/shipping_options`,{headers:hdr(token)}).then(r=>r.json()).catch(()=>({})),
      fetch(`${ML}/questions/search?seller_id=${seller_id}&status=UNANSWERED&limit=5`,{headers:hdr(token)}).then(r=>r.json()).catch(()=>({})),
    ]);
    const rep=repR.seller_reputation||{};
    const trans=rep.transactions||{};
    const perf=rep.metrics||{};
    res.json({
      nivel:rep.level_id||'—',
      power_seller:repR.site_status||'—',
      transacciones_ok:trans.completed||0,
      transacciones_periodo:trans.period||'—',
      cancelaciones:{pct:perf.cancellations?.rate||0,valor:perf.cancellations?.value||0,umbral:perf.cancellations?.excluded_categories||0},
      reclamos:{pct:perf.claims?.rate||0,valor:perf.claims?.value||0},
      despacho_tarde:{pct:perf.delayed_handling_time?.rate||0,valor:perf.delayed_handling_time?.value||0},
      preguntas_sin_responder:qR.total||0,
      // Lo que el algoritmo necesita según nivel actual
      recomendaciones:buildRecoAlgo(rep)
    });
  }catch(e){res.status(500).json({error:e.message});}
});

function buildRecoAlgo(rep){
  const recos=[];
  const m=rep.metrics||{};
  if((m.cancellations?.rate||0)>0.02) recos.push({tipo:'cancelaciones',msg:'Tasa de cancelaciones alta (>2%). Evitar cancelar órdenes confirmadas.',urgencia:'alta'});
  if((m.claims?.rate||0)>0.01) recos.push({tipo:'reclamos',msg:'Tasa de reclamos alta (>1%). Revisar calidad del embalaje y descripción de productos.',urgencia:'alta'});
  if((m.delayed_handling_time?.rate||0)>0.02) recos.push({tipo:'despacho',msg:'Despacho tardío alto (>2%). Despachar en menos de 24hs para mejorar posicionamiento.',urgencia:'alta'});
  if(rep.level_id==='5_red') recos.push({tipo:'reputacion',msg:'Reputación roja. Prioridad máxima: resolver reclamos pendientes y mejorar métricas.',urgencia:'critica'});
  if(rep.level_id==='4_orange') recos.push({tipo:'reputacion',msg:'Reputación naranja. En riesgo de perder MercadoLíder. Mejorar cancelaciones y reclamos.',urgencia:'alta'});
  if(recos.length===0) recos.push({tipo:'ok',msg:'Reputación saludable. Mantener tiempo de despacho y calidad de embalaje.',urgencia:'baja'});
  return recos;
}

// 2. PUBLICACIONES + SCORE DE SALUD
app.get('/plataforma/publicaciones',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id,limit=50}=req.query;
  try{
    // Listar publicaciones activas
    const itemsR=await fetch(`${ML}/users/${seller_id}/items/search?status=active&limit=${limit}`,{headers:hdr(token)}).then(r=>r.json());
    // results can be array of strings (ids) or objects
    const rawIds=itemsR.results||itemsR.items||[];
    const ids=rawIds.map(r=>typeof r==='string'?r:(r.id||r)).filter(Boolean);
    if(!ids.length)return res.json({items:[],total:0,raw:itemsR});
    console.log('[publicaciones] Found IDs:', ids.length, 'First:', ids[0]);
    
    // Obtener detalles en lotes de 20
    const chunks=[];
    for(let i=0;i<ids.length;i+=20) chunks.push(ids.slice(i,i+20));
    
    const items=[];
    for(const chunk of chunks){
      const[detR,healthBatch]=await Promise.all([
        fetch(`${ML}/items?ids=${chunk.join(',')}&attributes=id,title,price,available_quantity,sold_quantity,listing_type_id,condition,permalink,thumbnail,catalog_listing`,{headers:hdr(token)}).then(r=>r.json()),
        Promise.all(chunk.map(id=>fetch(`${ML}/items/${id}/health`,{headers:hdr(token)}).then(r=>r.ok?r.json():{}).catch(()=>({})))) 
      ]);
      // ML /items?ids= returns [{code:200, body:{...}}] or [{id:...}] directly
      const detArr=Array.isArray(detR)?detR:(detR.results||[]);
      detArr.forEach((d,i)=>{
        // Handle both response formats
        const item=(d.code===200&&d.body)?d.body:d;
        if(!item?.id)return;
        const health=healthBatch[i]||{};
        items.push({
          id:item.id,
          titulo:item.title,
          precio:item.price,
          stock:item.available_quantity||0,
          vendidos:item.sold_quantity||0,
          tipo:item.listing_type_id,
          catalogo:item.catalog_listing||false,
          thumbnail:item.thumbnail,
          permalink:item.permalink,
          // Score de salud
          score:health.health||null,
          score_detalles:health.issues||[],
          // Alertas básicas
          sin_stock:((item.available_quantity||0)===0),
          precio_bajo:(item.price<5000),
        });
      });
    }
    console.log('[publicaciones] Items processed:', items.length);
    res.json({items,total:items.length,seller_id});
  }catch(e){res.status(500).json({error:e.message});}
});

// 3. RECLAMOS
app.get('/plataforma/reclamos',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id,status='opened',limit=20}=req.query;
  try{
    const r=await fetch(`${ML}/post-purchase/v1/claims?seller_id=${seller_id}&status=${status}&limit=${limit}`,{headers:hdr(token)});
    const data=await r.json();
    const claims=data.data||data.results||[];
    // Para cada reclamo, obtener el timeline
    const withTimeline=await Promise.all(claims.slice(0,10).map(async c=>{
      const tR=await fetch(`${ML}/post-purchase/v1/claims/${c.id}/timeline`,{headers:hdr(token)}).then(r=>r.ok?r.json():{}).catch(()=>({}));
      return {...c,timeline:tR.messages||tR.history||[]};
    }));
    res.json({claims:withTimeline,total:data.paging?.total||claims.length});
  }catch(e){res.status(500).json({error:e.message});}
});

// 4. DESCUENTOS Y PROMOCIONES
app.get('/plataforma/descuentos',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id}=req.query;
  try{
    // Try multiple endpoints for promotions/deals
    const[promoR,dealR,campaignR]=await Promise.all([
      fetch(`${ML}/users/${seller_id}/promotions`,{headers:hdr(token)}).then(r=>r.ok?r.json():{}).catch(()=>({})),
      fetch(`${ML}/users/${seller_id}/deals`,{headers:hdr(token)}).then(r=>r.ok?r.json():{}).catch(()=>({})),
      fetch(`${ML}/campaigns?seller_id=${seller_id}`,{headers:hdr(token)}).then(r=>r.ok?r.json():{}).catch(()=>({})),
    ]);
    // Normalize responses - ML returns different structures
    const promos=[
      ...(Array.isArray(promoR)?promoR:(promoR.results||promoR.promotions||[])),
      ...(Array.isArray(dealR)?dealR:(dealR.results||dealR.deals||[])),
      ...(Array.isArray(campaignR)?campaignR:(campaignR.results||[])),
    ];
    res.json({
      activas:promos,
      raw:{promoR,dealR,campaignR}, // debug
      total:promos.length
    });
  }catch(e){res.status(500).json({error:e.message});}
});

// 5. ANÁLISIS IA DE PUBLICACIÓN
app.post('/ai/publicacion',async(req,res)=>{
  const{item_id,titulo,precio,score,issues,vendidos,competencia}=req.body;
  try{
    const prompt=`Analizá esta publicación de MercadoLibre Argentina y dá recomendaciones concretas.

Publicación:
- Título: "${titulo}"
- Precio: $${precio?.toLocaleString('es-AR')}
- Unidades vendidas: ${vendidos}
- Score de salud ML: ${score||'no disponible'}/100
- Problemas detectados por ML: ${JSON.stringify(issues||[])}
${competencia?`- Contexto de mercado: ${JSON.stringify(competencia)}`:''}

Respondé SOLO con JSON válido:
{
  "resumen": "string - 2 oraciones sobre el estado general",
  "score_estimado": number,
  "mejoras_titulo": ["string", "string"],
  "mejoras_descripcion": ["string"],
  "mejoras_precio": "string",
  "alertas": ["string"],
  "prioridad": "alta|media|baja",
  "titulo_sugerido": "string"
}`;

    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':process.env.ANTHROPIC_API_KEY||'',
        'anthropic-version':'2023-06-01',
        'anthropic-beta':'web-search-2025-03-05'
      },
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1500,
        tools:[{type:'web_search_20250305',name:'web_search'}],
        messages:[{role:'user',content:prompt}]
      })
    });
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data.error?.message||'Error IA'});
    const text=data.content?.find(b=>b.type==='text')?.text||'';
    const match=text.match(/\{[\s\S]*\}/);
    if(!match)return res.status(500).json({error:'Sin JSON en respuesta',raw:text.substring(0,200)});
    res.json({ok:true,data:JSON.parse(match[0])});
  }catch(e){res.status(500).json({error:e.message});}
});

// 6. IA PARA RECLAMOS
app.post('/ai/reclamo',async(req,res)=>{
  const{tipo,descripcion,producto,dias_abierto,historial}=req.body;
  try{
    const prompt=`Sos el equipo de atención al cliente de NIVIKO, una empresa argentina que vende en MercadoLibre.
    
Reclamo recibido:
- Tipo: ${tipo||'sin_especificar'}
- Producto: ${producto}
- Días abierto: ${dias_abierto||0}
- Descripción del comprador: "${descripcion}"
- Historial de mensajes: ${JSON.stringify(historial||[])}

Respondé SOLO con JSON válido:
{
  "tipo_detectado": "no_llego|llegó_dañado|no_era_lo_esperado|quiere_devolver|otro",
  "urgencia": "alta|media|baja",
  "respuesta_sugerida": "string - respuesta completa en español, profesional y empática",
  "acciones_recomendadas": ["string"],
  "escalar": boolean,
  "tiempo_respuesta_max": "string"
}`;

    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':process.env.ANTHROPIC_API_KEY||'',
        'anthropic-version':'2023-06-01'
      },
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{role:'user',content:prompt}]
      })
    });
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data.error?.message||'Error IA'});
    const text=data.content?.find(b=>b.type==='text')?.text||'';
    const match=text.match(/\{[\s\S]*\}/);
    if(!match)return res.status(500).json({error:'Sin JSON',raw:text.substring(0,200)});
    res.json({ok:true,data:JSON.parse(match[0])});
  }catch(e){res.status(500).json({error:e.message});}
});


// ── OCR DE FACTURA (Claude Vision) ────────────────────────────────────────────
// ── ITEMS (para conversión) ───────────────────────────────────────────────────
app.get('/plataforma/items',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{seller_id,limit=50}=req.query;
  try{
    const r=await fetch(`${ML}/users/${seller_id}/items/search?status=active&limit=${limit}`,{headers:hdr(token)}).then(r=>r.json());
    const rawIds=(r.results||r.items||[]);
    const ids=rawIds.map(x=>typeof x==='string'?x:(x.id||x)).filter(Boolean);
    if(!ids.length)return res.json({items:[],total:0});
    const chunks=[];for(let i=0;i<ids.length;i+=20)chunks.push(ids.slice(i,i+20));
    const items=[];
    for(const chunk of chunks){
      const det=await fetch(`${ML}/items?ids=${chunk.join(',')}&attributes=id,title,price,seller_sku,status`,{headers:hdr(token)}).then(r=>r.json());
      const arr=Array.isArray(det)?det:(det.results||[]);
      arr.forEach(d=>{
        const it=(d.code===200&&d.body)?d.body:d;
        if(!it?.id)return;
        items.push({id:it.id,title:it.title,price:it.price,seller_sku:it.seller_sku,status:it.status});
      });
    }
    res.json({items,total:items.length});
  }catch(e){res.status(500).json({error:e.message});}
});

// ── VISITAS POR ITEM ─────────────────────────────────────────────────────────
app.get('/plataforma/visitas',async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token)return res.status(401).json({error:'Token requerido'});
  const{item_id,date_from,date_to}=req.query;
  if(!item_id)return res.status(400).json({error:'item_id requerido'});
  try{
    // ML endpoint: /items/{id}/visits/time_window
    const url=`${ML}/items/${item_id}/visits/time_window?last=30&unit=day&ending=${date_to||new Date().toISOString().split('T')[0]}`;
    const r=await fetch(url,{headers:hdr(token)});
    if(!r.ok)return res.json({total_visits:0,error:`ML ${r.status}`});
    const d=await r.json();
    // Sum all visits in the time window
    const total=(d.results||[]).reduce((s,x)=>s+(x.total||x.visits||0),0);
    res.json({total_visits:total||d.total||0,raw:d.results?.slice(0,3)});
  }catch(e){res.status(500).json({error:e.message,total_visits:0});}
});

app.post('/ai/ocr-factura', async(req,res)=>{
  try{
    const {image_base64, media_type} = req.body;
    if(!image_base64) return res.status(400).json({error:'image_base64 requerido'});
    const isPDF = media_type === 'application/pdf';
    const prompt = `Analiza esta factura o remito y extrae TODOS los datos en JSON.
Devuelve SOLO el JSON sin markdown ni texto extra.
Estructura requerida:
{
  "cliente": "nombre del cliente",
  "nro_factura": "numero de factura si hay, sino null",
  "fecha": "YYYY-MM-DD si hay fecha, sino null",
  "items": [
    {
      "codigo": "codigo o SKU si hay, sino null",
      "descripcion": "descripcion completa del producto",
      "cantidad": 1,
      "precio_unitario_siva": 0,
      "descuento_pct": 0,
      "iva_pct": 21,
      "precio_total_siva": 0
    }
  ],
  "total_siva": 0,
  "total_iva": 0,
  "total_civa": 0,
  "forma_pago": "CONTADO o FINANCIADO o 30-60-90 o OTRO",
  "notas": null
}
Precios en ARS. Extraer todos los items. Si un campo no existe, null o 0.`;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if(!apiKey) return res.status(500).json({error:'ANTHROPIC_API_KEY no configurada'});
    const headers = {
      'Content-Type':'application/json',
      'x-api-key': apiKey,
      'anthropic-version':'2023-06-01'
    };
    if(isPDF) headers['anthropic-beta'] = 'pdfs-2024-09-25';
    const msgContent = isPDF
      ? [{type:'document',source:{type:'base64',media_type:'application/pdf',data:image_base64}},{type:'text',text:prompt}]
      : [{type:'image',source:{type:'base64',media_type:media_type||'image/jpeg',data:image_base64}},{type:'text',text:prompt}];
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers,
      body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:3000,messages:[{role:'user',content:msgContent}]})
    });
    const rawData = await r.json();
    if(!r.ok){
      console.error('Claude API error:', JSON.stringify(rawData));
      return res.status(r.status).json({error: rawData?.error?.message||'Claude API error', type: rawData?.error?.type});
    }
    const text = rawData.content?.[0]?.text||'';
    let parsed;
    try{ parsed = JSON.parse(text.replace(/```json|```/g,'').trim()); }
    catch(e){ return res.status(422).json({error:'No se pudo parsear respuesta', raw:text.substring(0,300)}); }
    res.json({ok:true, data:parsed});
  } catch(e){
    console.error('OCR error:',e.message);
    res.status(500).json({error:e.message});
  }
});

// ── CLAUDE AI PROXY (evita CORS desde el browser) ───────────────────────────
app.post('/ai/chat', async(req,res)=>{
  try{
    const {model='claude-sonnet-4-5', max_tokens=1000, system, messages} = req.body;
    if(!messages||!messages.length) return res.status(400).json({error:'messages requerido'});
    const body = {model, max_tokens, messages};
    if(system) body.system = system;
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY||'',
        'anthropic-version':'2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    res.status(r.status).json(d);
  }catch(e){res.status(500).json({error:e.message});}
});

// ── MERCADOADS API v2 ────────────────────────────────────────────────────────
// Paso 1: obtener advertiser_id del seller
app.get('/ads/advertiser', async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token) return res.status(401).json({error:'Token requerido'});
  const {seller_id}=req.query;
  try{
    // Endpoint oficial para obtener advertiser_id
    const r=await fetch(`${ML}/product-ads/v2/advertisers?user_id=${seller_id}`,{headers:hdr(token)});
    const d=await r.json();
    res.json({status:r.status, data:d, advertiser_id: d.results?.[0]?.advertiser_id || d.advertiser_id || null});
  }catch(e){res.status(500).json({error:e.message});}
});

// Diagnóstico — prueba endpoints reales de ML Ads v2
app.get('/ads/diagnostico', async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token) return res.status(401).json({error:'Token requerido'});
  const {seller_id}=req.query;
  const h=hdr(token);
  const endpoints=[
    `/product-ads/v2/advertisers?user_id=${seller_id}`,
    `/product-ads/v1/accounts/${seller_id}`,
    `/users/${seller_id}/advertising/account`,
  ];
  const results={};
  for(const ep of endpoints){
    try{
      const r=await fetch(ML+ep,{headers:h});
      const body=await r.json().catch(()=>({}));
      results[ep]={status:r.status, ok:r.ok, preview:JSON.stringify(body).substring(0,150)};
    }catch(e){results[ep]={error:e.message};}
  }
  res.json({seller_id,results});
});

// Métricas de ads usando advertiser_id (ML Product Ads v2)
app.get('/ads/metricas', async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token) return res.status(401).json({error:'Token requerido'});
  const{seller_id,date_from,date_to}=req.query;
  const h=hdr(token);
  try{
    // Primero obtener advertiser_id
    const advR=await fetch(`${ML}/product-ads/v2/advertisers?user_id=${seller_id}`,{headers:h});
    const advD=await advR.json();
    const advId=advD.results?.[0]?.advertiser_id||advD.advertiser_id;
    if(!advId) return res.json({ok:false, error:'No se encontró advertiser_id', raw:advD, status:advR.status});

    // Obtener métricas del advertiser
    const metrics='clicks,prints,ctr,cost,cpc,acos,roas,direct_amount,total_amount,direct_units_quantity,units_quantity';
    const url=`${ML}/product-ads/v2/advertisers/${advId}/metrics?date_from=${date_from}&date_to=${date_to}&aggregation_type=total&metrics=${metrics}`;
    const metR=await fetch(url,{headers:h});
    const metD=await metR.json();
    if(!metR.ok) return res.json({ok:false, error:metD, url, status:metR.status});

    // Normalizar respuesta
    const m=metD.results?.[0]||metD;
    res.json({
      ok:true,
      advertiser_id:advId,
      metricas:{
        spent:   m.cost||m.spent||0,
        clicks:  m.clicks||0,
        prints:  m.prints||m.impressions||0,
        ctr:     m.ctr||0,
        cpc:     m.cpc||0,
        acos:    m.acos||0,
        roas:    m.roas||0,
        direct_amount:  m.direct_amount||m.attributed_sales||0,
        total_amount:   m.total_amount||m.total_sales||0,
        direct_units:   m.direct_units_quantity||0,
        total_units:    m.units_quantity||0,
      }
    });
  }catch(e){res.status(500).json({error:e.message});}
});

// Top items por gasto en ads (v2)
app.get('/ads/items', async(req,res)=>{
  const token=req.headers['x-ml-token'];
  if(!token) return res.status(401).json({error:'Token requerido'});
  const{seller_id,date_from,date_to,limit=20}=req.query;
  const h=hdr(token);
  try{
    // Obtener advertiser_id primero
    const advD=await fetch(`${ML}/product-ads/v2/advertisers?user_id=${seller_id}`,{headers:h}).then(r=>r.json()).catch(()=>({}));
    const advId=advD.results?.[0]?.advertiser_id||advD.advertiser_id;
    if(!advId) return res.json({ok:false,items:[],error:'No advertiser_id'});

    const metrics='clicks,prints,cost,cpc,acos,roas,direct_amount';
    const url=`${ML}/product-ads/v2/advertisers/${advId}/metrics?date_from=${date_from}&date_to=${date_to}&aggregation_type=item&metrics=${metrics}&limit=${limit}&sort_by=cost&sort_order=desc`;
    const r=await fetch(url,{headers:h});
    const d=await r.json();
    const items=(d.results||d.items||[]).map(i=>({
      id:i.item_id||i.id, spent:i.cost||0, clicks:i.clicks||0,
      prints:i.prints||0, acos:i.acos||0, roas:i.roas||0,
      sales:i.direct_amount||0, units:i.direct_units_quantity||0,
    }));
    res.json({ok:true,items,total:d.paging?.total||items.length});
  }catch(e){res.status(500).json({error:e.message,items:[]});}
});

const PORT=process.env.PORT||3000;
app.get('/version',(req,res)=>res.json({version:'6.4',iva_formula:'venta - venta/(1+ivaPct)',iibb_formula:'ventaSinIva * 0.04',date:'2026-05-12'}));
app.listen(PORT,()=>console.log('NIVIKO Proxy v6.4 - Puerto '+PORT));
module.exports=app;
