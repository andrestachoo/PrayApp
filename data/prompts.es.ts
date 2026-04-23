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
};
