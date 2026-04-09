const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ML_API = 'https://api.mercadolibre.com';
const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';

// ── COSTOS DE ENVÍO POR CORDÓN ────────────────────────────
const CORDON_COSTOS = { 1: 3330, 2: 5355, 3: 6600 };

// ── MAPEO DE ZONAS ────────────────────────────────────────
// Ciudad → número de cordón (1=CABA, 2=1er cordón, 3=2do cordón)
const ZONA_MAP = {"11 de septiembre":3,"9 de abril":3,"abasto":3,"acassuso":2,"adolf sourdeaux":3,"adrogue":3,"adrogué":3,"aeropuerto ezeiza":3,"aeropuerto internacional ezeiza":3,"alberti pilar":3,"aldo bonzi":3,"alejandro korn":3,"almirante brown":3,"almirante brown san josé":3,"alto los cardales":3,"altos de san lorenzo":3,"argentina":3,"arturo segui":3,"avellaneda":2,"avellaneda dock sud":2,"avellaneda m":2,"banfield":2,"banfield (villa centenario)":2,"banfield barrio sitra":2,"barrio el cazador":3,"barrio san josé (almirante brown)":3,"beccar":2,"béccar":2,"belén de escobar":3,"bella vista":3,"bella vista san miguel":3,"benavidez":3,"benavídez":3,"berazategui":3,"bernal":2,"bernal (quilmes)":2,"bernal oeste":2,"billinghurst":3,"bolivar":3,"bosques":3,"brandsen":3,"burzaco":2,"caba":1,"caballito":1,"caballito (caba)":1,"cañuelas":3,"capilla del señor":3,"caseros":2,"casilda":3,"castelar":2,"castelar norte":2,"castelar sur":2,"chascomús":3,"city bell":2,"claypole":3,"coghlan":1,"colonia san miguel":3,"constitución":1,"córdoba capital":3,"coronel dorrego":3,"crypton":3,"darregueira":3,"dock sud":2,"don bosco":2,"don torcuato":3,"dorrego":3,"dto. san isidro":2,"edesur":2,"el jagüel":3,"el palomar":2,"el talar":3,"ensenada":2,"escobar":3,"esteban echeverría":3,"ezeiza":3,"ezpeleta":2,"ezpeleta oeste":2,"fatima":3,"florencio varela":3,"florida":2,"florida este":2,"florida oeste":2,"floresta":1,"flores":1,"general pacheco":3,"general rodriguez":3,"glew":3,"gonzalez catan":3,"grand bourg":3,"guernica":3,"guillermo hudson":3,"gutierrez":2,"haedo":2,"hurlingham":2,"ing. maschwitz":3,"ituzaingo":2,"jose c paz":3,"jose leon suarez":2,"jose marmol":2,"junin":3,"la tablada":2,"la lonja":3,"la lucila":2,"la reja":3,"lanus":2,"lanús":2,"lanús este":2,"lanús oeste":2,"llavallol":2,"llano":3,"loma hermosa":2,"lomas de zamora":2,"lomas del mirador":2,"longchamps":3,"los polvorines":3,"lozano":3,"luján":3,"lujan":3,"magdalena":3,"malvinas argentinas":3,"manuel b. gonnet":2,"maquinista savio":3,"mar del plata":3,"mariano acosta":3,"martinez":2,"matanza":2,"merlo":3,"mercedes":3,"merlo norte":3,"merlo sur":3,"monte grande":3,"moreno":3,"moron":2,"morón":2,"munro":2,"muñiz":2,"norberto de la riestra":3,"pablo nogues":3,"palermo":1,"palermo (caba)":1,"pablo podesta":3,"paso del rey":3,"pilar":3,"piñeiro":2,"plátanos":3,"platanos":3,"posadas":3,"pque. leloir":2,"pque. san martin":3,"presidente sarmiento":2,"puente 12":2,"quilmes":2,"quilmes centro":2,"quilmes oeste":2,"ramos mejia":2,"ramos mejía":2,"ranelagh":2,"remedios de escalada":2,"retiro":1,"recoleta":1,"rincon de milberg":3,"río ceballos":3,"roman mejia":3,"rosario":3,"ruben dario":3,"saavedra":1,"san antonio de padua":3,"san bernardo":3,"san fernando":2,"san francisco":3,"san francisco solano":3,"san isidro":2,"san justo":2,"san martín":2,"san martin":2,"san miguel":3,"san nicolas":3,"san pedro":3,"santa rosa":3,"santos lugares":2,"sarandí":2,"sarandi":2,"serodino":3,"sol y verde":3,"tapiales":2,"temperley":2,"tigre":3,"tortuguitas":3,"tres de febrero":2,"trujui":3,"tuberculosis":3,"tucuman":3,"tucumán":3,"turdera":2,"unquillo":3,"v. ballester":2,"v. bosch":2,"v. dominico":2,"v. madero":2,"v. lynch":2,"v. martelli":2,"v. martelli norte":2,"v. sarmiento":2,"v. tesei":2,"v. zagala":2,"villa adelina":2,"villa amelia":3,"villa ballester":2,"villa bosch":2,"villa del parque":1,"villa devoto":1,"villa gesell":3,"villa lynch":2,"villa madero":2,"villa martelli":2,"villa tesei":2,"villa urquiza":1,"villa zagala":2,"wilde":2,"william c. morris":3,"zarate":3,"zárate":3,"zeballos":3};

// ── BASE DE PRODUCTOS ─────────────────────────────────────
// 265 productos con SKU, costo, IVA y si paga publicidad
const PRODUCTS_DB = [{"sku":"15-FD0095WM","desc":"NOTEBOOK HP","usd":300.0,"ars":420000.0,"iva":10.5,"pub":false},{"sku":"29P387","desc":"Inflador De Pie Jilong 38 Cm Pileta, Pelota Colchon Inflable Color Negro","usd":2.0,"ars":2800.0,"iva":21,"pub":true},{"sku":"29P390","desc":"Inflador Doble Accion 30cm Pileta Pelota Colchon Inflable Color Negro","usd":3.0,"ars":4200.0,"iva":21,"pub":true},{"sku":"37213","desc":"Ballena Gigante Inflable Flotador Jilong Pileta Para Agua","usd":3.5,"ars":4900.0,"iva":21,"pub":true},{"sku":"37262","desc":"Flotador Bebé Asiento Jilong Kiddie Salvavidas Pileta 2-4 Años","usd":3.5,"ars":4900.0,"iva":21,"pub":true},{"sku":"37275","desc":"Colchoneta Flotadora Sillon Con Techo Red Inflable Jilong","usd":8.0,"ars":11200.0,"iva":21,"pub":true},{"sku":"37342","desc":"Colchoneta Flotadora Jilong Inflable Aro Frutilla Grande","usd":5.0,"ars":7000.0,"iva":21,"pub":true},{"sku":"37346","desc":"INFLABLE JILONG","usd":12.0,"ars":16800.0,"iva":21,"pub":true},{"sku":"37347","desc":"Colchoneta Inflable Media Sandía 180cm Para Pileta Flotador","usd":9.0,"ars":12600.0,"iva":21,"pub":true},{"sku":"37348","desc":"Colchoneta Flotadora Inflable Jilong Anana Piña Gigante","usd":9.4,"ars":13160.0,"iva":21,"pub":true},{"sku":"37351","desc":"Colchoneta Flotadora Jilong Inflable Palito Paleta Helado","usd":6.35,"ars":8890.0,"iva":21,"pub":true},{"sku":"37423","desc":"Colchoneta Flotadora Inflable Jilong Paleta Lolli Pop Multicolor","usd":7.5,"ars":10500.0,"iva":21,"pub":true},{"sku":"37425","desc":"Colchoneta Flotadora Jilong Inflable Papas Fritas Mc Burger","usd":8.1,"ars":11340.0,"iva":21,"pub":true},{"sku":"37426","desc":"Colchoneta Flotadora Jilong Inflable Cactus","usd":7.5,"ars":10500.0,"iva":21,"pub":true},{"sku":"37428","desc":"Colchoneta Flotadora Jilong Inflable Unicornio Gigante Blanco","usd":29.4,"ars":41160.0,"iva":21,"pub":true},{"sku":"37430","desc":"Colchoneta Flotadora Jilong Inflable Pelicano Gigante","usd":14.75,"ars":20650.0,"iva":21,"pub":true},{"sku":"6004-","desc":"Tendedero Tender Slim Mor Compact, Retráctil Y Reforzado Sin Alas Color Blanco","usd":5.0,"ars":7000.0,"iva":21,"pub":true},{"sku":"6005","desc":"Tender Para Ropa Mor Plegable Acero Color Blanco","usd":6.0,"ars":8400.0,"iva":21,"pub":true},{"sku":"6104","desc":"Tender Para Ropa Mor 6104 Plegable Acero Color Blanco","usd":5.0,"ars":7000.0,"iva":21,"pub":true},{"sku":"6608","desc":"Coche Bebe Recién Nacido Paseo Cuna Paraguita","usd":35.0,"ars":49000.0,"iva":21,"pub":true},{"sku":"6920388616164","desc":"CENTRO DE JUEGOS INFLABLE JILONG","usd":21.0,"ars":29400.0,"iva":21,"pub":true},{"sku":"7220","desc":"Salvavidas Jilong Bote Para Chicos Pileta 100 X 70 Cm","usd":3.0,"ars":4200.0,"iva":21,"pub":true},{"sku":"82QD00DHUS","desc":"NOTEBOOK LENOVO","usd":300.0,"ars":420000.0,"iva":10.5,"pub":false},{"sku":"8629","desc":"Coche Bebe Recién Nacido Paseo Cuna Mecedor 3 Pos Toing","usd":45.0,"ars":63000.0,"iva":21,"pub":true},{"sku":"97224","desc":"Centro De Juego C/ Tobogan Y Tiro Aro Inflable Pileta Jilong","usd":18.95,"ars":26530.0,"iva":21,"pub":true},{"sku":"A-5120","desc":"RELOJ SMARTWATCH","usd":2.6,"ars":3640.0,"iva":21,"pub":true},{"sku":"A-6700-B","desc":"AURICULARES IN EAR","usd":2.8,"ars":3920.0,"iva":21,"pub":true},{"sku":"A-6700-N","desc":"AURICULARES IN EAR","usd":2.8,"ars":3920.0,"iva":21,"pub":true},{"sku":"A6S","desc":"Auriculares In-ear Inalámbricos Bluetooth A6s Negro Zhome","usd":2.8,"ars":3920.0,"iva":21,"pub":true},{"sku":"Araguaia","desc":"Parrilla Móvil Mor Araguaia 44cm De Ancho 75cm De Alto 72cm De Profundidad Negra","usd":5.0,"ars":7000.0,"iva":21,"pub":true},{"sku":"AUSTIN","desc":"Silla de Oficina Austin Negra","usd":22.0,"ars":30800.0,"iva":21,"pub":true},{"sku":"BOSTON-B","desc":"Silla De Oficina Escritorio Ejecutiva Lumba Zhome Color Negro Y Blanco Material Del Tapizado Mesh Z-2106-b","usd":26.0,"ars":36400.0,"iva":21,"pub":true},{"sku":"Boston-N","desc":"Silla Sillon Oficina Gerencial Smart Tech Ws6119 Color Negro Material Del Tapizado Cuero Sintético","usd":25.0,"ars":35000.0,"iva":21,"pub":true},{"sku":"DORAL","desc":"Silla De Oficina Alta Escritorio Ejecutiva Gerencial Zhome Color Gris Material Del Tapizado Mesh","usd":53.0,"ars":74200.0,"iva":21,"pub":true},{"sku":"DORAL-N","desc":"Silla De Oficina Alta Escritorio Ejecutiva Gerencial Zhome Color Negro Material Del Tapizado Mesh","usd":50.0,"ars":70000.0,"iva":21,"pub":true},{"sku":"DT70/32GB","desc":"Pendrive Kingston Datatraveler 70 Dt70 32gb 3.2 Gen 1 Tipo C","usd":3.0,"ars":4200.0,"iva":10.5,"pub":false},{"sku":"DTX/64GB","desc":"Pendrive Kingston Datatraveler Exodia Dtx/64 64gb 3.2 Gen Color Negro","usd":3.4,"ars":4760.0,"iva":10.5,"pub":false},{"sku":"DTXM/128GB","desc":"Pendrive Unidad Flash Kingston Datatraveler Exodia M De 128 Gb Dtxm 3.2 Color Rojo","usd":6.0,"ars":8400.0,"iva":10.5,"pub":false},{"sku":"NVK-1939-GC-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Niviko Reforzada Negro/Gris","usd":38.5,"ars":57680.0,"iva":21,"pub":true},{"sku":"NVK-211A-N-X2","desc":"Taburete Banqueta Alta Set X2 Reforzada Zhome Tolix Metal Negro","usd":22.4,"ars":33600.0,"iva":21,"pub":true},{"sku":"NVK-211A-N-X4","desc":"Taburete Banqueta Alta Set X4 Reforzada Tolix Metal Zhome","usd":44.8,"ars":67200.0,"iva":21,"pub":true},{"sku":"NVK-222-B-X6","desc":"Silla De Comedor Cocina Tolix Reforzada De Hierro X6 Zhome Blanco","usd":71.4,"ars":107100.0,"iva":21,"pub":true},{"sku":"NVK-222-N-X6","desc":"Silla Comedor Tolix Reforzada De Hierro 6 Unidades Niviko Negro","usd":71.4,"ars":107100.0,"iva":21,"pub":true},{"sku":"NVK-222-NX4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Negro","usd":47.6,"ars":71400.0,"iva":21,"pub":true},{"sku":"NVK-222-R-X4","desc":"Silla De Comedor Tolix Reforzada De Hierro 4 Unidades Niviko Rojo","usd":47.6,"ars":71400.0,"iva":21,"pub":true},{"sku":"NVK-233-B-X6","desc":"Silla Comedor Apoyabrazo Tolix X6 Zhome Blanco","usd":79.5,"ars":119280.0,"iva":21,"pub":true},{"sku":"NVK-233-G-X6","desc":"Silla Comedor Apoyabrazo Tolix X6 Zhome Gris","usd":79.5,"ars":119280.0,"iva":21,"pub":true},{"sku":"NVK-233-N-X4","desc":"Silla Comedor Apoyabrazo Tolix X4 Negro","usd":53.0,"ars":79520.0,"iva":21,"pub":true},{"sku":"NVK-233-R-X2","desc":"Silla Comedor Apoyabrazo Tolix Reforzada X2 Rojo","usd":26.5,"ars":39760.0,"iva":21,"pub":true},{"sku":"NVK-244A-B-X2","desc":"Banqueta Con Respaldo Tolix Alta Set X2 Reforzada Metal Blanco","usd":24.6,"ars":36960.0,"iva":21,"pub":true},{"sku":"NVK-244A-N-X4","desc":"Banqueta Con Respaldo Alta Set X4 Reforzada Metal Tolix Negro","usd":49.3,"ars":73920.0,"iva":21,"pub":true},{"sku":"NVK-244A-R-X2","desc":"Banqueta C/respaldo Alta Set X2 Reforzada Metal Tolix Rojo","usd":24.6,"ars":36960.0,"iva":21,"pub":true},{"sku":"NVK-244A-R-X4","desc":"Banqueta C/respaldo Alta Set X4 Reforzada Metal Tolix Rojo","usd":49.3,"ars":73920.0,"iva":21,"pub":true},{"sku":"NVK-3000-N","desc":"Silla Gamer Ergonómica Reclinable Negro","usd":38.1,"ars":57120.0,"iva":21,"pub":true},{"sku":"NVK-3068-N","desc":"Silla De Oficina Reclinable Sillon Gerencial Ecocuero Negro","usd":37.3,"ars":56000.0,"iva":21,"pub":true},{"sku":"NVK-4068-N","desc":"Silla Oficina Reclinable Gerencial Ecocuero Negro","usd":39.2,"ars":58800.0,"iva":21,"pub":true},{"sku":"NVK-6180-N-X2","desc":"Banqueta Taburete Alta Desayunador Cromada X2 Negro","usd":31.3,"ars":46900.0,"iva":21,"pub":true},{"sku":"NVK-6190-B-X2","desc":"Banqueta Taburete Alta Desayunador Cromada X2 Blanco","usd":41.5,"ars":62300.0,"iva":21,"pub":true},{"sku":"NVK-6190-N-X2","desc":"Banqueta Taburete Alta Desayunador Cromada X2 Negro","usd":41.5,"ars":62300.0,"iva":21,"pub":true},{"sku":"NVK-8092-G","desc":"Silla De Oficina Ergonomica Zhome Soporte Lumbar Gris","usd":31.7,"ars":47600.0,"iva":21,"pub":true},{"sku":"NVK-9085-B-X2","desc":"Banqueta Tulip Alta Regulable Cromada Set X2 Blanco","usd":33.1,"ars":49700.0,"iva":21,"pub":true},{"sku":"NVK-9085-N-X2","desc":"Banqueta Tulip Alta Regulable Cromada Set X2 Negro","usd":33.1,"ars":49700.0,"iva":21,"pub":true},{"sku":"NVK-AF501","desc":"Freidora Aire Digital 3.8L 1500w Negro","usd":14.3,"ars":21490.0,"iva":21,"pub":true},{"sku":"NVK-AF502","desc":"Freidora Aire Digital 5.5L 1500w Negro","usd":16.7,"ars":25060.0,"iva":21,"pub":true},{"sku":"NVK-AN102","desc":"Anafe Eléctrico 2 Hornallas 2000w Negro","usd":6.7,"ars":10080.0,"iva":21,"pub":true},{"sku":"NVK-CF101","desc":"Cafetera Eléctrica De Filtro 750ml 6 Tazas","usd":7.5,"ars":11200.0,"iva":21,"pub":true},{"sku":"NVK-MP180-N-MADERA","desc":"Mesa Plegable 180x74 Camping Reforzada Negro/madera","usd":23.3,"ars":35000.0,"iva":21,"pub":true},{"sku":"NVK-MP180-N-OPENBOX","desc":"Mesa Plegable 180x70 Reforzada Open Box Negro","usd":19.4,"ars":29120.0,"iva":21,"pub":true},{"sku":"NVK-MP180-N-RATAN","desc":"Mesa Plegable 180x74 Camping Ratan Negro","usd":23.3,"ars":35000.0,"iva":21,"pub":true},{"sku":"NVK-P8280","desc":"Parlante 8 Portátil Bluetooth Karaoke USB","usd":15.4,"ars":23100.0,"iva":21,"pub":true},{"sku":"NVK-SM103","desc":"Sandwichera Eléctrica Grill 750w Acero Negro","usd":6.8,"ars":10220.0,"iva":21,"pub":true},{"sku":"NVK-SM107","desc":"Sandwichera 3 En 1 750w Grill Waffles Negro","usd":11.2,"ars":16800.0,"iva":21,"pub":true},{"sku":"NVK-YG106","desc":"Yogurtera Eléctrica Acero Inoxidable 4 Jarros","usd":7.0,"ars":10500.0,"iva":21,"pub":true},{"sku":"NVK117-B-X4","desc":"Silla Living Comedor Cocina Set X4 Tapizada Reforzada Niviko Blanco","usd":39.2,"ars":58800.0,"iva":21,"pub":true},{"sku":"NVK22G-44T","desc":"Soporte TV C/Inclinación 32-55 Negro","usd":1.8,"ars":2744.0,"iva":21,"pub":true},{"sku":"NVK22G-64T","desc":"Soporte TV C/Inclinación 32-70 Negro","usd":3.0,"ars":4480.0,"iva":21,"pub":true},{"sku":"NVK68-443","desc":"Soporte TV Brazo Extensible 26-52 Negro","usd":3.6,"ars":5390.0,"iva":21,"pub":true},{"sku":"NVK78-446","desc":"Soporte TV Brazo Extensible 32-75 Negro","usd":9.2,"ars":13790.0,"iva":21,"pub":true},{"sku":"NVK-A5120","desc":"Reloj Smartwatch Smartband Z5120","usd":2.3,"ars":3500.0,"iva":21,"pub":true},{"sku":"NVK-A5130","desc":"Reloj Smartwatch Smartband Z5130","usd":5.0,"ars":7560.0,"iva":21,"pub":true},{"sku":"TAMPA","desc":"Silla Oficina Ejecutiva Negra Malla Z-103","usd":13.8,"ars":20720.0,"iva":21,"pub":true},{"sku":"kl22-44f","desc":"Soporte Vt-bracket Kl22-44f De Pared Para Tv/monitor De 55 Color Negro","usd":1.8,"ars":2520.0,"iva":10.5,"pub":true}];

// Build product lookup map
const PROD_MAP = {};
PRODUCTS_DB.forEach(p => { PROD_MAP[p.sku.toLowerCase().trim()] = p; });

function findProduct(sku) {
  if (!sku) return null;
  const key = String(sku).toLowerCase().trim();
  if (PROD_MAP[key]) return PROD_MAP[key];
  // Partial match
  for (const [k, v] of Object.entries(PROD_MAP)) {
    if (key.startsWith(k) || k.startsWith(key)) return v;
  }
  return null;
}

function getCordon(ciudad) {
  if (!ciudad) return 3;
  const key = String(ciudad).toLowerCase().trim();
  return ZONA_MAP[key] || 3;
}

// ── CÁLCULO DE RENTABILIDAD REAL ─────────────────────────
// Basado en lo que ML realmente descuenta de cada venta
function calcularRentabilidad(order, shipmentData) {
  const item = order.order_items?.[0] || {};
  const precioVenta = order.total_amount || 0;
  const sku = item.item?.seller_sku || item.item?.id || '';
  const prod = findProduct(sku);

  // 1. COMISIÓN ML — viene en sale_fee de la orden (dato real de ML)
  const comisionML = Math.abs(item.sale_fee || precioVenta * 0.14);

  // 2. COSTO CUOTAS — viene en payments si aplica
  const costoCuotas = order.payments?.reduce((s, p) => s + Math.abs(p.installment_amount || 0), 0) || 0;

  // 3. COSTO PRODUCTO
  const costoProducto = prod ? prod.ars : 0;

  // 4. IVA — según tipo de producto
  const ivaPct = prod ? prod.iva / 100 : 0.21;
  const ivaAmt = (precioVenta / (1 + ivaPct)) * ivaPct;

  // 5. PUBLICIDAD — 5% sobre precio publicado, solo si el producto paga publicidad
  const pubAmt = (prod && prod.pub === false) ? 0 : precioVenta * 0.05;

  // 6. IIBB — 5% siempre (ML lo descuenta de todas las provincias)
  const iibbAmt = precioVenta * 0.05;

  // 7. ENVÍO — lógica exacta según capturas de ML
  // La API de ML devuelve en order.shipping.cost el valor NETO del envío:
  //   - Positivo (+): ML le cobra al comprador y te lo transfiere (ingreso)
  //   - Negativo (-): ML te cobra a vos el envío (egreso)
  //   - Cero (0): neutro (Full: comprador paga y ML absorbe)

  const logisticType = shipmentData?.logistic_type || order.shipping?.logistic_type || '';
  const ciudad = shipmentData?.receiver_address?.city?.name ||
                 order.shipping?.receiver_address?.city?.name || '';
  const estado = shipmentData?.receiver_address?.state?.name || '';

  // Detectar tags de la orden para modalidad
  const tags = order.tags || [];
  const esFlex = logisticType.includes('flex') || tags.includes('flex') || tags.includes('ME2');
  const esFull = logisticType.includes('fulfillment') || logisticType === 'self_service_fulfillment' || tags.includes('fulfillment');

  let modalidad, costoEnvio, bonifEnvio;

  if (esFull) {
    // FULL: El comprador paga el envío, ML lo cobra y lo absorbe → NEUTRO para el vendedor
    // shipping.cost suele ser 0 o el comprador paga = vendedor cobra = neto 0
    modalidad = 'Full';
    costoEnvio = 0;
    bonifEnvio = 0;

  } else if (esFlex) {
    // FLEX: ML otorga una bonificación por el envío (viene positiva en shipping.cost)
    // Pero el vendedor paga el costo real del cordón según la zona del destino
    // Ganancia envío = bonificacion ML - costo cordón (puede ser negativo si el cordón es caro)
    modalidad = 'Flex';
    const cordon = getCordon(ciudad);
    const costoCordon = CORDON_COSTOS[cordon] || CORDON_COSTOS[3];
    // ML paga una bonificación que figura como positivo en shipping
    bonifEnvio = Math.abs(shipmentData?.cost || order.shipping?.cost || 0);
    // El costo real que NIVIKO paga al courier es el del cordón
    costoEnvio = Math.max(0, costoCordon - bonifEnvio);

  } else {
    // CORREO / DESPACHO: El costo de envío va A CARGO DEL VENDEDOR
    // ML te descuenta el costo del envío directamente del pago
    // shipping.cost viene negativo (ej: -8710 en imagen 2)
    modalidad = 'Correo';
    const shippingCost = shipmentData?.cost ?? order.shipping?.cost ?? 0;
    // Si es negativo = te cobran a vos; si es positivo = te pagan a vos
    if (shippingCost < 0) {
      costoEnvio = Math.abs(shippingCost); // te cobran esto
    } else if (shippingCost > 0) {
      costoEnvio = -shippingCost; // te pagan (ingreso, resta del costo)
    } else {
      costoEnvio = 0;
    }
    bonifEnvio = 0;
  }

  const ganancia = precioVenta - comisionML - costoCuotas - costoProducto - ivaAmt - pubAmt - iibbAmt - costoEnvio;

  return {
    id: order.id,
    fecha: (order.date_created || '').split('T')[0],
    sku: sku || '—',
    desc: item.item?.title || '—',
    unidades: item.quantity || 1,
    ciudad,
    estado,
    modal: modalidad,
    cordon: esFlex ? (getCordon(ciudad)) : null,
    // Desglose completo igual a lo que muestra ML
    venta: precioVenta,
    comisionML: Math.round(comisionML),
    costoCuotas: Math.round(costoCuotas),
    costoProducto: Math.round(costoProducto),
    iva: Math.round(ivaAmt),
    ivaPct: prod ? prod.iva : 21,
    publicidad: Math.round(pubAmt),
    iibb: Math.round(iibbAmt),
    costoEnvio: Math.round(costoEnvio),
    bonifEnvio: Math.round(bonifEnvio),
    ganancia: Math.round(ganancia),
    pct: precioVenta > 0 ? ganancia / precioVenta : 0,
    pagaPublicidad: prod ? prod.pub : true,
    productoEncontrado: !!prod
  };
}

// ── DEBUG: ver datos RAW de una orden ────────────────────
// GET /debug/order/:id — muestra todo lo que ML devuelve para entender el cálculo
app.get('/debug/order/:id', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const orderId = req.params.id;

    // Obtener orden
    const orderResp = await fetch(`${ML_API}/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const order = await orderResp.json();

    // Obtener envío si existe
    let shipment = null;
    if (order.shipping?.id) {
      const shipResp = await fetch(`${ML_API}/shipments/${order.shipping.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      shipment = await shipResp.json();
    }

    const item = order.order_items?.[0] || {};

    // Mostrar los campos más relevantes para el cálculo
    res.json({
      orden_id: order.id,
      fecha: order.date_created,
      estado: order.status,
      precio_venta: order.total_amount,
      paid_amount: order.paid_amount,
      tags: order.tags,
      // Item
      item_sku: item.item?.seller_sku,
      item_title: item.item?.title,
      item_cantidad: item.quantity,
      item_precio_unit: item.unit_price,
      item_sale_fee: item.sale_fee,
      item_full_unit_price: item.full_unit_price,
      // Pagos
      payments: order.payments?.map(p => ({
        id: p.id,
        amount: p.total_paid_amount,
        installments: p.installments,
        installment_amount: p.installment_amount,
        transaction_amount: p.transaction_amount,
        taxes_amount: p.taxes_amount,
        shipping_cost: p.shipping_cost,
        coupon_amount: p.coupon_amount,
        operation_type: p.operation_type
      })),
      // Envío raw
      shipping_raw: {
        id: order.shipping?.id,
        cost: order.shipping?.cost,
        logistic_type: order.shipping?.logistic_type,
        mode: order.shipping?.mode,
        free_shipping: order.shipping?.free_shipping,
        free_methods: order.shipping?.free_methods
      },
      // Envío detalle (si hay shipment)
      shipment_detalle: shipment ? {
        id: shipment.id,
        type: shipment.type,
        logistic_type: shipment.logistic_type,
        mode: shipment.mode,
        cost: shipment.cost,
        cost_components: shipment.cost_components,
        base_cost: shipment.base_cost,
        tags: shipment.tags,
        ciudad: shipment.receiver_address?.city?.name,
        estado_prov: shipment.receiver_address?.state?.name,
        free_methods: shipment.free_methods
      } : null,
      // Cálculo que haría el proxy
      calculo_proxy: calcularRentabilidad(order, shipment)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'NIVIKO ML Proxy', version: '2.0.0', products: PRODUCTS_DB.length, zones: Object.keys(ZONA_MAP).length });
});

// ── AUTH: code → token ────────────────────────────────────
app.post('/auth/token', async (req, res) => {
  try {
    const { client_id, client_secret, code, redirect_uri } = req.body;
    const body = new URLSearchParams({ grant_type: 'authorization_code', client_id, client_secret, code, redirect_uri });
    const resp = await fetch(ML_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── AUTH: refresh token ───────────────────────────────────
app.post('/auth/refresh', async (req, res) => {
  try {
    const { client_id, client_secret, refresh_token } = req.body;
    const body = new URLSearchParams({ grant_type: 'refresh_token', client_id, client_secret, refresh_token });
    const resp = await fetch(ML_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── USER INFO ─────────────────────────────────────────────
app.get('/me', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ÓRDENES PAGINADAS CON RENTABILIDAD REAL ───────────────
app.get('/orders/all', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { seller_id, from, to } = req.query;
    let allOrders = [];
    let offset = 0;
    const limit = 50;
    let total = null;

    while (total === null || offset < total) {
      const params = new URLSearchParams({
        seller: seller_id,
        'order.date_created.from': from,
        'order.date_created.to': to,
        'order.status': 'paid',
        offset, limit,
        sort: 'date_desc'
      });
      const resp = await fetch(`${ML_API}/orders/search?${params}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await resp.json();
      if (!data.results || data.error) break;
      allOrders = allOrders.concat(data.results);
      total = data.paging?.total || 0;
      offset += limit;
      if (offset > 2000) break; // max 2000 órdenes por fetch
      if (allOrders.length >= total) break;
    }

    // Obtener datos de envío para cada orden (en paralelo, lotes de 10)
    const processed = [];
    const batchSize = 10;
    for (let i = 0; i < allOrders.length; i += batchSize) {
      const batch = allOrders.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(async (order) => {
        let shipmentData = null;
        if (order.shipping?.id) {
          try {
            const sr = await fetch(`${ML_API}/shipments/${order.shipping.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            shipmentData = await sr.json();
          } catch (e) {}
        }
        return calcularRentabilidad(order, shipmentData);
      }));
      processed.push(...batchResults);
    }

    res.json({ orders: processed, total: processed.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DETALLE DE UNA ORDEN ──────────────────────────────────
app.get('/orders/:id', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/orders/${req.params.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    const order = await resp.json();
    let shipmentData = null;
    if (order.shipping?.id) {
      const sr = await fetch(`${ML_API}/shipments/${order.shipping.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      shipmentData = await sr.json();
    }
    res.json(calcularRentabilidad(order, shipmentData));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DETALLE DE ENVÍO ──────────────────────────────────────
app.get('/shipments/:id', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/shipments/${req.params.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── PUBLICACIONES DEL VENDEDOR ────────────────────────────
app.get('/items', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { seller_id, sku } = req.query;
    let url = `${ML_API}/users/${seller_id}/items/search?limit=100`;
    if (sku) url += `&seller_sku=${sku}`;
    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── BÚSQUEDA DE MERCADO ───────────────────────────────────
app.get('/mercado/search', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { q, limit = 20 } = req.query;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const resp = await fetch(`${ML_API}/sites/MLA/search?q=${encodeURIComponent(q)}&limit=${limit}`, { headers });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── BÚSQUEDA POR EAN ──────────────────────────────────────
app.get('/mercado/ean', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { code } = req.query;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const resp = await fetch(`${ML_API}/sites/MLA/search?q=${encodeURIComponent(code)}&limit=20`, { headers });
    res.json(await resp.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ANÁLISIS DE COMPETIDOR ────────────────────────────────
app.get('/mercado/seller', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { q } = req.query;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    let sellerId = q;
    if (isNaN(q)) {
      const sr = await fetch(`${ML_API}/sites/MLA/search?nickname=${encodeURIComponent(q)}`, { headers });
      const sd = await sr.json();
      sellerId = sd.seller?.id || q;
    }
    const [sellerResp, itemsResp] = await Promise.all([
      fetch(`${ML_API}/users/${sellerId}`, { headers }),
      fetch(`${ML_API}/sites/MLA/search?seller_id=${sellerId}&limit=50&sort=sold_quantity_desc`, { headers })
    ]);
    const seller = await sellerResp.json();
    const itemsData = await itemsResp.json();
    res.json({ seller, items: itemsData.results || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── API DE PRODUCTOS (para el dashboard) ──────────────────
app.get('/products', (req, res) => {
  res.json({ products: PRODUCTS_DB, total: PRODUCTS_DB.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NIVIKO Proxy v2 corriendo en puerto ${PORT}`));
module.exports = app;
