export type Moment = "cole" | "antes" | "despues" | "casa";
export type Ingredient = { name: string; amount: number; unit: string; note?: string };
export type Recipe = {
  id: string; title: string; intro: string; prep: number; cook: number; wait: number;
  yield: number; yieldUnit: string; sweet: boolean; cold: boolean; freezer: boolean;
  moments: Moment[]; ingredients: Ingredient[]; steps: string[]; storage: string;
  swap: string; allergens: string[]; equipment: string;
};
const I = (name: string, amount = 0, unit = "", note?: string): Ingredient => ({name, amount, unit, note});
const R = (n: number, title: string, intro: string, prep: number, cook: number, wait: number, count: number, yieldUnit: string, sweet: boolean, cold: boolean, freezer: boolean, moments: Moment[], ingredients: Ingredient[], steps: string[], storage: string, swap: string, allergens: string[], equipment: string): Recipe => ({id: String(n).padStart(2,"0"), title, intro, prep, cook, wait, yield: count, yieldUnit, sweet, cold, freezer, moments, ingredients, steps, storage, swap, allergens, equipment});

export const recipes: Recipe[] = [
R(1,"Galletitas de banana y avena","Una tanda, varios recreos. Suaves por dentro y con el dulzor de la fruta.",5,15,0,8,"galletitas",true,true,true,["cole","casa"],
 [I("Banana",1,"unid.","madura"),I("Avena",90,"g","aprox. 1 taza"),I("Canela",0.5,"cdita."),I("Pasas",10,"g","opcional")],
 ["Precalentá el horno a 180 °C. Pisá la banana con un tenedor.","Mezclá con la avena, la canela y las pasas, si usás. Si queda muy seco, sumá una cucharada de agua.","Formá 8 galletitas en una placa con papel para horno.","Horneá entre 12 y 15 minutos. Dejá enfriar antes de guardar."],
 "Hasta 3 días en heladera, en un recipiente cerrado. Podés congelarlas separadas por papel hasta 1 mes.","Podés reemplazar las pasas por nueces picadas; en ese caso contienen frutos secos.",["Avena (puede contener gluten)"],"Horno"),
R(2,"Mini muffins de manzana","Banana, manzana y un toque de canela. Ideales para preparar una tanda.",15,20,0,12,"mini muffins",true,true,true,["cole","casa"],
 [I("Banana",1,"unid."),I("Manzana",1,"unid.","chica"),I("Huevo",1,"unid."),I("Harina integral",90,"g","aprox. ¾ taza"),I("Leche",120,"ml","½ taza"),I("Polvo de hornear",1,"cdita."),I("Canela",0.5,"cdita.")],
 ["Precalentá el horno a 180 °C. Pisá la banana y rallá la manzana lavada.","Mezclá las frutas con el huevo y la leche.","Incorporá harina, polvo de hornear y canela sin batir de más. Distribuí en 12 moldes mini antiadherentes o con pirotines.","Horneá 18 a 20 minutos, hasta que el centro esté cocido y un palillo salga sin masa húmeda. Enfriá."],
 "Hasta 3 días en heladera o 2 meses en freezer. Descongelá en heladera.","Podés usar pera rallada en lugar de manzana.",["Trigo / gluten","Huevo","Leche"],"Horno y moldes mini"),
R(3,"Garbanzos crocantes","Un puñado de algo salado, con pimentón y mucho crunch.",5,30,0,4,"porciones para compartir",false,false,false,["cole","casa"],
 [I("Garbanzos cocidos",330,"g","aprox. 2 tazas, escurridos"),I("Aceite",5,"ml","1 cdita."),I("Pimentón",0.5,"cdita."),I("Orégano"),I("Pimienta")],
 ["Precalentá el horno a 200 °C. Enjuagá y secá muy bien los garbanzos ya cocidos con un paño limpio.","Mezclalos con aceite, pimentón, orégano y pimienta.","Extendé en una sola capa y horneá 25 a 30 minutos. Movelos a mitad de cocción y vigilá que no se quemen.","Enfriá destapados. Deben quedar bien secos y crocantes."],
 "Disfrutalos el mismo día para conservar el crocante. Si quedan húmedos por dentro, mantenelos refrigerados; guardá cualquier sobrante en heladera hasta 2 días.","Podés cambiar el pimentón por comino. Usá garbanzos de lata, bien enjuagados.",[],"Horno"),
R(4,"Pochoclo con pimentón","Para una pausa salada. Pisingallo, una olla y unos minutos.",3,7,0,2,"boles",false,false,false,["cole","casa"],
 [I("Maíz pisingallo",45,"g","aprox. ¼ taza"),I("Aceite",5,"ml","1 cdita."),I("Pimentón",0.5,"cdita."),I("Orégano")],
 ["Calentá el aceite en una olla de fondo grueso, agregá el pisingallo y tapá.","Cociná a fuego medio. Mové la olla con agarraderas cada tanto, sin destapar.","Cuando pasen 2 o 3 segundos entre estallidos, apagá y esperá a que terminen.","Destapá lejos de la cara, condimentá y retirá los granos que no se abrieron."],
 "Guardá completamente frío en un recipiente seco y cerrado. Consumí en el día.","Probá con canela si preferís un aroma dulce.",[],"Olla con tapa"),
R(5,"Crackers de avena y semillas","Finitas, crocantes y listas para acompañar un dip.",10,20,5,20,"crackers",false,false,false,["cole","casa"],
 [I("Avena",90,"g","procesada; aprox. 1 taza"),I("Semillas de girasol",20,"g","2 cdas."),I("Aceite",15,"ml","1 cda."),I("Agua",80,"ml","⅓ taza"),I("Orégano")],
 ["Precalentá el horno a 180 °C. Mezclá todos los ingredientes y dejá reposar 5 minutos.","Estirá fino entre dos papeles para horno. Si se desarma, agregá agua de a una cucharadita.","Marcá unos 20 cuadrados y quitá el papel superior.","Horneá 18 a 22 minutos, hasta que estén secos y dorados. Enfriá sobre una rejilla."],
 "Hasta 5 días, completamente frías y secas, en un recipiente hermético.","Podés usar semillas de sésamo en lugar de girasol; agregan un alérgeno.",["Avena (puede contener gluten)"],"Horno"),
R(6,"Tortitas de maní y manzana","Crocante, cremoso y fresco en el mismo bocado.",5,0,0,2,"tortitas",true,false,false,["cole","casa"],
 [I("Tortitas de arroz",2,"unid."),I("Pasta de maní",10,"g","2 cditas., sin agregados"),I("Manzana",0.5,"unid."),I("Canela")],
 ["Lavá la manzana y cortala en láminas finas.","Untá las tortitas con pasta de maní.","Sumá la manzana y un toque de canela. Armá justo antes de comer."],
 "Para llevar sin frío, guardá las tortitas y la pasta por separado y llevá la manzana entera. Cortala al comer.","En casa podés usar rodajas de banana en lugar de manzana.",["Maní"],"Sin cocción"),
R(7,"Mix mendocino","Nueces, pasas y maní. Compacto para llevar de acá para allá.",3,0,0,1,"frasquito",true,false,false,["cole","casa"],
 [I("Nueces",10,"g","1 cda. picadas"),I("Maní",10,"g","1 cda., sin sal"),I("Pasas",10,"g","1 cda."),I("Cereal inflado",10,"g","2 cdas., sin azúcar agregada")],
 ["Revisá que los frutos secos y el cereal estén frescos y secos.","Mezclá y guardá en un frasquito o recipiente con tapa. Para varios días, multiplicá la receta."],
 "Hasta 1 semana en recipiente cerrado, fresco y seco, respetando la fecha de los ingredientes.","Cambiá las nueces por almendras. Si preferís, llevá una fruta fresca aparte.",["Frutos secos","Maní","Revisar gluten en el cereal"],"Sin cocción"),
R(8,"Bastones de batata","Doraditos al horno, con una salsa fresca de tomate y limón.",10,35,0,4,"porciones para compartir",false,true,false,["casa"],
 [I("Batata",2,"unid.","medianas"),I("Aceite",10,"ml","2 cditas."),I("Pimentón",0.5,"cdita."),I("Ajo en polvo"),I("Tomate",1,"unid."),I("Limón",0.5,"unid.")],
 ["Precalentá el horno a 200 °C. Lavá las batatas y cortalas en bastones parejos.","Mezclá con aceite, pimentón y ajo. Extendé sin amontonar.","Horneá 30 a 35 minutos, dando vuelta a mitad de cocción.","Picá el tomate y mezclalo con jugo de limón. Serví como salsa."],
 "Guardá los bastones hasta 3 días en heladera. Prepará la salsa en el día y mantenela fría.","Podés usar zapallo firme en cubos; verificá la cocción con un tenedor.",[],"Horno"),
R(9,"Cuadraditos de pera y cacao","Avena, fruta rallada y cacao para una merienda de horno.",10,25,0,9,"cuadraditos",true,true,true,["cole","casa"],
 [I("Pera",2,"unid.","maduras"),I("Huevo",1,"unid."),I("Avena",135,"g","aprox. 1½ tazas"),I("Cacao amargo",6,"g","1 cda."),I("Leche",120,"ml","½ taza"),I("Polvo de hornear",1,"cdita.")],
 ["Precalentá el horno a 180 °C. Rallá las peras lavadas.","Mezclá con huevo, leche, avena, cacao y polvo de hornear.","Volcá en un molde de unos 18 × 18 cm con papel de horno. Horneá 20 a 25 minutos, hasta que el centro esté cocido.","Dejá enfriar y cortá en 9 cuadrados."],
 "Hasta 3 días en heladera o 1 mes en freezer, separados por papel.","Podés usar manzana rallada en lugar de pera.",["Huevo","Leche","Avena (puede contener gluten)"],"Horno"),
R(10,"Panquequitos de zanahoria","Pequeños y tiernos, para comer recién hechos o llevar con frío.",7,8,0,6,"panquequitos",true,true,true,["cole","casa"],
 [I("Huevo",1,"unid."),I("Avena",45,"g","aprox. ½ taza"),I("Zanahoria",0.5,"unid."),I("Leche",80,"ml","⅓ taza"),I("Canela"),I("Esencia de vainilla")],
 ["Rallá fina la zanahoria lavada. Procesá junto con huevo, avena, leche, canela y vainilla.","Calentá una sartén antiadherente a fuego medio bajo.","Cociná 6 cucharadas de mezcla, en tandas, 1 a 2 minutos por lado. Deben quedar cocidas en el centro."],
 "Hasta 2 días en heladera o 1 mes en freezer. Para llevar, usá bolsa térmica con refrigerante.","La manzana rallada funciona en lugar de zanahoria.",["Huevo","Leche","Avena (puede contener gluten)"],"Sartén antiadherente"),
R(11,"Roll de hummus y zanahoria","Un roll fresco que se convierte en cuatro bocados.",7,0,0,1,"roll",false,true,false,["cole","despues","casa"],
 [I("Tortilla integral",1,"unid."),I("Hummus",45,"g","3 cdas."),I("Zanahoria",0.5,"unid."),I("Espinaca",15,"g","hojas bien lavadas"),I("Limón",0.25,"unid.")],
 ["Lavá y secá las hojas. Rallá la zanahoria.","Untá la tortilla con el hummus y agregá las verduras y unas gotas de limón.","Enrollá firme. Podés cortarlo en 4 bocados y guardarlo en un recipiente."],
 "Armá en el día. Mantené refrigerado y transportá con refrigerante.","Podés usar el dip de lentejas de este recetario en lugar de hummus.",["Trigo / gluten","Sésamo si el hummus contiene tahini"],"Sin cocción; hummus listo"),
R(12,"Sándwich de huevo y espinaca","Un clásico salado con relleno cremoso y hojas frescas.",5,12,0,1,"sándwich",false,true,false,["cole","despues","casa"],
 [I("Pan integral",2,"rebanadas"),I("Huevo",1,"unid."),I("Queso untable",5,"g","1 cdita."),I("Espinaca",15,"g"),I("Limón",0.25,"unid."),I("Pimienta")],
 ["Herví el huevo 10 a 12 minutos desde que el agua hierve; yema y clara deben quedar firmes. Enfriá en agua fría y pelá. Si ya tenés huevo duro, la preparación lleva 5 minutos.","Picá el huevo y mezclá con queso, pimienta y unas gotas de limón.","Lavá y secá las hojas. Rellená el pan y cerrá el sándwich."],
 "Prepará en el día y conservá frío. Transportá en bolsa térmica con refrigerante.","Podés usar lechuga bien lavada y seca en lugar de espinaca.",["Trigo / gluten","Huevo","Leche"],"Olla; o huevo ya cocido"),
R(13,"Yogur, fruta y avena","Capas de fruta, yogur cremoso y un final de avena.",5,0,0,1,"frasco",true,true,false,["cole","despues","casa"],
 [I("Yogur natural",190,"g","sin azúcar agregada"),I("Fruta de estación",1,"unid.","chica, lavada y cortada"),I("Avena",20,"g","2 cdas."),I("Chía",4,"g","1 cdita."),I("Canela")],
 ["Colocá el yogur en un frasco limpio y con tapa.","Agregá la fruta cortada.","Sumá la avena, la chía y la canela al comer. Podés llevarlas en un recipiente aparte."],
 "Hasta 24 horas en heladera. Llevá siempre en bolsa térmica con refrigerante.","Elegí durazno, pera, manzana o frutillas según lo que consigas.",["Leche","Avena (puede contener gluten)"],"Sin cocción"),
R(14,"Sándwich de ricota y manzana","Manzana rallada y canela en una merienda para llevar.",6,0,0,1,"sándwich",true,true,false,["cole","casa"],
 [I("Pan integral",2,"rebanadas"),I("Ricota",45,"g","3 cdas."),I("Manzana",0.5,"unid."),I("Canela")],
 ["Lavá y rallá la manzana. Mezclala con la ricota y la canela.","Distribuí sobre una rebanada de pan y cerrá con la otra.","Envolvé o guardá en un recipiente y refrigerá."],
 "Prepará en el día. Mantené refrigerado hasta comer.","Podés cambiar la manzana por pera firme rallada.",["Trigo / gluten","Leche"],"Sin cocción"),
R(15,"Mini frittatas de choclo","Huevos, choclo y zanahoria en formato de bolsillo.",10,20,0,8,"mini frittatas",false,true,true,["cole","despues","casa"],
 [I("Huevo",4,"unid."),I("Choclo cocido",80,"g","½ taza"),I("Zanahoria",1,"unid."),I("Leche",30,"ml","2 cdas."),I("Queso rallado",15,"g","2 cdas."),I("Aceite",5,"ml","para los moldes"),I("Orégano")],
 ["Precalentá el horno a 180 °C. Rallá la zanahoria lavada.","Batí los huevos con leche, queso y orégano. Sumá el choclo ya cocido y la zanahoria.","Aceitá 8 moldes de muffin y repartí la mezcla.","Horneá 18 a 20 minutos, hasta que el centro esté completamente firme. Dejá entibiar y refrigerá."],
 "Hasta 3 días en heladera o 1 mes en freezer. Descongelá en heladera y recalentá completamente si las querés tibias.","Podés reemplazar el choclo por arvejas cocidas.",["Huevo","Leche"],"Horno y moldes"),
R(16,"Wrap de pollo y palta","Cremoso y fresco para una pausa en un día largo.",8,0,0,1,"wrap",false,true,false,["cole","despues","casa"],
 [I("Tortilla integral",1,"unid."),I("Pollo cocido",60,"g"),I("Palta",30,"g","2 cdas."),I("Tomate",0.5,"unid."),I("Limón",0.25,"unid."),I("Pimienta")],
 ["Usá pollo ya cocido, bien refrigerado. Desmenuzalo.","Pisá la palta con jugo de limón. Lavá y cortá el tomate.","Untá la tortilla, agregá el pollo y el tomate, condimentá y enrollá."],
 "Prepará en el día y mantené frío. El limón no reemplaza la refrigeración.","Podés cambiar el pollo por huevo duro; agrega huevo a los alérgenos.",["Trigo / gluten"],"Sin cocción; pollo listo"),
R(17,"Ricota, durazno y nuez","Tres texturas y fruta de estación en un mismo vasito.",5,0,0,1,"vasito",true,true,false,["cole","despues","casa"],
 [I("Ricota",100,"g","aprox. ½ taza"),I("Durazno",1,"unid.","chico"),I("Nueces",10,"g","1 cda."),I("Agua",15,"ml","1 cda."),I("Canela")],
 ["Mezclá la ricota con el agua y la canela hasta que esté cremosa.","Lavá el durazno y cortalo en cubitos, sin carozo.","Armá capas de ricota y fruta. Terminá con nueces picadas."],
 "Hasta 24 horas en heladera. Para llevar, usá refrigerante.","Fuera de temporada, probá con pera o manzana.",["Leche","Frutos secos"],"Sin cocción"),
R(18,"Pudín de chía y cacao","Lo mezclás, lo dejás en frío y después lo disfrutás.",5,0,180,1,"vaso",true,true,false,["cole","casa"],
 [I("Leche",180,"ml","¾ taza"),I("Chía",18,"g","1½ cdas."),I("Banana",0.5,"unid."),I("Cacao amargo",2,"g","1 cdita."),I("Esencia de vainilla")],
 ["Pisá la banana y mezclala con leche, cacao y vainilla.","Agregá la chía y mezclá bien. Dejá 10 minutos y volvé a mezclar para evitar grumos.","Tapá y refrigerá al menos 3 horas. Mezclá antes de comer."],
 "Hasta 2 días en heladera. Transportá con refrigerante.","Podés omitir el cacao y usar canela.",["Leche"],"Sin cocción; requiere heladera"),
R(19,"Avena nocturna de manzana","Una merienda que se prepara mientras descansás.",5,0,480,1,"frasco",true,true,false,["cole","casa"],
 [I("Avena",30,"g","aprox. ⅓ taza"),I("Leche",120,"ml","½ taza"),I("Manzana",0.5,"unid."),I("Yogur natural",15,"g","1 cda."),I("Semillas de girasol",4,"g","1 cdita."),I("Canela")],
 ["Lavá y rallá la manzana o cortala en cubitos pequeños.","Mezclá todos los ingredientes en un frasco limpio con tapa.","Dejá unas 8 horas en la heladera. Mezclá y agregá un chorrito de leche si la preferís más fluida."],
 "Hasta 2 días en heladera. Mantené fría durante el traslado.","Podés reemplazar la manzana por pera.",["Leche","Avena (puede contener gluten)"],"Sin cocción; requiere heladera"),
R(20,"Heladitos de yogur y fruta","Para tener algo fresco esperando en el freezer.",10,0,240,6,"heladitos",true,true,true,["casa"],
 [I("Yogur natural",240,"g","1 taza"),I("Fruta de estación",150,"g","1 taza cortada"),I("Banana",0.5,"unid."),I("Esencia de vainilla")],
 ["Lavá la fruta y quitá carozos o semillas grandes.","Licuala con el yogur, la banana y la vainilla.","Repartí en 6 moldes pequeños y congelá al menos 4 horas."],
 "Hasta 1 mes en freezer, cubiertos. Consumí recién sacados; no vuelvas a congelar si se descongelaron.","Frutillas, duraznos y pera madura funcionan bien.",["Leche"],"Licuadora y freezer"),
R(21,"Helado de banana y cacao","Cremoso en minutos, si ya tenés banana congelada.",5,0,0,1,"bol",true,true,false,["casa"],
 [I("Banana",1,"unid.","en rodajas, ya congelada"),I("Pasta de maní",5,"g","1 cdita."),I("Cacao amargo",2,"g","1 cdita."),I("Leche",15,"ml","1 cda.; ajustar textura")],
 ["Usá banana previamente pelada, cortada y congelada al menos 4 horas.","Procesá en pulsos con el cacao y la pasta de maní. Agregá la leche de a poco, solo para ayudar a las cuchillas.","Cuando esté cremoso, serví enseguida."],
 "Prepará la cantidad que vas a comer. No vuelvas a congelar la mezcla derretida.","Podés omitir la pasta de maní. Para esa variante, revisá también los rótulos por trazas.",["Leche","Maní"],"Procesadora apta para congelados"),
R(22,"Manzana tibia con yogur","Una pausa calentita con canela y una cucharada de avena.",3,4,0,1,"bol",true,true,false,["casa"],
 [I("Manzana",1,"unid."),I("Agua",30,"ml","2 cdas."),I("Yogur natural",120,"g","½ taza"),I("Avena",10,"g","1 cda., tostada"),I("Canela")],
 ["Lavá la manzana, quitá las semillas y cortala en cubitos.","Ponela con agua y canela en un recipiente apto para microondas, cubierto sin sellar. Cociná 3 a 4 minutos, comprobando que esté tierna.","Dejá entibiar. Sumá el yogur y la avena al servir."],
 "Consumí recién preparada. Refrigerá cualquier sobrante pronto y usalo dentro de 24 horas.","Podés cocinar la manzana en una ollita tapada, con un poco más de agua y tiempo.",["Leche","Avena (puede contener gluten)"],"Microondas"),
R(23,"Hummus de remolacha","Un dip de color intenso para acompañar con bastoncitos.",10,0,0,4,"porciones de dip",false,true,false,["cole","casa"],
 [I("Garbanzos cocidos",165,"g","aprox. 1 taza"),I("Remolacha cocida",1,"unid.","chica"),I("Aceite",15,"ml","1 cda."),I("Limón",0.5,"unid."),I("Zanahoria",1,"unid.","para acompañar"),I("Comino"),I("Ajo en polvo")],
 ["Usá garbanzos y remolacha ya cocidos y fríos. Escurrí los garbanzos.","Procesá con aceite, jugo de limón, comino y ajo. Agregá agua de a una cucharada si hace falta.","Lavá la zanahoria, cortá bastones y serví con el dip."],
 "Hasta 3 días en heladera. Guardá los bastones separados y transportá todo con refrigerante.","Podés acompañar con pepino o crackers de avena; estos últimos pueden contener gluten.",[],"Procesadora; legumbres y remolacha listas"),
R(24,"Dip rápido de lentejas","Una forma distinta de usar las lentejas que ya tenés cocidas.",8,0,0,4,"porciones de dip",false,true,false,["cole","casa"],
 [I("Lentejas cocidas",180,"g","aprox. 1 taza"),I("Aceite",15,"ml","1 cda."),I("Limón",0.5,"unid."),I("Agua",30,"ml","sumar de a poco"),I("Pimentón",0.5,"cdita."),I("Comino")],
 ["Escurrí las lentejas ya cocidas. Si son de lata, enjuagalas.","Procesá con el aceite, el jugo de limón, los condimentos y el agua.","Ajustá la textura con un poco más de agua. Serví con vegetales o pan, que se agregan aparte."],
 "Hasta 3 días en heladera en recipiente cerrado. Para llevar, usá refrigerante.","Podés usar porotos blancos cocidos en lugar de lentejas.",[],"Procesadora; lentejas listas"),
R(25,"Brochetas de fruta y yogur","Elegí los colores de la estación y armá una merienda fresca.",10,0,0,2,"platos",true,true,false,["casa"],
 [I("Fruta de estación",300,"g","aprox. 2 tazas cortadas"),I("Yogur natural",120,"g","½ taza"),I("Naranja",0.25,"unid.","solo ralladura de la cáscara lavada"),I("Esencia de vainilla")],
 ["Lavá la fruta, quitá semillas y carozos, y cortala en trozos.","Armá brochetas o serví la fruta directamente en un bol.","Mezclá yogur, ralladura y vainilla para acompañar."],
 "Consumí en el día y mantené en heladera hasta servir.","Elegí manzana, pera, durazno o frutillas según la estación.",["Leche"],"Sin cocción"),
R(26,"Tostada de banana y maní","Lista en cinco minutos para una pausa antes de salir.",3,2,0,1,"tostada",true,false,false,["antes","casa"],
 [I("Pan integral",1,"rebanadas"),I("Banana",0.5,"unid."),I("Pasta de maní",15,"g","1 cda., sin agregados"),I("Canela")],
 ["Tostá el pan a tu gusto.","Untalo con pasta de maní y agregá la banana en rodajas.","Terminá con canela. Si vas a bailar, elegí el momento y la cantidad según tu comodidad digestiva."],
 "Armá justo antes de comer. Para llevar, mantené la banana entera y los ingredientes por separado.","También podés usar pan común si es el que hay en casa.",["Trigo / gluten","Maní"],"Tostadora o sartén"),
R(27,"Licuado de frutilla y yogur","Fruta y yogur, bien frescos y sin complicaciones.",5,0,0,1,"vaso grande",true,true,false,["antes","despues","casa"],
 [I("Frutillas",150,"g","aprox. 1 taza"),I("Banana",0.5,"unid."),I("Yogur natural",120,"g","½ taza"),I("Leche",120,"ml","½ taza")],
 ["Lavá las frutillas y quitá las hojas. Pelá la banana.","Licualas con el yogur y la leche hasta lograr una mezcla uniforme.","Serví enseguida. Antes de danza, dejá el tiempo que necesitás para sentirte cómoda."],
 "Prepará al momento. Si lo llevás, mantené bien refrigerado y consumí en el día.","Podés usar durazno en lugar de frutillas o agua en lugar de leche.",["Leche"],"Licuadora"),
R(28,"Panqueque de banana y avena","De la sartén al plato, con ingredientes que suelen estar en casa.",4,6,0,2,"panqueques pequeños",true,true,true,["antes","despues","casa"],
 [I("Banana",1,"unid.","chica"),I("Huevo",1,"unid."),I("Avena",30,"g","3 cdas."),I("Aceite",5,"ml","1 cdita."),I("Canela")],
 ["Pisá la banana y mezclala con el huevo, la avena y la canela.","Calentá una sartén antiadherente a fuego medio bajo con el aceite.","Formá 2 panqueques pequeños. Cociná 2 a 3 minutos por lado, hasta que estén firmes y sin huevo crudo en el centro."],
 "Hasta 2 días en heladera o 1 mes en freezer. Para llevar, mantené frío.","Si querés, acompañá con yogur o un vaso de leche; agregan lácteos a la receta.",["Huevo","Avena (puede contener gluten)"],"Sartén"),
R(29,"Chocolatada con banana","Leche, cacao y fruta para cuando volvés de clase.",4,0,0,1,"vaso grande",true,true,false,["despues","casa"],
 [I("Leche",240,"ml","1 taza"),I("Banana",0.5,"unid."),I("Cacao amargo",2,"g","1 cdita."),I("Canela")],
 ["Pelá la banana y ponela en la licuadora con leche, cacao y canela.","Licualo hasta que quede uniforme. Serví fresco."],
 "Preferí tomarla recién hecha. Si la preparás antes, mantenela refrigerada y usala en el día.","Podés usar leche sin lactosa; sigue conteniendo proteínas de leche.",["Leche"],"Licuadora"),
R(30,"Quesadilla de pollo y queso","Un bocado calentito para la vuelta de danza.",4,6,0,1,"quesadilla",false,true,false,["despues","casa"],
 [I("Tortilla integral",1,"unid."),I("Pollo cocido",50,"g"),I("Queso fresco",30,"g"),I("Tomate",0.5,"unid."),I("Orégano")],
 ["Usá pollo ya cocido y bien conservado. Desmenuzalo. Lavá y cortá el tomate.","Rellená media tortilla con pollo, queso, tomate y orégano. Doblá.","Calentá en sartén a fuego medio bajo, 2 a 3 minutos por lado, hasta que el relleno esté bien caliente y el queso derretido."],
 "Preferí comerla recién hecha. Refrigerá cualquier sobrante pronto y consumí en 24 horas, recalentando completamente.","Podés reemplazar el pollo por porotos cocidos y escurridos.",["Trigo / gluten","Leche"],"Sartén; pollo listo"),
];

export const byId = Object.fromEntries(recipes.map(r=>[r.id,r])) as Record<string, Recipe>;
export const normalize = (s:string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
export function amountText(n:number):string {
  if(!n) return "";
  if(n===0.25) return "¼"; if(n===0.5) return "½"; if(n===0.75) return "¾";
  return new Intl.NumberFormat("es-AR",{maximumFractionDigits:1}).format(n);
}
export function timeText(r:Recipe):string {
  const active=r.prep+r.cook;
  return `${active} min${r.wait?` + ${r.wait>=60?amountText(r.wait/60)+" h":r.wait+" min"} de frío`:""}`;
}
export function ingredientText(i:Ingredient,multiplier=1):string {
  return [amountText(i.amount*multiplier),i.unit,i.name.toLowerCase()].filter(Boolean).join(" ");
}
export function foodGroup(name:string) {
  const n=normalize(name);
  if(/leche|yogur|ricota|queso|huevo|pollo/.test(n))return "Heladera";
  if(/banana|manzana|pera$|batata|zanahoria|espinaca|tomate|limon|palta|durazno|fruta|frutillas|naranja|remolacha/.test(n))return "Verdulería";
  return "Almacén";
}
