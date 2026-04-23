/**
 * Habita — Catálogo de oración católico v2
 * Traducciones al español de los 60 textos del catálogo.
 * Las claves coinciden exactamente con los IDs de data/prompts.ts.
 * Solo title, body y reflection necesitan traducción.
 * Todos los demás campos se heredan del texto fuente en inglés.
 */
export const ES: Record<string, { title: string; body: string; reflection?: string }> = {

  // ─── GRATITUD ───────────────────────────────────────────────────────────────

  'grat-001': {
    title: 'Antes que nada',
    body: 'Antes de que el día se llene de actividad, ya es regalo. Despertaste. Estás aquí. Dedica treinta segundos a un gracias sencillo.',
    reflection: 'La gratitud no se gana. Se recibe antes de hacer nada.',
  },
  'grat-002': {
    title: 'Algo que no hiciste tú',
    body: 'Mira una cosa cercana que no creaste — luz, aire, el sonido de afuera. Te fue dada. Da gracias a quien la dio.',
  },
  'grat-003': {
    title: 'Dios estuvo obrando hoy',
    body: 'Estuvo obrando hoy, aunque no lo notaras. Busca un momento — por pequeño que sea — donde la gracia se movió en silencio a lo largo de tu día.',
    reflection: 'La gracia no está ausente cuando no se percibe. Corre por debajo de lo ordinario.',
  },
  'grat-004': {
    title: 'Un rostro',
    body: 'Deja que venga a tu mente el rostro de alguien a quien amas. Quédate con él. Sin decir nada, ofrécelo a Dios con gratitud.',
  },
  'grat-005': {
    title: 'El don que no mereciste',
    body: 'Crees. No es tu logro — es una gracia dada libremente. Dedica un momento a dar gracias a Dios por el don de la fe en sí misma.',
    reflection: 'La fe no es fruto del esfuerzo. Es una puerta abierta desde el otro lado.',
  },
  'grat-006': {
    title: 'Solo esto',
    body: 'No todo. No una lista. Solo este momento, este aliento, este pequeño rincón de gracia. Es suficiente. Da gracias a Dios por ello.',
  },
  'grat-007': {
    title: 'Fuiste sostenido hoy',
    body: 'Más de lo que te diste cuenta, fuiste sostenido. Llegó la provisión. Llegó la fuerza. Algo en ti se mantuvo. Da gracias — no fuiste solo tú.',
  },
  'grat-008': {
    title: 'Existir ya es don',
    body: 'No te causaste a ti mismo. Fuiste deseado a la existencia. Cada momento de tu vida es, en su raíz, un acto de amor de Dios.',
    reflection: 'Agustín lo oyó: nuestro corazón está inquieto hasta que descanse en Ti.',
  },

  // ─── PETICIÓN ───────────────────────────────────────────────────────────────

  'pet-001': {
    title: 'Hazme capaz de este día',
    body: 'Señor, no sé lo que hoy traerá. Dame la gracia de afrontarlo — no heroicamente, sino fielmente. Eso es suficiente.',
  },
  'pet-002': {
    title: 'Necesito más que paciencia',
    body: 'Hay personas hoy que pedirán más de lo que quiero dar. Yo solo no soy suficiente. Señor, dame tu caridad — no la mía.',
  },
  'pet-003': {
    title: 'Limpia mis intenciones',
    body: 'Antes de continuar — Señor, ¿son limpias mis intenciones? Ayúdame a querer las cosas correctas por las razones correctas. Purifica lo que estoy a punto de hacer.',
  },
  'pet-004': {
    title: 'Me estoy vaciando',
    body: 'Algo en mí está agotado. No pido energía, sino fidelidad. Que no me limite a cumplir por cumplir. Que hasta los actos pequeños sean reales.',
  },
  'pet-005': {
    title: 'No lo veo con claridad',
    body: 'Hay una decisión frente a mí y no la veo con claridad. Señor, pido sabiduría — no comodidad, sino claridad. Muéstrame el camino bueno.',
  },
  'pet-006': {
    title: 'Detenme',
    body: 'Hay algo que me atrae y que no debería seguir. No me fío de mí mismo aquí. Señor, sostenme. Sé más fuerte en mí de lo que yo soy.',
  },
  'pet-007': {
    title: 'Hoy no lo hice bien',
    body: 'Fallé hoy — en paciencia, en honestidad, en amor. No pido justificación, sino misericordia. Recíbeme de nuevo como soy.',
    reflection: 'Al hijo pródigo lo vieron desde lejos. Nunca estamos demasiado lejos para ser recibidos.',
  },

  // ─── SILENCIO ───────────────────────────────────────────────────────────────

  'sil-001': {
    title: 'Detente',
    body: 'Solo para. No para siempre — solo treinta segundos. Deja que llegue el silencio. Dios ya está en él.',
  },
  'sil-002': {
    title: 'Bajo el ruido',
    body: 'Bajo todos los sonidos de ahora mismo, hay un silencio donde Dios espera. No tienes que crearlo. Solo déjate caer en él.',
  },
  'sil-003': {
    title: 'Antes de hablar, escucha',
    body: 'Antes de que el día se llene de tus palabras y planes, ofrécele a Dios unos momentos de escucha. No para oír algo — solo para estar disponible.',
  },
  'sil-004': {
    title: 'Sin palabras',
    body: 'A veces la oración es simplemente estar ante Dios sin nada que decir. Eso es suficiente. Él te ve. Quédate.',
  },
  'sil-005': {
    title: 'Deja que el día se aquiete',
    body: 'El día estuvo lleno. Antes de cerrarlo, dale un momento de silencio. Devuélvelo sin palabras. Deja que Dios tenga la última palabra.',
  },
  'sil-006': {
    title: 'En tus manos',
    body: 'En tus manos — las horas, las preocupaciones, las personas que llevas, lo que sigue sin resolverse. En tus manos. No hacen falta más palabras.',
    reflection: 'La oración nocturna más antigua de la Iglesia: En tus manos encomiendo mi espíritu.',
  },
  'sil-007': {
    title: 'No hacer. Ser.',
    body: 'Durante treinta segundos, no hagas nada. No logres nada. No produzcas nada. Simplemente está aquí, como criatura ante su Creador.',
  },

  // ─── OFRENDA ────────────────────────────────────────────────────────────────

  'off-001': {
    title: 'Da el día antes de que suceda',
    body: 'Antes de que empiece cualquier tarea, ofrece el día entero. Tu trabajo, tus conversaciones, tus frustraciones, tus pequeñas victorias — todo ello, suyo.',
  },
  'off-002': {
    title: 'Esta tarea es oración ahora',
    body: 'Sea lo que sea que estás a punto de hacer — elévalo antes de comenzar. El trabajo ordinario se vuelve santo cuando se ofrece conscientemente.',
    reflection: 'Ora et labora. La oración y el trabajo no son dos cosas. Pueden ser una.',
  },
  'off-003': {
    title: 'Incluso este cansancio',
    body: 'Ofrece el cansancio. No con dramatismo — en silencio. Incluso el agotamiento, puesto en las manos de Dios, puede convertirse en algo más que mero desgaste.',
  },
  'off-004': {
    title: 'Esto también',
    body: 'Sea lo que sea que ahora es difícil — nómbralo en silencio, tenlo ante Dios y ofrécelo. No para que desaparezca. Para que importe.',
  },
  'off-005': {
    title: 'Unido al suyo',
    body: 'Lo que cargas hoy puede unirse a lo que Él cargó. Ofrece tu sufrimiento en unión con la cruz. Nada ofrecido con amor se pierde jamás.',
  },
  'off-006': {
    title: 'No se requiere más',
    body: 'No estás atrasado. No te falta nada. Ahora mismo, en este momento, ofrecerte a ti mismo es suficiente. Hazlo ahora.',
  },
  'off-007': {
    title: 'Ellos también',
    body: 'Piensa en las personas que llevas en el corazón hoy. Ofrécelas a Dios sin intentar arreglar nada. Ponlas en manos mejores que las tuyas.',
  },

  // ─── EXAMEN ─────────────────────────────────────────────────────────────────

  'exam-001': {
    title: '¿Dónde estuvo Dios hoy?',
    body: 'Repasa las horas. ¿Dónde percibiste que algo bueno se movía? ¿Dónde resististe? No juzgues — observa.',
    reflection: 'El examen no es una revisión de desempeño. Es un encuentro con un Padre misericordioso.',
  },
  'exam-002': {
    title: '¿Dónde ha vivido tu corazón?',
    body: 'Desde esta mañana, ¿dónde ha vivido realmente tu corazón? ¿En la preocupación? ¿En el trabajo? ¿En la gratitud? ¿En el resentimiento? No respondas rápido. Mira con honestidad.',
  },
  'exam-003': {
    title: 'Una gracia hoy',
    body: 'Antes de examinar dónde fallaste, busca primero un don. Encuéntralo. Que la gratitud llegue antes que el balance.',
  },
  'exam-004': {
    title: '¿Por qué lo hice?',
    body: 'Piensa en un acto de hoy. Pregunta con honestidad: ¿qué lo impulsó? ¿Orgullo? ¿Amor? ¿Miedo? ¿Costumbre? Solo observa — sin juzgar, sin excusas.',
  },
  'exam-005': {
    title: '¿Cómo amé hoy?',
    body: 'No: ¿tuve éxito? Sino: ¿fui amoroso? ¿Di atención, paciencia, presencia? ¿Serví — o solo actué?',
  },
  'exam-006': {
    title: 'Tres preguntas antes de descansar',
    body: '¿Dónde recibí gracia hoy? ¿Dónde la di? ¿Dónde la retuve? Responde en silencio. Luego duerme en paz.',
  },

  // ─── CONFIANZA ──────────────────────────────────────────────────────────────

  'tr-001': {
    title: 'Tú no estás al mando',
    body: 'El resultado de esto no te pertenece controlar. Algo en eso da miedo. Algo en eso también es alivio. Deja que Él esté al mando.',
  },
  'tr-002': {
    title: 'Incluso ahora',
    body: 'Incluso cuando Dios parece distante — no lo está. Incluso cuando la oración parece seca — Él la escucha. Incluso cuando la fe es pequeña — es suficiente.',
  },
  'tr-003': {
    title: 'Él ya vio esto antes',
    body: 'Esta situación que te pesa no es una sorpresa para Dios. No ha perdido el hilo. Confía en que Él sostiene lo que tú no puedes ver.',
    reflection: 'La providencia no es ciega. Es amorosa y precisa.',
  },
  'tr-004': {
    title: 'No necesito saberlo todo',
    body: 'No necesitas saber cómo terminará este día. Solo necesitas comenzarlo fielmente. Lo demás está en mejores manos que las tuyas.',
  },
  'tr-005': {
    title: 'Vuelve a empezar',
    body: 'Fallaste. Eso es real. Pero el fracaso no es la última palabra a menos que tú lo dejes. Levántate. Él no está sorprendido, y no ha terminado contigo.',
  },
  'tr-006': {
    title: 'Él no duerme',
    body: 'Mientras tú descansas, Él no lo hace. El mundo no se irá a la deriva mientras duermes. Suéltalo todo. Hay alguien despierto y vigilando.',
  },

  // ─── INTERCESIÓN ────────────────────────────────────────────────────────────

  'int-001': {
    title: 'Alguien lo necesita más que tú',
    body: 'Piensa en una persona que está sufriendo ahora mismo. Puede que no sepas qué decir. Ofrécela a Dios. Eso es suficiente oración.',
  },
  'int-002': {
    title: 'Incluso ellos',
    body: 'Hay alguien en tu vida a quien te cuesta amar. Ora por ellos ahora — no porque se sienta bien, sino porque es bueno.',
    reflection: 'Orar por alguien difícil es empezar a verlo con otros ojos.',
  },
  'int-003': {
    title: 'Por quienes reciben hoy',
    body: 'Ahora mismo, en todo el mundo, personas están recibiendo a Cristo en la Eucaristía. Ora por ellas — y por quienes están lejos y anhelan volver.',
  },
  'int-004': {
    title: 'El peso del mundo',
    body: 'No puedes cargar a todos. Pero puedes ofrecerlos a todos. Pon el mundo — su sufrimiento, su confusión, su anhelo — ante Dios ahora mismo.',
  },
  'int-005': {
    title: 'Por la Iglesia',
    body: 'La Iglesia es herida y santa al mismo tiempo — como todos nosotros. Ora por ella hoy. Por su santidad, su valentía, su fidelidad a la verdad.',
  },

  // ─── PRESENCIA ──────────────────────────────────────────────────────────────

  'pres-001': {
    title: 'Él está aquí',
    body: 'No en otro lugar. No cuando estés listo. Aquí mismo, en esta habitación, en este momento. Él está presente. Vuelve a esa verdad.',
  },
  'pres-002': {
    title: 'Eres visto',
    body: 'La mirada de Dios no es una amenaza. Es un don. Ahora mismo, eres plenamente visto y plenamente conocido — y esa mirada es amor, no juicio.',
  },
  'pres-003': {
    title: 'Regresa',
    body: 'La mañana te arrastró hacia adelante. La actividad tomó el control. Eso es ordinario. Vuelve ahora. Solo un giro del corazón. Dios sigue aquí.',
  },
  'pres-004': {
    title: 'Este es suelo sagrado',
    body: 'Donde estés ahora — oficina, cocina, coche, habitación de hospital — Dios está presente. No necesitas ir a un lugar mejor para encontrarlo.',
    reflection: 'Moisés encontró a Dios en una zarza ordinaria. El lugar se hizo santo por la presencia, no por la belleza.',
  },
  'pres-005': {
    title: 'No dejado solo',
    body: 'No se quedó a distancia amándote desde lejos. Se acercó. Se hizo carne. Nunca has estado, ni estarás jamás, solo.',
  },
  'pres-006': {
    title: 'Que Él haga la guardia',
    body: 'No tienes que mantener nada en la noche. Deja que descanses en su presencia como un niño descansa junto a un padre. Solo estate cerca.',
  },

  // ─── ESCRITURA ──────────────────────────────────────────────────────────────

  'scr-001': {
    title: 'Palabra viva',
    body: 'Una sola palabra de la Escritura tiene el poder de reordenar un día entero. Pide a Dios que te dé una palabra ahora mismo. Luego espera un momento. Recibe lo que llega.',
  },
  'scr-002': {
    title: 'Quédate con una palabra',
    body: 'Toma una sola palabra — misericordia, paz, luz, refugio — y tenla ante Dios. Que se convierta en oración sin necesitar más palabras.',
  },
  'scr-003': {
    title: 'Pan para el día',
    body: 'Antes de que comience el día, dale una palabra de Dios. No necesitas entenderlo todo. Una palabra recibida con fe es pan suficiente.',
  },
  'scr-004': {
    title: 'Vuelve con todo tu corazón',
    body: 'Siempre hay un camino de vuelta. No porque lo merezcas, sino porque Él lo hizo posible. Gírate ahora — de la manera más pequeña que puedas. Ese giro lo es todo.',
    reflection: 'Los profetas lo dijeron. Las parábolas lo mostraron. La puerta nunca está del todo cerrada.',
  },

  // ─── LUCHA ESPIRITUAL ────────────────────────────────────────────────────────

  'str-001': {
    title: 'Cuando la oración parece nada',
    body: 'Si no sientes nada — ni consolación, ni calor, ni presencia de Dios — quédate de todas formas. La fidelidad en la sequedad es una de las formas más profundas de oración.',
    reflection: 'Muchos santos pasaron años en oración árida. La sequedad no era rechazo — era una invitación a mayor profundidad.',
  },
  'str-002': {
    title: 'Gírate antes de caer',
    body: 'Sientes la atracción hacia algo que no te sirve. No negocies con ello. Gírate ahora — aunque sea imperfectamente. Ese giro es la oración.',
  },
  'str-003': {
    title: 'No has sido abandonado',
    body: 'El desánimo que sientes es real. Pero no es señal de ausencia de Dios. Él está cerca del corazón quebrantado. Déjate encontrar.',
  },
  'str-004': {
    title: 'No eres autosuficiente',
    body: 'Hay una parte de ti que cree que puede manejarse sin Dios. Esa parte se ha equivocado antes. Suelta la autosuficiencia. Pide ayuda.',
  },

  // ─── GRATITUD — expansión ───────────────────────────────────────────────────

  'grat-009': {
    title: 'Él se deleita en ti',
    body: 'No porque hayas actuado bien hoy. No porque lo merezcas. Él se deleita en ti como un padre se deleita en un hijo. Recíbelo sin discutir.',
  },
  'grat-010': {
    title: 'El mundo de nuevo',
    body: 'El mundo despertó de nuevo hoy. Las estrellas cedieron paso a la luz. Los pájaros ya sabían qué hacer. Se te dio otro día en este orden creado. Eso no es poca cosa.',
  },
  'grat-011': {
    title: 'Más de lo que pediste',
    body: 'Piensa en algo bueno en tu vida que nunca pensaste en pedir. Llegó de todas formas. Eso es gracia — no programada, no buscada, dada libremente.',
  },
  'grat-012': {
    title: 'El mayor regalo',
    body: 'No solo envió un mensaje. No solo mostró el camino. Se dio a sí mismo — enteramente, diariamente, en la forma más ordinaria. Dale gracias por eso.',
  },
  'grat-013': {
    title: 'Cuenta en silencio',
    body: 'Sin hacer una lista — deja que los bienes de este día afloren solos. No los busques. Que emerjan. Da gracias a Dios por cada uno a medida que aparece.',
  },
  'grat-014': {
    title: 'Fuiste perdonado de nuevo',
    body: 'En algún momento reciente, la misericordia cubrió un fallo tuyo. Puede que no lo hayas nombrado así. Nómbralo ahora. Da gracias por ello.',
  },

  // ─── PETICIÓN — expansión ───────────────────────────────────────────────────

  'pet-008': {
    title: 'Úsame hoy',
    body: 'Señor, no sé quién me necesita hoy. Pero si hay una persona a quien pueda ayudar de verdad — ponla delante de mí. Hazme útil.',
  },
  'pet-009': {
    title: 'Lo que miro',
    body: 'Guarda mis ojos hoy. No solo lo obvio — sino la mirada que se demora demasiado, la comparación que disminuye, la imagen que elijo sostener. Guarda lo que dejo entrar.',
  },
  'pet-010': {
    title: 'Déjame descansar de verdad',
    body: 'El día ha terminado. No pido revivir lo que pasó. Dame la gracia del descanso auténtico — mente quieta, corazón en paz, alma en tu custodia.',
  },
  'pet-011': {
    title: 'Más pequeño, por favor',
    body: 'Algo en mí quiere ser visto, validado, aplaudido. Sé a dónde lleva ese camino. Señor, hazme más pequeño que mi ego. Que hable el trabajo — no yo.',
  },
  'pet-012': {
    title: 'Lo que estoy a punto de decir',
    body: 'Antes de hablar — pausa. ¿Es verdad? ¿Es necesario? ¿Es bueno? Dame la gracia de decir lo que hay que decir, y el valor de dejar lo demás sin decir.',
  },

  // ─── SILENCIO — expansión ───────────────────────────────────────────────────

  'sil-008': {
    title: 'Sin imagen, sin palabra',
    body: 'Deja caer por un momento todas las imágenes de Dios — cada concepto, cada teología, cada representación. Solo estate presente ante el que está más allá de todo.',
  },
  'sil-009': {
    title: 'Un hueco en medio',
    body: 'En medio de todo — crea un hueco. Diez segundos de silencio real. Deja que el ruido se retire. Dios habita ese hueco. Entra en él.',
  },
  'sil-010': {
    title: 'Más allá de las palabras',
    body: 'Hay una gratitud demasiado grande para las palabras. Si la sientes ahora — no la reduzcas a una frase. Ofrécela en silencio. Dios recibe lo que el lenguaje no puede sostener.',
  },
  'sil-011': {
    title: 'Como María',
    body: 'Ella no comprendía del todo lo que se le pedía. Estuvo en silencio antes de decir sí. Practica ahora ese silencio — receptivo, abierto, sin defensas.',
  },
  'sil-012': {
    title: 'La habitación interior',
    body: 'Hay una habitación dentro de ti a la que el mundo no puede entrar. Ve allí ahora. Siempre está disponible. Dios ha estado esperando en ella.',
  },

  // ─── OFRENDA — expansión ────────────────────────────────────────────────────

  'off-008': {
    title: 'Por sus manos',
    body: 'Toma lo que llevas hoy y ponlo en las manos de María. Ella sabe cómo llevar las cosas a su Hijo. Deja que lo cargue contigo.',
  },
  'off-009': {
    title: 'El trabajo oculto',
    body: 'Nadie vio lo que hiciste hoy. Nadie te agradeció. Nadie lo notó. Ofrece ese ocultamiento. El Padre ve en lo secreto — y eso es suficiente.',
  },
  'off-010': {
    title: 'Las personas que no puedo arreglar',
    body: 'Hay personas en tu vida que no puedes cambiar, no puedes ayudar suficiente, no puedes alcanzar. Ofrécelas. Tu amor convertido en ofrenda es más poderoso que tus soluciones.',
  },
  'off-011': {
    title: 'Ofrecido en alegría',
    body: 'No toda ofrenda viene del sufrimiento. Hoy, ofrece tu alegría — tu contentamiento, tu deleite, tu gratitud. La alegría devuelta a Dios se completa a sí misma.',
  },
  'off-012': {
    title: 'Todo',
    body: 'No solo las partes difíciles. No solo los momentos de fallo. Ofrece el ser entero — incluyendo las partes de las que estás orgulloso. Todo ello, dado libremente.',
  },

  // ─── EXAMEN — expansión ─────────────────────────────────────────────────────

  'exam-007': {
    title: '¿Qué quisiste hoy?',
    body: 'Mira tus deseos de hoy — a lo que te acercaste, lo que evitaste, lo que esperabas que nadie notara. Tráelos con honestidad ante Dios.',
  },
  'exam-008': {
    title: '¿Cuándo estuviste más vivo?',
    body: '¿Cuándo hoy te sentiste más tú mismo — más claro, más generoso, más en paz? ¿Y cuándo te sentiste más contraído? Observa la diferencia.',
  },
  'exam-009': {
    title: 'Ahora mismo, con honestidad',
    body: 'Ahora mismo — no antes, no en teoría — ¿cuál es el estado real de tu corazón? Nómbralo con honestidad ante Dios. Ese nombramiento ya es oración.',
  },
  'exam-010': {
    title: 'Que la misericordia tenga la última palabra',
    body: 'Has mirado el día. Has visto dónde fallaste. Ahora deja que la misericordia tenga la última palabra. Él no retiene lo que ya pusiste a sus pies.',
  },

  // ─── CONFIANZA — expansión ──────────────────────────────────────────────────

  'tr-007': {
    title: 'No es el final de la historia',
    body: 'Lo que ahora estás viviendo no es el capítulo final. Dios escribe historias más largas de lo que podemos ver desde adentro. Confía en el Autor.',
  },
  'tr-008': {
    title: 'Él nunca llega tarde',
    body: 'Has estado esperando — una respuesta, un cambio, una señal. No es lento. No es olvidadizo. Nunca llega tarde. Confía en el tiempo que no puedes ver.',
  },
  'tr-009': {
    title: 'Lo que piensan de ti',
    body: 'Suelta ahora mismo lo que otros piensan de ti. No puedes controlarlo. No te pertenece gestionar. Dios te conoce completamente — y ama lo que conoce.',
  },
  'tr-010': {
    title: 'Pequeño es suficiente',
    body: 'Sientes que estás haciendo muy poco — una fe demasiado pequeña, una oración demasiado pequeña, un amor demasiado pequeño. Lo pequeño es siempre donde Dios comienza. Es suficiente.',
  },
  'tr-011': {
    title: 'El fruto no es tuyo',
    body: 'Sembraste. Regaste. Si crece o no, no está en tus manos. Ofrece el resultado. La cosecha pertenece a Dios — no a tu esfuerzo.',
  },

  // ─── INTERCESIÓN — expansión ────────────────────────────────────────────────

  'int-006': {
    title: 'Por quienes están cruzando',
    body: 'En algún lugar del mundo ahora mismo, alguien está muriendo. No conoces su nombre. Ora por esa persona — que no esté sola, que la misericordia la encuentre allí.',
  },
  'int-007': {
    title: 'Por quienes están lejos de Dios',
    body: 'Piensa en alguien que se ha alejado de la fe. No discutas con esa persona en tu oración. Solo ofrécela. Sostenla ante Dios sin condiciones.',
  },
  'int-008': {
    title: 'A través de las heridas',
    body: 'Trae a quien más sufre en tu corazón y ponlo ante las heridas de Cristo. No hay sufrimiento que no pueda ser colocado allí.',
  },
  'int-009': {
    title: 'Por quienes están ante el altar',
    body: 'Los sacerdotes cargan lo que la mayoría nunca verá — hombres ordinarios a quienes se les han dado cosas extraordinarias. Ora por ellos hoy. Por santidad, valentía y alegría.',
  },

  // ─── PRESENCIA — expansión ──────────────────────────────────────────────────

  'pres-007': {
    title: 'Emmanuel sigue siendo verdad',
    body: 'Emmanuel — Dios con nosotros — no fue solo para Navidad. Es el estado permanente de las cosas. Ahora mismo, Él está contigo. Deja que eso se asiente.',
  },
  'pres-008': {
    title: 'Él habita en ti',
    body: 'Tu cuerpo no es solo un recipiente que toleras. Es el templo del Espíritu Santo. Él ha elegido morar en ti. Trátate de acuerdo con eso.',
  },
  'pres-009': {
    title: 'Un segundo para volver',
    body: 'No necesitas una hora. No necesitas una capilla. Un segundo de giro interior es suficiente para volver a la presencia de Dios. Hazlo ahora.',
  },
  'pres-010': {
    title: 'Él quiere tu compañía',
    body: 'La oración no es principalmente una transacción. No es un sistema de entrega de necesidades. Él quiere tu compañía — sencilla, genuina. Dásela ahora.',
  },
  'pres-011': {
    title: 'Rodeado',
    body: 'Antes de dormir — reconoce que no estás en el borde de la atención de Dios. Estás en el centro de ella. Estás rodeado. Descansa en eso.',
  },

  // ─── ESCRITURA — expansión ──────────────────────────────────────────────────

  'scr-005': {
    title: 'Sed',
    body: 'Hay una sed en ti que el agua no toca. Has probado otras cosas. Ayudaron brevemente, luego pasaron. Solo una fuente no se agota. Ve allí ahora.',
  },
  'scr-006': {
    title: 'Una luz que no se puede apagar',
    body: 'Sea cual sea la oscuridad que llevas — no ha apagado la luz. Nunca lo hará. La luz brilla en la oscuridad. Eso no es sentimentalismo. Es una promesa.',
  },
  'scr-007': {
    title: 'Una lámpara',
    body: 'No necesitas ver todo el camino. Solo necesitas luz suficiente para el siguiente paso. Eso es lo que da la Escritura — no un mapa, sino una lámpara. Pide tu paso.',
  },
  'scr-008': {
    title: 'El camino estrecho',
    body: 'El camino que lleva a algún lugar real no es ancho. Te pide algo. Ora hoy por el valor de elegirlo — no el camino fácil, sino el verdadero.',
  },
  'scr-009': {
    title: 'Porque resucitó',
    body: 'Porque resucitó, lo peor nunca es lo último. Porque resucitó, la muerte tiene un techo. Porque resucitó, tienes un lugar real donde esperar.',
  },
  'scr-010': {
    title: 'Lo vio desde lejos',
    body: 'Estaba todavía muy lejos cuando su padre corrió hacia él. Ese detalle importa. Dios no espera a que llegues. Él se mueve primero hacia ti. Gírate, y deja que venga.',
  },

  // ─── LUCHA ESPIRITUAL — expansión ───────────────────────────────────────────

  'str-005': {
    title: 'Lo que guardas contra ellos',
    body: 'Hay algo que no has soltado. Lo has mantenido cerca — dándole vueltas, alimentándolo. Te está costando más a ti que a ellos. Abre la mano. Suéltalo.',
  },
  'str-006': {
    title: 'Lo que no puedes dejar de pensar',
    body: 'Nómbralo. Lo que está dando vueltas en tu mente ahora mismo. Tráelo ante Dios — no para resolverlo, sino para dejar de cargarlo solo. No fuiste hecho para sostener esto sin Él.',
  },
  'str-007': {
    title: 'Cuando no quieres orar',
    body: 'El hecho de que hayas abierto esto ya es oración. El deseo de desear ya es deseo. Quédate unos segundos más. La sequedad no es toda la historia.',
  },
  'str-008': {
    title: 'Lo que otro tiene',
    body: 'Has estado midiendo tu vida con la de otro. Para. Su porción es suya. La tuya es tuya — dada específicamente, amada específicamente. Pide la gracia de recibirla.',
  },
  'str-009': {
    title: 'El enemigo es real',
    body: 'No todo lo que perturba tu paz viene de adentro. Hay un adversario real, y la oración es tu primera defensa. Nombra lo que te está atacando. Tráelo ante Cristo.',
  },
};
