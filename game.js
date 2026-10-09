// Junior Astronaut Mission Trainer - game.js
// كل منطق اللعبة هنا. التصميم في style.css والهيكل في index.html.

// ======== البيانات الأساسية: المستويات والموارد والأحداث ========
const LEVELS = [];
const RINFO = { energy: { ic: '⚡', n: 'الطاقة', c: 'var(--energy)' }, water: { ic: '💧', n: 'الماء', c: 'var(--water)' }, food: { ic: '🌱', n: 'الأكل', c: 'var(--food)' }, oxygen: { ic: '🫁', n: 'الأكسجين', c: 'var(--oxygen)' }, radiation: { ic: '🛡️', n: 'الإشعاع', c: 'var(--rad)' }, health: { ic: '❤️', n: 'الصحة', c: '#ff6b6b' } };
const LEVEL_EVENTS = {
    moon: [
        { t: '🌑 غبار قمري كاشط', d: 'الغبار القمري دخل مفاصل البدلة ونظام تنقية الهواء. لازم تتصرف قبل ما يضر الأكسجين.', ch: [
                { t: 'نضف الفلاتر يدويًا (خطوة برّه)', e: { oxygen: 8, radiation: -8 }, r: 75, ok: 'نظفت الفلاتر بنجاح والأكسجين رجع طبيعي.', bad: 'اتعرضت لإشعاع إضافي أثناء العمل برّه.', f: 'غبار أبولو كان حاد جدًا وبيقطع القفازات، وسبب مشاكل تنفس لبعض الرواد.' },
                { t: 'شغّل نظام التنقية الاحتياطي', e: { oxygen: 4, energy: -10 }, r: 95, ok: 'النظام الاحتياطي حل المشكلة بأمان.', bad: 'النظام استهلك طاقة أكتر من المتوقع.', f: 'بدلات Artemis الجديدة مصممة بمقاومة أعلى للغبار القمري من بدلة أبولو.' }
            ] },
        { t: '⚡ الطاقة قليلة.. الليل القمري قرّب', d: 'الشمس هتغيب 14 يوم أرضي كامل، والألواح الشمسية هتوقف تمامًا خلال ساعات.', ch: [
                { t: 'فعّل توفير الطاقة القصوى', e: { energy: 12, food: -6 }, r: 90, ok: 'قللت كل الأنظمة الغير ضرورية، والطاقة هتكفي لليل.', bad: 'بعض الأنظمة رفضت الإغلاق بالكامل.', f: 'القواعد القمرية المستقبلية بتخطط لمفاعلات نووية صغيرة (Fission Surface Power) لتغطية الليل بدون انقطاع.' },
                { t: 'استخدم احتياطي البطارية بالكامل', e: { energy: 20, radiation: -10 }, r: 55, ok: 'الطاقة ارتفعت بشكل كبير.', bad: 'البطارية ماديتش الكفاءة المتوقعة، والدرع الإشعاعي اتأثر.', f: 'رواد أبولو اعتمدوا على خلايا وقود بدل الألواح الشمسية في رحلاتهم القصيرة.' }
            ] },
        { t: '🛡️ تحذير عاصفة إشعاعية', d: 'أجهزة الاستشعار رصدت زيادة مفاجئة في الإشعاع القادم من الشمس.', ch: [
                { t: 'احتمِ في الملجأ المدرّع فورًا', e: { radiation: 15, energy: -8 }, r: 95, ok: 'الاحتماء نجح والدرع حمى الطاقم بالكامل.', bad: 'الملجأ ماكانش معزول بالكامل.', f: 'روّاد الفضاء المحترفين ليهم حد أقصى 600 مليسيفرت إشعاع طول مسيرتهم المهنية.' },
                { t: 'كمّل المهمة الخارجية بسرعة', e: { radiation: -15 }, r: 40, ok: 'خلصت المهمة بسرعة قبل ما الجرعة تزيد.', bad: 'تعرضت لجرعة إشعاع أعلى من الآمن.', f: 'معدل الإشعاع اليومي في الفضاء العميق بيتراوح بين 0.5 و2 مليسيفرت.' }
            ] },
        { t: '💧 تسرب في نظام المياه', d: 'إحساس بانخفاض غريب في ضغط نظام إعادة تدوير المياه — فيه تسرب صغير في الأنابيب.', ch: [
                { t: 'أصلح التسرب بنفسك', e: { water: 10, oxygen: -5 }, r: 70, ok: 'الإصلاح نجح والماء رجع لمستواه.', bad: 'الإصلاح استغرق وقت أطول واستهلك أكسجين إضافي.', f: 'محطة الفضاء الدولية بتسترجع أكتر من 90% من كل المياه المستخدمة عن طريق التدوير.' },
                { t: 'قنّن استهلاك المياه لحد الإصلاح الكامل', e: { water: -8, food: 5 }, r: 100, ok: 'التقنين حافظ على الوضع مستقر لحد الإصلاح الكامل.', bad: '', f: 'رائد الفضاء يحتاج حوالي 3.8 لتر ماء يوميًا للشرب والأكل والنظافة.' }
            ] }
    ],
    mars: [
        { t: '🌪️ عاصفة ترابية تحجب الشمس', d: 'عاصفة ترابية ضخمة بدأت تتصاعد وبتهدد بتغطية الألواح الشمسية بالكامل — بالظبط زي اللي حصل مع مركبة Opportunity الحقيقية.', ch: [
                { t: 'أوقف الأنظمة غير الضرورية وانتظر العاصفة', e: { energy: 10, food: -5 }, r: 85, ok: 'وفّرت الطاقة بنجاح لحد ما العاصفة هدت.', bad: 'العاصفة طالت أكتر من المتوقع.', f: 'عاصفة ترابية شبيهة أنهت مهمة Opportunity الحقيقية نهائيًا سنة 2018 بعد ما قطعت الطاقة عنها تمامًا.' },
                { t: 'شغّل المولد النووي الاحتياطي (RTG)', e: { energy: 18, radiation: -6 }, r: 70, ok: 'المولد النووي وفر طاقة ثابتة بعيدًا عن الشمس.', bad: 'المولد احتاج وقت أطول للاستقرار.', f: 'مركبتا Curiosity وPerseverance بتعتمدوا على مولد نووي (RTG) بدل الألواح الشمسية، فالعواصف الترابية ملهاش تأثير عليهم.' }
            ] },
        { t: '🛡️ تحذير إشعاع مرتفع', d: 'المريخ معندوش مجال مغناطيسي عالمي زي الأرض، فمستوى الإشعاع الكوني الواصل للسطح ارتفع فجأة.', ch: [
                { t: 'انزل للمأوى تحت السطح', e: { radiation: 15, energy: -5 }, r: 90, ok: 'المأوى تحت السطح قلل التعرض للإشعاع بشكل كبير.', bad: 'المأوى مكانش معزول بالكامل.', f: 'قلة المجال المغناطيسي على المريخ بتخلي الإشعاع أعلى بكتير من الأرض، وده سبب رئيسي لتفضيل المأوى تحت السطح في المهمات المستقبلية.' },
                { t: 'كمّل الجدول العلمي براندك المدرّع بس', e: { radiation: -12 }, r: 50, ok: 'خلصت المهمة العلمية في الوقت المتاح.', bad: 'اتعرضت لجرعة إشعاع أعلى من الآمن.', f: 'ناسا بتحدد حد أقصى 600 مليسيفرت لمسيرة رائد الفضاء المهنية بالكامل.' }
            ] },
        { t: '🫁 عطل في نظام تصنيع الأكسجين', d: 'الجهاز اللي بيحول ثاني أكسيد الكربون الجوي لأكسجين قابل للتنفس بدأ ينتج كمية أقل من المتوقع.', ch: [
                { t: 'أعد ضبط الجهاز يدويًا', e: { oxygen: 12, energy: -8 }, r: 75, ok: 'الضبط اليدوي رجع الإنتاج لمعدله الطبيعي.', bad: 'الضبط ماخدش بالكامل واستهلك طاقة إضافية.', f: 'تجربة MOXIE الحقيقية على متن Perseverance نجحت فعليًا في تصنيع أكسجين تنفس من هواء المريخ الرقيق.' },
                { t: 'اعتمد على خزان الأكسجين الاحتياطي', e: { oxygen: 8, food: -4 }, r: 95, ok: 'الخزان الاحتياطي غطى الاحتياج بأمان.', bad: 'الخزان أقل امتلاءً مما كان متوقعًا.', f: 'غلاف المريخ الجوي رقيق جدًا (أقل من 1% من كثافة غلاف الأرض) وغالبيته ثاني أكسيد كربون غير قابل للتنفس مباشرة.' }
            ] },
        { t: '📦 تأخر في وصول شحنة المؤن', d: 'شحنة الطعام والماء القادمة من الأرض اتأخرت، والمخزون الحالي محتاج يكفي فترة أطول من المخطط.', ch: [
                { t: 'قنّن الطعام والماء بحذر', e: { food: -6, water: -6 }, r: 100, ok: 'التقنين حافظ على توازن المخزون لحد وصول الشحنة.', bad: '', f: 'رحلة المريخ بتاخد من 6 لـ9 شهور، وده بيخلي إدارة المؤن تحدي رئيسي لازم يتخطط له قبل الإطلاق.' },
                { t: 'استخدم جزء من مخزون الطوارئ', e: { food: 8, water: 8, energy: -6 }, r: 60, ok: 'مخزون الطوارئ عوّض النقص بشكل جيد.', bad: 'استهلكت من مخزون الطوارئ أكتر من اللازم.', f: 'كل كيلوجرام أكل أو ماء بيتحمل للمريخ بيكلف إطلاقه مبالغ ضخمة، فكفاءة استخدام الموارد أولوية قصوى.' }
            ] }
    ],
    mercury: [
        { t: '🔥 فروق حرارية قاتلة', d: 'الحرارة بتوصل 430 درجة في الشمس و-180 تحت الصفر في الظل، وعطارد ملوش غلاف جوي يوازن الحرارة.', ch: [
                { t: 'اشتغل في الجانب المظلم بس', e: { energy: -6, radiation: 8 }, r: 85, ok: 'العزل الحراري نجح والفريق اشتغل بأمان.', bad: 'التنقل بين الظل والشمس استهلك وقت وطاقة إضافية.', f: 'فوهات عطارد القطبية المظلمة دائمًا فيها جليد ماء رغم إنه أقرب كوكب للشمس!' },
                { t: 'استخدم الطاقة الشمسية القوية وبرّد النظام', e: { energy: 10, water: -8 }, r: 70, ok: 'الطاقة الوفيرة عوضت تكلفة التبريد.', bad: 'نظام التبريد استهلك مياه أكتر من المتوقع.', f: 'ضوء الشمس على عطارد أقوى 6.5 مرة من قوته على الأرض!' }
            ] },
        { t: '☢️ تعرض إشعاعي مباشر', d: 'غياب الغلاف الجوي بيخلي الإشعاع الشمسي المباشر خطر دائم على أي مهمة.', ch: [
                { t: 'قلل وقت التعرض للحد الأدنى', e: { radiation: 12, food: -4 }, r: 90, ok: 'قللت التعرض والحماية اتحسنت.', bad: 'المهمة استغرقت وقت أطول من المخطط.', f: 'مركبة MESSENGER استخدمت درع شمسي خاص عشان تفضل أجهزتها في الظل طول الرحلة.' },
                { t: 'اعتمد على درع البدلة بس', e: { radiation: -10 }, r: 55, ok: 'الدرع كان كافي في هذه المرة.', bad: 'تعرضت لجرعة إشعاع أعلى من الآمن.', f: 'مركبة Mariner 10 كانت أول مركبة تزور عطارد سنة 1974.' }
            ] }
    ],
    venus: [
        { t: '💨 ضغط جوي ساحق', d: 'الضغط على سطح الزهرة يعادل 92 ضعف ضغط الأرض — كافي يسحق أي معدات عادية خلال دقائق.', ch: [
                { t: 'ابقَ في الغلاف الجوي العلوي بس', e: { energy: 8, oxygen: -5 }, r: 88, ok: 'الطيران في الارتفاع العالي حافظ على سلامة المعدات.', bad: 'التيارات الهوائية العلوية كانت أعنف من المتوقع.', f: 'على ارتفاع 50 كم فوق سطح الزهرة، الضغط والحرارة قريبين جدًا من ظروف الأرض!' },
                { t: 'حاول الاقتراب من السطح لجمع بيانات', e: { oxygen: -12, radiation: 5 }, r: 35, ok: 'جمعت بيانات نادرة قبل ما تنسحب بالكامل.', bad: 'المعدات بدأت تتلف بسرعة من الحرارة والضغط.', f: 'أطول مسبار هبط على الزهرة نجا أقل من ساعتين بس قبل ما يتدمر تمامًا.' }
            ] },
        { t: '☁️ سحب حمض الكبريتيك', d: 'الغلاف الجوي مغطى بسحب كثيفة من حمض الكبريتيك تحجب أي رؤية بصرية للسطح.', ch: [
                { t: 'استخدم الرادار بدل الكاميرات', e: { energy: -8 }, r: 95, ok: 'رسم الرادار خريطة دقيقة للسطح تحت السحب.', bad: '', f: 'مركبة Magellan استخدمت رادار خاص "يشوف" عبر سحب الزهرة الكثيفة عشان يرسم خريطة كاملة للسطح.' },
                { t: 'انتظر فجوة عارضة في السحب', e: { energy: -4, food: -4 }, r: 50, ok: 'ظهرت فجوة صغيرة كفت لالتقاط صور واضحة.', bad: 'السحب فضلت كثيفة طول فترة الانتظار.', f: 'مركبة Mariner 2 كانت أول مركبة في التاريخ تزور كوكب تاني بنجاح، سنة 1962.' }
            ] }
    ],
    jupiter: [
        { t: '☢️ حزام إشعاع المشتري', d: 'المشتري محاط بأقوى أحزمة إشعاع في المجموعة الشمسية بالكامل — أخطر بيئة هتواجهها في رحلتك.', ch: [
                { t: 'فعّل الدرع الثقيل فورًا', e: { radiation: 18, energy: -10 }, r: 80, ok: 'الدرع الثقيل امتص معظم الإشعاع بنجاح.', bad: 'جزء من الإشعاع اخترق الدرع رغم كل الاحتياطات.', f: 'مركبة Juno بتستخدم خزنة تيتانيوم خاصة تحمي حاسوبها من إشعاع المشتري القاتل.' },
                { t: 'قلل مدة التواجد في المنطقة الخطرة', e: { radiation: 10 }, r: 65, ok: 'الخروج السريع قلل التعرض بشكل ملحوظ.', bad: 'الجرعة اللي اتلقيتها كانت أعلى من الآمن.', f: 'مركبة Europa Clipper احتاجت ألواح شمسية طولها 30 مترًا عشان تولد طاقة كافية بعيدًا عن الشمس.' }
            ] },
        { t: '🧊 اكتشاف محيط تحت الجليد', d: 'أجهزة الاستشعار على يوروبا رصدت إشارات قوية لمحيط ماء مالح ضخم تحت القشرة الجليدية.', ch: [
                { t: 'احفر عينة جليد للتحليل', e: { energy: -10, water: 8 }, r: 70, ok: 'العينة أكدت وجود مياه سائلة تحت السطح!', bad: 'الحفر استغرق طاقة أكتر من المخطط بسبب صلابة الجليد.', f: 'يوروبا يُعتقد إنها تحتوي على أكبر مخزون مياه محتمل في المجموعة الشمسية بالكامل.' },
                { t: 'اكتفِ بالمسح عن بعد', e: { energy: -3 }, r: 100, ok: 'المسح الآمن أعطى بيانات قيمة بدون مخاطرة.', bad: '', f: 'جانيميد، أكبر قمر في المجموعة الشمسية، هو القمر الوحيد اللي عنده مجال مغناطيسي خاص بيه.' }
            ] }
    ],
    saturn: [
        { t: '🌫️ الهبوط عبر غلاف تيتان', d: 'غلاف تيتان الجوي الكثيف جدًا (أكثف من الأرض!) بيخلي الهبوط تحدي مختلف تمامًا عن أي مكان تاني.', ch: [
                { t: 'استخدم مظلة كبيرة زي Huygens', e: { energy: -6, radiation: 5 }, r: 92, ok: 'الهبوط نجح بسلاسة بفضل كثافة الغلاف الجوي.', bad: 'المظلة انحرفت عن المسار المخطط قليلاً.', f: 'مسبار Huygens هبط فعليًا على تيتان سنة 2005 — أول هبوط بشري الصنع في النظام الشمسي الخارجي بالكامل.' },
                { t: 'جرّب الطيران بأجنحة بسيطة', e: { energy: -10 }, r: 60, ok: 'الكثافة العالية للغلاف الجوي خلت الطيران ممكن فعلاً!', bad: 'التحكم في الطيران كان أصعب من المتوقع.', f: 'كثافة غلاف تيتان الجوي عالية جدًا لدرجة إن أجنحة بسيطة ممكن نظريًا تحمل إنسان في الطيران فيه.' }
            ] },
        { t: '💧 بحيرات ميثان سائل', d: 'رادار المركبة رصد بحيرات كبيرة من الميثان والإيثان السائل على سطح تيتان — لكنها مش ماء صالح للشرب.', ch: [
                { t: 'اجمع عينة سائلة للتحليل', e: { water: -4, energy: -6 }, r: 80, ok: 'العينة أكدت تركيب البحيرة من ميثان وإيثان سائل.', bad: 'أدوات الجمع تجمدت جزئيًا بسبب البرودة الشديدة.', f: 'تيتان القمر الوحيد في المجموعة الشمسية غير الأرض اللي عنده سوائل مستقرة على سطحه.' },
                { t: 'ابحث عن جليد ماء حقيقي بدل البحيرات', e: { water: 6 }, r: 65, ok: 'لقيت صخر جليدي حقيقي تحت السطح!', bad: 'الحفر ماوصلش لعمق كافي.', f: 'الماء الحقيقي على تيتان موجود كصخر جليدي صلب جدًا بسبب البرودة القصوى (-179 درجة).' }
            ] }
    ],
    outer: [
        { t: '📡 تأخر الاتصال الهائل', d: 'البعد الشديد عن الأرض بيخلي أي إشارة راديو تاخد ساعات كاملة عشان توصل — مفيش تحكم لحظي ممكن.', ch: [
                { t: 'نفّذ القرار بنفسك بدون انتظار الأرض', e: { energy: -5, radiation: 6 }, r: 75, ok: 'قرارك المستقل كان صح وناسب الموقف.', bad: 'القرار احتاج تعديل لاحق لما وصل رد الأرض.', f: 'مركبة New Horizons نفذت تحليقها التاريخي بجانب بلوتو بالكامل أوتوماتيكيًا، لأن الإشارة كانت بتاخد 4.5 ساعة كل اتجاه.' },
                { t: 'انتظر تعليمات الأرض كاملة', e: { energy: -8, food: -5 }, r: 95, ok: 'التعليمات الدقيقة من الأرض ضمنت نتيجة مثالية.', bad: '', f: 'المهمات لهذه المنطقة البعيدة بتعتمد بالكامل على أنظمة تحكم ذاتي مبرمجة مسبقًا.' }
            ] },
        { t: '⚡ طاقة نووية تتناقص', d: 'المولد النووي (RTG) اللي بيغذي المركبة بيفقد كفاءته تدريجيًا كل ما الرحلة طالت أكتر.', ch: [
                { t: 'أغلق الأنظمة الغير أساسية', e: { energy: 12 }, r: 90, ok: 'الإغلاق الجزئي حافظ على الطاقة الأساسية شغالة.', bad: 'إغلاق بعض الأنظمة أثر على دقة القياسات.', f: 'مركبة Voyager 2 لسه شغالة بعد قرابة 50 سنة، بس بإغلاق أجهزة أول بأول عشان توفر طاقة مولدها النووي المتناقصة.' },
                { t: 'استمر بكل الأنظمة شغالة', e: { energy: -15 }, r: 40, ok: 'كل الأنظمة فضلت شغالة، بس الطاقة نزلت كتير.', bad: 'استهلاك الطاقة الزايد كان خطر حقيقي.', f: 'الشمس عند بلوتو ضعيفة جدًا (1/1600 من قوتها على الأرض) فالطاقة الشمسية مش خيار متاح هناك إطلاقًا.' }
            ] }
    ],
    sun: [
        { t: '☀️ الاقتراب من الهالة الشمسية', d: 'حرارة الهالة الشمسية بتتجاوز المليون درجة — أقرب اقتراب بشري الصنع من الشمس في التاريخ.', ch: [
                { t: 'اعتمد على الدرع الحراري الكربوني بالكامل', e: { radiation: 15, energy: -6 }, r: 88, ok: 'الدرع الكربوني حمى كل الأجهزة الحساسة بنجاح.', bad: 'جزء صغير من الدرع تأثر بالحرارة الشديدة.', f: 'مسبار Parker Solar Probe بيستخدم درع من ألياف كربونية بسمك 11 سم بس بيحمي الأجهزة وهي في حرارة الغرفة العادية.' },
                { t: 'قلل زاوية التعرض المباشر للشمس', e: { radiation: 8, energy: 4 }, r: 70, ok: 'تعديل الزاوية قلل الحرارة الواصلة بشكل ملحوظ.', bad: 'التعديل ماكانش كافي بمفرده.', f: 'سطح درع Parker المواجه للشمس بيوصل لحرارة حوالي 1377 درجة مئوية وقت أقرب اقتراب.' }
            ] },
        { t: '🔥 إدارة الحرارة الزائدة', d: 'على عكس كل الوجهات التانية، هنا المشكلة مش نقص الطاقة، لكن التخلص من الحرارة الهائلة الزايدة.', ch: [
                { t: 'استخدم نظام تبريد نشط', e: { energy: -10, water: -5 }, r: 85, ok: 'نظام التبريد نجح في تفريغ الحرارة الزائدة.', bad: 'النظام احتاج موارد أكتر من المتوقع.', f: 'الطاقة عند الشمس وفيرة جدًا وسهلة — التحدي الحقيقي عكسي تمامًا عن باقي الوجهات.' },
                { t: 'اعتمد على الدرع السلبي بس', e: { radiation: -8 }, r: 55, ok: 'الدرع كفى للحفاظ على الأجهزة بأمان.', bad: 'بعض الأجهزة سخنت أكتر من الحد الآمن.', f: 'مسبار Parker استغرق سنوات من التخطيط عشان يتحمل بيئة قريبة جدًا من الشمس لأول مرة في التاريخ.' }
            ] }
    ]
};
// ======== مواقف رواد الفضاء العامة (بتظهر في كل مستوى) ========
const UNI = [
    { t: '🦴 عظامك بتضعف', d: 'انعدام الجاذبية بيقلل كثافة عظامك وعضلاتك يوم بعد يوم.', ch: [
            { t: 'تمرين مقاومة ساعتين', e: { health: 14, energy: -6, food: -4 }, r: 90, ok: 'التمرين قوّى جسمك.', bad: 'التمرين أرهقك أكتر من المتوقع.', f: 'الرواد بيفقدوا 1% لـ1.5% من كثافة العظام شهريًا، وبيتمرنوا ساعتين يوميًا على المحطة الدولية.' },
            { t: 'تخطى التمرين ووفّر الطاقة', e: { health: -10, energy: 6 }, r: 80, ok: 'وفّرت طاقة، بس جسمك اتأثر.', bad: 'جسمك تعب أكتر من المتوقع.', f: 'من غير تمرين منتظم، العظام والعضلات بتضعف بسرعة في الفضاء.' }
        ] },
    { t: '🧠 اشتقت لأهلك', d: 'بقالك أسابيع بعيد عن الأرض والعزلة بدأت تأثر على مزاجك.', ch: [
            { t: 'كلّم عيلتك فيديو', e: { health: 12, energy: -5 }, r: 85, ok: 'صوت أهلك رفع معنوياتك.', bad: 'الاتصال ضعيف بس حسّيت بتحسن بسيط.', f: 'الدعم النفسي والتواصل مع العائلة جزء أساسي من أي مهمة فضائية طويلة.' },
            { t: 'ركّز في تقوية الدرع', e: { radiation: 6, health: -8 }, r: 75, ok: 'الدرع بقى أقوى.', bad: 'التعب النفسي أثر على تركيزك.', f: 'العزلة والعيش في مساحة ضيقة من أكبر التحديات النفسية للرواد.' }
        ] },
    { t: '😴 مش قادر تنام', d: 'الشمس بتشرق وتغرب 16 مرة في اليوم على المدار، وساعتك البيولوجية اتلخبطت.', ch: [
            { t: 'قناع عين وجدول نوم صارم', e: { health: 10, energy: -3 }, r: 90, ok: 'نمت كويس ورجعت لتركيزك.', bad: 'النوم كان متقطع.', f: 'رواد المحطة الدولية بيشوفوا 16 شروق وغروب كل يوم، فبيلتزموا بجدول نوم صارم.' },
            { t: 'اسهر وكمّل الشغل', e: { energy: 8, health: -12 }, r: 70, ok: 'خلصت شغل كتير بس اتعبت.', bad: 'التعب خلّاك تغلط في شغلك.', f: 'قلة النوم بتضعف التركيز، وده خطر في بيئة الفضاء.' }
        ] },
    { t: '🏥 ألم مفاجئ', d: 'حسّيت بألم وسط المهمة، ومفيش مستشفى في الجوار.', ch: [
            { t: 'استشر أطباء الأرض عن بعد', e: { health: 12, energy: -6 }, r: 80, ok: 'الأطباء وجّهوك خطوة بخطوة.', bad: 'تأخر الرد بسبب بُعد المسافة.', f: 'الرواد بيتدربوا على إسعافات متقدمة وبيستشيروا أطباء الأرض عن بعد.' },
            { t: 'عالج نفسك بالحقيبة الطبية', e: { health: 6, water: -4 }, r: 95, ok: 'الحقيبة الطبية كفت.', bad: '', f: 'كل مركبة فضاء فيها حقيبة طبية كاملة للطوارئ.' }
        ] }
];
const TH = { moon: ['#e8e8e8', '#8d8d8d', '#2f2f2f', '#1a2547'], mars: ['#ff9a6b', '#c1440e', '#5a1c08', '#3a1810'], mercury: ['#d3c2af', '#8a7a6a', '#3d342c', '#2b2320'], venus: ['#ffd98a', '#e0a13a', '#7a4a10', '#3a2a10'], jupiter: ['#f0d9b5', '#c08a5a', '#6a3f24', '#2a2140'], saturn: ['#f6e3b0', '#d4b06a', '#7a5e2c', '#2c2a40'], outer: ['#9fe3ff', '#4aa3d9', '#14456a', '#0e2440'], sun: ['#fff2a0', '#ffab1a', '#c2410c', '#3a1408'] };
const STORY = { moon: 'اختبارك الأول. القمر على بعد 3 أيام بس، وهناك هتتعلم أساسيات النجاة: غبار، ليل طويل، وإشعاع.', mars: 'المريخ.. 7 شهور من الرحلة في الفضاء العميق. عواصف ترابية بتقطع الاتصال، والقرار قرارك.', mercury: 'أقرب كوكب للشمس. نهار بيحرق وليل بيجمّد، والعزل الحراري هو صاحبك الوحيد.', venus: 'الزهرة هي الجحيم بعينه: ضغط بيسحق المعدات وسحب حمض. الخطة إنك تحوم فوق السحب.', jupiter: 'المشتري وأقماره.. أخطر إشعاع في النظام الشمسي، وتحت جليد يوروبا محيط ممكن يخبّي حياة.', saturn: 'زحل وقمره تيتان، القمر الوحيد بغلاف جوي كثيف. هتهبط بمظلة زي مسبار Huygens الحقيقي.', outer: 'حدود النظام الشمسي.. الإشارة بتاخد ساعات لتوصل الأرض، فلازم تعتمد على نفسك.', sun: 'المهمة الأخيرة: تلمس هالة الشمس. لو نجحت، هتبقى رائد فضاء كامل الأوصاف.' };
// ======== الأجرام السماوية الـ 29 + قوالب المشاكل (HZ) + مولّد الأحداث ========
const TY = { m: 'قمر', p: 'كوكب', a: 'كويكب', c: 'مذنب', d: 'كوكب قزم', k: 'جرم من حزام كايبر', s: 'نجم' };
const HZ = {
    cold: ['🥶 برد قارس', 'البرد على {n} بيجمّد المعدات والخراطيم.', ['فعّل سخانات المعدات', { energy: -9, oxygen: 8 }, 90, 'السخانات شغّلت المعدات من جديد.', 'السخانات استهلكت أكتر من المتوقع.'], ['قلّل النشاط الخارجي', { energy: 6, health: 5, food: -5 }, 85, 'وفّرت طاقة وانتظرت لحد ما الجو يهدى.', 'الانتظار طال واستهلكت أكل زيادة.']],
    heat: ['🔥 حرارة قاتلة', 'الحرارة على {n} عالية والأجهزة بتسخن بسرعة.', ['استخدم الدرع الحراري', { radiation: 10, energy: -6 }, 88, 'الدرع حمى كل الأجهزة.', 'جزء من الحرارة اخترق الدرع.'], ['شغّل نظام تبريد نشط', { oxygen: 8, water: -8, energy: -5 }, 75, 'التبريد خفّض الحرارة بنجاح.', 'التبريد استهلك مياه أكتر من اللازم.']],
    radiation: ['☢️ إشعاع قوي', 'أجهزة الاستشعار رصدت مستوى إشعاع مرتفع حواليك.', ['فعّل الدرع الثقيل', { radiation: 16, energy: -9 }, 82, 'الدرع امتص معظم الإشعاع.', 'جزء من الإشعاع اخترق الدرع.'], ['قلّل مدة التواجد بره', { radiation: 9, health: 3 }, 68, 'خروج سريع قلّل الجرعة.', 'الجرعة كانت أعلى من الآمن.']],
    wind: ['💨 رياح عاتية', 'رياح عنيفة بتهز المركبة وتهدد الأجهزة الخارجية.', ['ثبّت المعدات واحتمِ', { health: 7, energy: -6 }, 88, 'التثبيت حمى المعدات.', 'الرياح أتلفت جزء بسيط.'], ['كمّل القياسات بحذر', { energy: -4, radiation: -6, oxygen: 6 }, 60, 'جمعت بيانات نادرة وسط الرياح.', 'الرياح شوّشت القياسات.']],
    lowg: ['🪂 جاذبية شبه معدومة', 'الجاذبية على {n} ضعيفة جدًا، وأي حركة غلط ممكن تطيّرك بعيد.', ['اربط نفسك بمراسي', { health: 8, energy: -6 }, 88, 'المراسي ثبّتتك بأمان.', 'التثبيت أخد وقت وطاقة زيادة.'], ['اتحرك ببطء وحذر', { health: 5, food: -4, oxygen: 4 }, 92, 'تحركت بسلاسة من غير مشاكل.', 'الحركة البطيئة استهلكت أكسجين.']],
    delay: ['📡 تأخر الاتصال', 'الإشارة بتاخد وقت طويل بينك وبين الأرض.', ['خد القرار بنفسك', { energy: -5, radiation: 6, health: 4 }, 76, 'قرارك المستقل كان صح.', 'القرار احتاج تعديل لما رد الأرض.'], ['انتظر تعليمات الأرض', { energy: -8, food: -5, health: 6 }, 95, 'التعليمات الدقيقة ضمنت نتيجة آمنة.', '']],
    weaksun: ['⚡ ضوء شمس ضعيف', 'الشمس هنا ضعيفة والألواح الشمسية مش بتكفي.', ['اقفل الأنظمة غير الأساسية', { energy: 12 }, 90, 'وفّرت طاقة كفاية للأنظمة الأساسية.', 'بعض الأنظمة رفضت الإغلاق.'], ['شغّل المولد النووي (RTG)', { energy: 16, radiation: -6 }, 80, 'المولد النووي ثبّت الطاقة.', 'المولد احتاج وقت للاستقرار.']],
    volcano: ['🌋 نشاط وانفجارات', 'سطح {n} بينفث غازات ومواد من تحت الأرض فجأة.', ['ابعد عن مناطق النشاط', { health: 6, energy: -5 }, 85, 'ابتعدت وسلمت من الانفجار.', 'الابتعاد أخد وقت وطاقة.'], ['اجمع عينة بحذر', { water: 6, radiation: -6, health: -4 }, 55, 'عينة نادرة اتجمعت بنجاح.', 'العينة اتلفت أثناء الجمع.']],
    rough: ['🪨 تضاريس وعرة', 'الأرض على {n} مليانة فوهات وصخور حادة.', ['انزل بحذر بالمركبة', { energy: -6, health: 6 }, 85, 'الهبوط تم بأمان.', 'الهبوط أخد وقت وطاقة زيادة.'], ['اهبط سريعًا في أقرب مكان', { energy: 4, health: -8 }, 55, 'هبوط سريع ونجح.', 'الهبوط كان عنيف وأثر على المركبة.']],
    dust: ['🌫️ غبار وجسيمات', 'سحابة غبار وجسيمات صغيرة بتصطدم بالمركبة.', ['شغّل درع الجسيمات', { radiation: 6, energy: -7 }, 82, 'الدرع صدّ الجسيمات.', 'بعض الجسيمات اخترقت.'], ['ابعد عن السحابة', { energy: -5, oxygen: 5, health: 4 }, 90, 'ابتعدت لمسافة آمنة.', 'الابتعاد استهلك وقود.']]
};
const BODIES = [
    ['moon', 'القمر', 'm', 'r', .42, '', 'moon'],
    ['mars', 'المريخ', 'p', 'm', .46, '', 'mars'],
    ['phobos', 'فوبوس', 'm', 'r', .22, 'lowg,rough,radiation', '', 'فوبوس أكبر أقمار المريخ لكن قطره حوالي 22 كم بس، وجاذبيته ضعيفة جدًا.', 'مداره قريب لدرجة إنه بيلف حوالين المريخ حوالي 3 مرات كل يوم.', '#b8a99a,#7d6f63,#3a322c,#2a2320'],
    ['deimos', 'ديموس', 'm', 'r', .2, 'lowg,rough,delay', '', 'ديموس أصغر قمرين للمريخ، وقطره حوالي 12 كم بس.', 'سطحه أنعم من فوبوس لأن الغبار طمر معظم فوهاته.', '#c4b5a5,#8a7b6d,#40372f,#2b2420'],
    ['mercury', 'عطارد', 'p', 'r', .38, '', 'mercury'],
    ['venus', 'الزهرة', 'p', 'v', .5, '', 'venus'],
    ['bennu', 'بينو', 'a', 'r', .22, 'lowg,rough,delay', '', 'مركبة OSIRIS-REx جمعت عينة من بينو وأعادتها للأرض سنة 2023.', 'بينو كومة ركام من الصخور وبينفث جسيمات صغيرة من سطحه للفضاء.', '#7a7a7a,#4c4c4c,#1e1e1e,#1a1d26'],
    ['dimorphos', 'ديمورفوس', 'a', 'r', .2, 'lowg,delay,dust', '', 'مركبة DART اصطدمت بديمورفوس سنة 2022 وقصّرت مداره حوالي 32 دقيقة.', 'التجربة أثبتت إن تغيير مسار كويكب ممكن يحمي الأرض مستقبلاً.', '#bdb4a8,#857b6f,#3a342d,#232127'],
    ['eros', 'إيروس', 'a', 'r', .26, 'lowg,rough,delay', '', 'مركبة NEAR Shoemaker هبطت على إيروس سنة 2001، أول هبوط على كويكب في التاريخ.', 'إيروس بشكل حبة فول سوداني تقريبًا، وطوله حوالي 34 كم.', '#c9b79c,#8c7a62,#3f3629,#2b2418'],
    ['vesta', 'فيستا', 'a', 'r', .3, 'rough,lowg,weaksun', '', 'مركبة Dawn وصلت فيستا سنة 2011، وهو تاني أكبر جرم في حزام الكويكبات.', 'على فيستا فوهة عملاقة في قاعها جبل من أعلى الجبال المعروفة في النظام الشمسي.', '#d7d2c8,#9a9488,#46433c,#25262b'],
    ['ceres', 'سيريس', 'd', 'r', .32, 'cold,rough,weaksun', '', 'سيريس كوكب قزم، وDawn اكتشفت فيه بقع ساطعة هي رواسب أملاح.', 'Dawn أول مركبة تدور حول جرمين في حزام الكويكبات: فيستا ثم سيريس.', '#cfcfcf,#8f8f8f,#3c3c3c,#202430'],
    ['tempel1', 'المذنب تمبل 1', 'c', 'r', .24, 'dust,lowg,delay', '', 'مركبة Deep Impact أطلقت مقذوفًا على المذنب تمبل 1 سنة 2005 لتكشف داخله.', 'المذنبات كتل من الجليد والغبار، وبتطلّع ذيل لما تقرب من الشمس.', '#9a9a9a,#5e5e5e,#262626,#1a2030'],
    ['wild2', 'المذنب وايلد 2', 'c', 'r', .22, 'dust,delay,weaksun', '', 'مركبة Stardust جمعت غبار المذنب وايلد 2 وأعادته للأرض سنة 2006.', 'جمعت الغبار بمادة الإيروجل الخفيفة جدًا اللي بتمسك الجسيمات من غير ما تتلفها.', '#a89f95,#6b645c,#2d2a26,#1c2230'],
    ['jupiter', 'المشتري', 'p', 'g', .74, 'radiation,wind,delay', '', 'بقعة المشتري الحمراء العظيمة عاصفة أكبر من الكرة الأرضية كلها.', 'مركبة Juno بتدور حول المشتري من 2016 وبتدرس مجاله المغناطيسي وغلافه.'],
    ['io', 'آيو', 'm', 'o', .32, 'radiation,volcano,heat', '', 'آيو أكتر جرم بركاني نشاطًا في النظام الشمسي، وفيه مئات البراكين.', 'جاذبية المشتري بتعصر آيو وبتسخّنه من جوّه فبتفضل براكينه نشطة.', '#ffe9a0,#e0b030,#8a5a10,#3a2a10'],
    ['europa', 'يوروبا', 'm', 'c', .32, '', 'jupiter', '', '', '#f2ead8,#c9b99a,#7a6a58,#1b2a3a'],
    ['ganymede', 'جانيميد', 'm', 'c', .36, 'radiation,cold,rough', '', 'جانيميد أكبر قمر في النظام الشمسي، وأكبر حتى من كوكب عطارد.', 'هو القمر الوحيد المعروف إن له مجال مغناطيسي خاص بيه.', '#cfc6b8,#9a8f80,#4a443c,#222a38'],
    ['callisto', 'كاليستو', 'm', 'r', .34, 'radiation,cold,rough', '', 'كاليستو من أكتر أجرام النظام الشمسي فوهات، وسطحه قديم جدًا.', 'بعده عن المشتري بيخلي الإشعاع عليه أقل، فمقترح كقاعدة مستقبلية.', '#a89c8c,#6d6256,#2e2924,#1f232e'],
    ['saturn', 'زحل', 'p', 'g', .58, 'wind,cold,delay', '', 'حلقات زحل جليد ماء أغلبه، من حبيبات صغيرة لقطع بحجم منزل.', 'مركبة Cassini دارت حول زحل 13 سنة وانتهت بغطسة متعمدة في غلافه سنة 2017.'],
    ['titan', 'تيتان', 'm', 'h', .38, '', 'saturn', '', '', '#f2b45a,#c9822a,#6a3d10,#3a2410'],
    ['enceladus', 'إنسيلادوس', 'm', 'c', .26, 'cold,volcano,weaksun', '', 'إنسيلادوس بينفث نافورات مياه من محيط تحت جليده، وCassini طارت جواها.', 'مكونات النافورات (مياه ومواد عضوية) بتخليه مرشح للبحث عن حياة.', '#ffffff,#d6ecff,#7aa8c8,#14263a'],
    ['uranus', 'أورانوس', 'p', 'i', .5, 'cold,weaksun,delay', '', 'أورانوس بيلف على جنبه تقريبًا (ميل 98 درجة)، وزارته Voyager 2 بس سنة 1986.', 'لونه الأزرق المخضر بسبب غاز الميثان في غلافه الجوي.', '#c4f0f0,#7fd0d8,#2a7f90,#0e2a3a'],
    ['miranda', 'ميراندا', 'm', 'c', .26, 'cold,rough,delay', '', 'ميراندا قمر أورانوس بتضاريس غريبة، وفيه جرف Verona Rupes من أعلى الجروف المعروفة.', 'Voyager 2 صوّرته من مسافة قريبة سنة 1986، وده الزيارة الوحيدة له.', '#dcdcdc,#a0a0a8,#4c4c56,#1e2434'],
    ['neptune', 'نبتون', 'p', 'i', .5, 'wind,cold,delay', '', 'نبتون فيه أسرع رياح في النظام الشمسي، بتتعدى 2000 كم/س.', 'Voyager 2 هي المركبة الوحيدة اللي زارته سنة 1989.', '#8fb4ff,#3f6fd8,#13307a,#0c1a46'],
    ['triton', 'ترايتون', 'm', 'c', .32, 'cold,volcano,delay', '', 'ترايتون أكبر أقمار نبتون، وبيلف عكس اتجاه دوران الكوكب.', 'Voyager 2 صوّرت نافورات نيتروجين بتنفجر من سطحه.', '#f3d9d0,#c9a59a,#6e5650,#2a2030'],
    ['pluto', 'بلوتو', 'd', 'p', .34, '', 'outer', '', '', '#f0dcc0,#c9a37a,#6a4a30,#2a2228'],
    ['charon', 'شارون', 'm', 'r', .3, 'cold,delay,weaksun', '', 'شارون أكبر أقمار بلوتو، وقطره حوالي نص قطر بلوتو.', 'بلوتو وشارون بيدوروا حوالين نقطة بينهم وبيواجهوا بعض بنفس الوجه دايمًا.', '#bdbdbd,#8a8a8a,#3d3d3d,#202530'],
    ['arrokoth', 'أروكوث', 'k', 'r', .24, 'cold,delay,weaksun', '', 'أروكوث من حزام كايبر، وزارته New Horizons سنة 2019 وهو أبعد جرم تزوره مركبة من قريب.', 'شكله زي رجل ثلج من كتلتين ملتصقتين بلطف.', '#d98a6a,#a5522f,#4a2012,#2a1a1a'],
    ['sun', 'الشمس', 's', 's', .85, '', 'sun']
];
const BODY = BODIES.map(([id, n, ty, k, r, hz, pool, f1, f2, pal]) => ({ id, n, ty, k, r, hz: hz ? hz.split(',') : [], pool: pool || null, fs: [f1, f2].filter(Boolean), pal }));
const BY = {};
BODY.forEach((b, i) => { BY[b.id] = b; if (b.pal)
    TH[b.id] = b.pal.split(','); LEVELS.push({ id: b.id, n: b.n, ic: '', open: i === 0 }); if (!STORY[b.id] && b.fs[0])
    STORY[b.id] = `مهمتك الجاية: ${b.n} (${TY[b.ty]}). ${b.fs[0]}`; });
STORY.europa = 'يوروبا.. تحت قشرتها الجليدية محيط ماء مالح، وفوقها أحزمة إشعاع المشتري القاتلة.';
STORY.titan = 'تيتان القمر الوحيد بغلاف جوي كثيف. هتهبط بمظلة زي مسبار Huygens الحقيقي.';
STORY.pluto = STORY.outer;
function genEvents(b) { return [...b.hz].sort(() => Math.random() - .5).slice(0, 2).map((h, k) => { const t = HZ[h]; return { t: `${t[0]} — ${b.n}`, d: t[1].replace('{n}', b.n), ch: [2, 3].map(j => { const c = t[j]; return { t: c[0], e: c[1], r: c[2], ok: c[3], bad: c[4], f: b.fs[k] }; }) }; }); }
// ======== حالة اللعبة الحالية ========
let cur = {}, astroName = 'أيها الرائد', stars = {}, codex = [], xp = 0, snd = true;
const TOTAL = (() => { const f = new Set(); Object.values(LEVEL_EVENTS).flat().concat(UNI).forEach(e => e.ch.forEach(c => f.add(c.f))); BODY.forEach(b => b.fs.forEach(x => f.add(x))); return f.size; })();
function beep(f, d) { if (!snd)
    return; try {
    const a = beep.a || (beep.a = new (window.AudioContext || window.webkitAudioContext)()), o = a.createOscillator(), g = a.createGain();
    o.frequency.value = f;
    g.gain.value = .07;
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + d);
}
catch (e) { } }
// ======== الحفظ لكل رائد (localStorage) + ملفات الرواد وتسجيل الدخول ========
const SK = () => 'ja_save_' + curP;
function saveProgress() { if (!curP)
    return; try {
    localStorage.setItem(SK(), JSON.stringify({ open: LEVELS.filter(l => l.open).map(l => l.id), stars, codex, xp }));
}
catch (e) { } }
function readSave(id) { try {
    return JSON.parse(localStorage.getItem('ja_save_' + id) || 'null');
}
catch (e) {
    return null;
} }
function loadProgress() { const d = readSave(curP); if (!d)
    return; if (Array.isArray(d.open))
    LEVELS.forEach(l => { if (d.open.includes(l.id))
        l.open = true; }); stars = d.stars || {}; codex = d.codex || []; xp = d.xp || 0; }
function resetProgress() { try {
    localStorage.removeItem(SK());
}
catch (e) { } LEVELS.forEach((l, i) => l.open = i === 0); stars = {}; codex = []; xp = 0; renderLevels(); }
let profiles = [], curP = null, selP = null, delP = null, av = '🧑‍🚀';
const AVS = ['🧑‍🚀', '👧', '👦', '🦊', '🐼', '🐱'];
function saveProfiles() { try {
    localStorage.setItem('ja_profiles', JSON.stringify({ list: profiles, active: curP }));
}
catch (e) { } }
function loadProfiles() {
    try {
        const d = JSON.parse(localStorage.getItem('ja_profiles') || 'null');
        if (d && Array.isArray(d.list)) {
            profiles = d.list;
            curP = d.active;
        }
    }
    catch (e) { }
    try {
        const o = localStorage.getItem('ja_save');
        if (o && !profiles.length) {
            const id = 'p' + Date.now().toString(36);
            profiles.push({ id, name: JSON.parse(o).name || 'رائد', av: '🧑‍🚀' });
            localStorage.setItem('ja_save_' + id, o);
            localStorage.removeItem('ja_save');
            curP = id;
            saveProfiles();
        }
    }
    catch (e) { }
    if (!profiles.find(p => p.id === curP))
        curP = null;
    selP = curP;
}
function applyProfile(id) { curP = id; const p = profiles.find(x => x.id === id); astroName = p ? p.name : 'أيها الرائد'; LEVELS.forEach((l, i) => l.open = i === 0); stars = {}; codex = []; xp = 0; loadProgress(); saveProfiles(); renderLevels(); }
function renderLogin() {
    const L = document.getElementById('profList');
    L.innerHTML = '';
    profiles.forEach(p => { const d = readSave(p.id) || {}, n = Object.values(d.stars || {}).filter(v => v).length, el = document.createElement('div'); el.className = 'pchip' + (p.id === selP ? ' sel' : ''); el.innerHTML = `<span class="pav">${p.av}</span><b>${p.name}</b><small>⭐ ${d.xp || 0} · ${n} وجهة</small><i class="pdel">${delP === p.id ? 'تأكيد الحذف؟' : '✕'}</i>`; el.onclick = e => { if (e.target.classList.contains('pdel')) {
        if (delP === p.id) {
            profiles = profiles.filter(x => x.id !== p.id);
            try {
                localStorage.removeItem('ja_save_' + p.id);
            }
            catch (_) { }
            if (selP === p.id)
                selP = null;
            if (curP === p.id)
                curP = null;
            delP = null;
            saveProfiles();
        }
        else
            delP = p.id;
    }
    else {
        selP = p.id;
        delP = null;
    } renderLogin(); }; L.appendChild(el); });
    document.getElementById('goBtn').disabled = !selP;
    document.getElementById('lsub').textContent = profiles.length ? 'اختار رائد الفضاء وانطلق، أو ضيف رائد جديد (أكتر من طفل على نفس الجهاز).' : 'اكتب اسمك واختار شكلك، وصاروخك هيطير بيك.';
    if (!profiles.length)
        showNew(true);
}
function showNew(v) { document.getElementById('newForm').style.display = v ? 'block' : 'none'; document.getElementById('addBtn').style.display = v ? 'none' : ''; document.getElementById('avRow').innerHTML = AVS.map(x => `<button class="av${x === av ? ' on' : ''}" onclick="av='${x}';showNew(true)">${x}</button>`).join(''); }
function createP() { const i = document.getElementById('newName'), n = i.value.trim(); if (!n) {
    i.focus();
    return;
} const id = 'p' + Date.now().toString(36); profiles.push({ id, name: n.slice(0, 14), av }); selP = id; i.value = ''; saveProfiles(); showNew(false); renderLogin(); }
function switchP() { selP = curP; delP = null; renderLogin(); showScreen('s-intro'); }
function launch() { if (!selP || launch.b)
    return; launch.b = 1; const r = document.getElementById('rocket'); r.classList.add('go'); beep(110, .6); if (GL)
    GL.launch(true); setTimeout(() => { applyProfile(selP); if (GL)
    GL.launch(false); r.classList.remove('go'); launch.b = 0; showScreen('s-levels'); }, 1900); }
// ======== منطق الواجهة واللعب: الخريطة، البريفنج، الأيام، القرارات، النتيجة ========
function showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); if (id !== 's-game' && id !== 's-end')
    document.body.style.removeProperty('--t1'); }
function currentLevel() { return LEVELS.find(l => l.id === cur.levelId); }
function decay() { return Math.round(3 + LEVELS.findIndex(l => l.id === cur.levelId) * 8 / (LEVELS.length - 1)); }
function renderLevels() { const g = document.getElementById('levelsGrid'); g.innerHTML = ''; LEVELS.forEach((l, i) => { const p = l.open, s = stars[l.id] || 0, t = TH[l.id], row = document.createElement('div'); row.className = 'node-row ' + (i % 2 ? 'r' : 'l'); row.innerHTML = `<div class="node ${p ? 'open' : 'locked'}"><div class="circ" style="${p ? `background:radial-gradient(circle at 35% 30%,${t[0]},${t[1]} 60%,${t[2]})` : ''}">${p ? '' : '🔒'}</div><small>${l.n}</small><small class="st">${p ? '★'.repeat(s) + '☆'.repeat(3 - s) : ''}</small></div>`; if (p)
    row.querySelector('.node').onclick = () => startMission(l.id); g.appendChild(row); }); document.getElementById('xpLbl').textContent = `${(profiles.find(p => p.id === curP) || { av: '🧑‍🚀' }).av} ${astroName} · ⭐ ${xp} · 🔬 ${codex.length}/${TOTAL}`; }
function showCodex() { document.getElementById('codexList').innerHTML = codex.length ? codex.map(f => `<div class="fact">🔬 ${f}</div>`).join('') : '<p class="tag">لسه ماكتشفتش حاجة — العب وخد قرارات!</p>'; showScreen('s-codex'); }
function buildEvents(id) { const b = BY[id], sh = a => [...a].sort(() => Math.random() - .5), l = sh(b.pool ? LEVEL_EVENTS[b.pool] : genEvents(b)).slice(0, 2), u = sh(UNI); return [l[0], u[0], l[1], u[1]]; }
function applyTheme(id) { const t = TH[id], p = document.getElementById('planet'); document.body.style.setProperty('--t1', t[3]); p.style.background = `radial-gradient(circle at 35% 30%,${t[0]},${t[1]} 55%,${t[2]})`; p.style.setProperty('--pg', t[1] + '99'); }
function startMission(id) { const ni = document.getElementById('astroName'); if (ni && ni.value.trim())
    astroName = ni.value.trim(); cur = { levelId: id, r: { energy: 80, water: 80, food: 80, oxygen: 80, radiation: 80, health: 80 }, day: 0, events: buildEvents(id) }; applyTheme(id); saveProgress(); showScreen('s-game'); showBriefing(); }
function showBriefing() { const l = currentLevel(); document.getElementById('bars').innerHTML = ''; document.getElementById('dayLbl').textContent = `🤖 رسالة من نوفا — ${l.n}`; document.getElementById('eventCard').innerHTML = `<h2>🎙️ مرحبًا يا ${astroName}</h2><p>${STORY[l.id]}</p><p style="color:var(--text)">⚠️ كل يوم مواردك بتنزل لوحدها <b>${decay()}</b> نقطة وصحتك ❤️ بتنزل كمان. قراراتك هي اللي هتحافظ عليها، ولو أي مورد وصل صفر المهمة بتفشل.</p><button class="btn" onclick="nextEvent()">🚀 انطلق</button>`; }
function renderBars() { const b = document.getElementById('bars'); b.innerHTML = ''; Object.keys(RINFO).forEach(k => { const v = Math.max(0, Math.min(100, cur.r[k])); b.innerHTML += `<div class="bar-row"><span class="lbl">${RINFO[k].ic} ${RINFO[k].n}</span><div class="bar-track"><div class="bar-fill" style="width:${v}%;background:${RINFO[k].c}"></div></div><span>${v}</span></div>`; }); }
function hint(c) { const k = c.r >= 85 ? ['آمن', 'ok'] : c.r >= 60 ? ['متوسط', 'mid'] : ['مخاطرة', 'bad']; return `<span class="hint"><i class="chip ${k[1]}">${k[0]}</i> ` + Object.entries(c.e).map(([a, v]) => RINFO[a].ic + (v > 0 ? '▲' : '▼')).join(' ') + '</span>'; }
function nextEvent() { cur.day++; const L = cur.events.length; if (cur.day > L) {
    renderBars();
    endMission(true);
    return;
} document.getElementById('dayLbl').textContent = `اليوم ${cur.day} من ${L} — ${currentLevel().n}`; let note = ''; if (cur.day > 1) {
    const d = decay();
    Object.keys(cur.r).forEach(k => cur.r[k] = Math.max(0, cur.r[k] - (k === 'health' ? 2 : d)));
    note = `<div class="fact" style="margin-bottom:10px">🕒 مرّ يوم — الموارد -${d} والصحة -2</div>`;
    if (Object.values(cur.r).some(v => v <= 0)) {
        renderBars();
        endMission(false);
        return;
    }
} renderBars(); const ev = cur.events[cur.day - 1]; document.getElementById('eventCard').innerHTML = note + `<h2>${ev.t}</h2><p>${ev.d}</p>` + ev.ch.map((c, i) => `<button class="choice" onclick="pick(${i})">${c.t}${hint(c)}</button>`).join(''); }
function pick(i) { const ev = cur.events[cur.day - 1], c = ev.ch[i], ok = Math.random() * 100 < c.r, ch = []; Object.keys(c.e).forEach(k => { const b = cur.r[k], v = Math.max(0, Math.min(100, b + (ok ? c.e[k] : Math.round(c.e[k] / 2)))); cur.r[k] = v; ch.push(`<b class="${v >= b ? 'up' : 'dn'}">${RINFO[k].ic} ${v >= b ? '+' : ''}${v - b}</b>`); }); let nf = false; if (!codex.includes(c.f)) {
    codex.push(c.f);
    nf = true;
} renderBars(); if (ok)
    beep(700, .15);
else {
    beep(160, .3);
    const w = document.querySelector('.wrap');
    w.classList.add('shake');
    setTimeout(() => w.classList.remove('shake'), 400);
} const dead = Object.values(cur.r).some(v => v <= 0); document.getElementById('eventCard').innerHTML = `<h2>${ev.t}</h2><div class="outcome ${ok ? 'ok' : 'bad'}">${ok ? '✅ ' + c.ok : '⚠️ ' + (c.bad || c.ok)}</div><div class="chg">${ch.join(' ')}</div><div class="fact">🤖 <b>نوفا:</b> ${c.f}</div>${nf ? '<div class="fact" style="border-color:var(--food)">🔬 اكتشاف جديد اتضاف لسجلك!</div>' : ''}<button class="btn" onclick="${dead ? 'endMission(false)' : 'nextEvent()'}">${dead ? 'عرض النتيجة' : 'اليوم التالي ←'}</button>`; saveProgress(); }
function endMission(success) { showScreen('s-end'); const ks = Object.keys(cur.r), avg = Math.round(ks.reduce((a, k) => a + cur.r[k], 0) / ks.length), s = success ? (avg >= 70 ? 3 : avg >= 50 ? 2 : 1) : 0, l = currentLevel(), idx = LEVELS.indexOf(l); document.getElementById('resIcon').textContent = success ? '🏆' : '💥'; document.getElementById('resTitle').textContent = success ? 'نجحت المهمة!' : 'فشلت المهمة'; let sub = success ? `${'⭐'.repeat(s)}${'☆'.repeat(3 - s)} — متوسط الموارد ${avg}%` : 'أحد مواردك وصل للصفر. راجع الاستهلاك اليومي وجرّب استراتيجية مختلفة!'; if (success) {
    xp += s * 10;
    stars[l.id] = Math.max(stars[l.id] || 0, s);
    const nx = LEVELS[idx + 1];
    if (nx && !nx.open) {
        nx.open = true;
        sub += `<br>🎉 فتحت مستوى ${nx.n}!`;
    }
    if (!nx) {
        document.getElementById('resIcon').textContent = '🎖️';
        document.getElementById('resTitle').textContent = `مبروك يا ${astroName}! أتممت الرحلة الكبرى`;
        sub += `<br>نقاطك ${xp} ⭐ واكتشفت ${codex.length} معلومة حقيقية`;
    }
    beep(880, .4);
} saveProgress(); document.getElementById('resSub').innerHTML = sub; }
loadProfiles();
if (curP)
    applyProfile(curP);
else
    renderLevels();
renderLogin();
// ======== المحرك ثلاثي الأبعاد (WebGL) من غير مكتبات ========
const GL = (() => {
    try {
        const cv = document.getElementById('gl'), gl = cv.getContext('webgl', { antialias: true, alpha: false });
        if (!gl)
            return null;
        const DPR = Math.min(devicePixelRatio || 1, 2), vh = 2 * 10 * Math.tan(25 * Math.PI / 180), lb = document.getElementById('lbls');
        const M4 = { id: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            mul: (a, b) => { const o = new Float32Array(16); for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++) {
                    let t = 0;
                    for (let k = 0; k < 4; k++)
                        t += a[k * 4 + j] * b[i * 4 + k];
                    o[i * 4 + j] = t;
                } return o; },
            tr: (x, y, z) => { const o = M4.id(); o[12] = x; o[13] = y; o[14] = z; return o; },
            sc: v => { const o = M4.id(); o[0] = o[5] = o[10] = v; return o; }, sc3: (x, y, z) => { const o = M4.id(); o[0] = x; o[5] = y; o[10] = z; return o; },
            ry: a => { const c = Math.cos(a), n = Math.sin(a), o = M4.id(); o[0] = c; o[2] = -n; o[8] = n; o[10] = c; return o; },
            rx: a => { const c = Math.cos(a), n = Math.sin(a), o = M4.id(); o[5] = c; o[6] = n; o[9] = -n; o[10] = c; return o; },
            rz: a => { const c = Math.cos(a), n = Math.sin(a), o = M4.id(); o[0] = c; o[1] = n; o[4] = -n; o[5] = c; return o; } };
        const mm = (...a) => a.reduce((p, q) => M4.mul(p, q));
        const ssc = (id, r) => { const t = BY[id].ty; return t === 'a' || t === 'c' || t === 'k' ? M4.sc3(r * 1.35, r * .8, r * .95) : M4.sc(r); };
        function persp() { const f = 1 / Math.tan(25 * Math.PI / 180), a = cv.width / cv.height, n = .1, r = 200, o = new Float32Array(16); o[0] = f / a; o[5] = f; o[10] = (r + n) / (n - r); o[11] = -1; o[14] = 2 * r * n / (n - r); return o; }
        const VS = 'attribute vec3 aP;attribute vec3 aN;attribute vec2 aU;uniform mat4 uMVP;uniform mat4 uM;varying vec3 vN;varying vec2 vU;varying vec3 vW;void main(){vN=(uM*vec4(aN,0.)).xyz;vU=aU;vW=(uM*vec4(aP,1.)).xyz;gl_Position=uMVP*vec4(aP,1.);}';
        const FS = 'precision mediump float;varying vec3 vN;varying vec2 vU;varying vec3 vW;uniform sampler2D uT;uniform vec3 uG;uniform float uUn;uniform float uDim;uniform float uA;void main(){vec4 t=texture2D(uT,vU);vec3 n=normalize(vN),v=normalize(vec3(0.,0.,10.)-vW),l=normalize(vec3(-.6,.5,.8));float d=max(dot(n,l),0.),r=pow(1.-max(dot(n,v),0.),3.);vec3 c=uUn>.5?t.rgb*1.1:t.rgb*(.16+1.05*d);c+=uG*r*(uUn>.5?.9:.25+.9*d);gl_FragColor=vec4(c*uDim,t.a*uA);}';
        const PVS = 'attribute vec3 aP;uniform mat4 uMVP;uniform float uS;void main(){gl_Position=uMVP*vec4(aP,1.);gl_PointSize=uS;}';
        const PFS = 'precision mediump float;uniform vec4 uC;void main(){float a=smoothstep(.5,.15,length(gl_PointCoord-.5));gl_FragColor=vec4(uC.rgb,uC.a*a);}';
        function prog(v, f, at) { const p = gl.createProgram(); for (const [t, src] of [[gl.VERTEX_SHADER, v], [gl.FRAGMENT_SHADER, f]]) {
            const h = gl.createShader(t);
            gl.shaderSource(h, src);
            gl.compileShader(h);
            if (!gl.getShaderParameter(h, gl.COMPILE_STATUS))
                throw new Error(gl.getShaderInfoLog(h));
            gl.attachShader(p, h);
        } at.forEach((a, i) => gl.bindAttribLocation(p, i, a)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(p)); return p; }
        const pm = prog(VS, FS, ['aP', 'aN', 'aU']), pp = prog(PVS, PFS, ['aP']), ul = (p, n) => gl.getUniformLocation(p, n);
        const L = { mvp: ul(pm, 'uMVP'), m: ul(pm, 'uM'), g: ul(pm, 'uG'), un: ul(pm, 'uUn'), dim: ul(pm, 'uDim'), a: ul(pm, 'uA'), t: ul(pm, 'uT'), pmvp: ul(pp, 'uMVP'), ps: ul(pp, 'uS'), pc: ul(pp, 'uC') };
        function mesh(v, i) { const vb = gl.createBuffer(), ib = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW); return { vb, ib, n: i.length }; }
        const SP = (() => { const v = [], i = [], A = 48, B = 32; for (let j = 0; j <= B; j++)
            for (let k = 0; k <= A; k++) {
                const th = j / B * Math.PI, ph = k / A * Math.PI * 2, x = Math.cos(ph) * Math.sin(th), y = Math.cos(th), z = Math.sin(ph) * Math.sin(th);
                v.push(x, y, z, x, y, z, k / A, j / B);
            } for (let j = 0; j < B; j++)
            for (let k = 0; k < A; k++) {
                const a = j * (A + 1) + k, b = a + A + 1;
                i.push(a, b, a + 1, b, b + 1, a + 1);
            } return mesh(v, i); })();
        const QX = mesh([-1, 0, -1, 0, 1, 0, 0, 0, 1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, -1, 0, 1, 0, 1, 0, 0, 1], [0, 1, 2, 0, 2, 3]);
        const QY = mesh([-1, -1, 0, 0, 0, 1, 0, 1, 1, -1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, -1, 1, 0, 0, 0, 1, 0, 0], [0, 1, 2, 0, 2, 3]);
        function pts(a) { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a), gl.STATIC_DRAW); return { b, n: a.length / 3 }; }
        const rr = v => (Math.random() - .5) * v, S1 = [], S2 = [], TR = [];
        for (let i = 0; i < 1500; i++)
            S1.push(rr(130), rr(130), -25 - Math.random() * 40);
        for (let i = 0; i < 160; i++)
            S2.push(rr(100), rr(100), -25 - Math.random() * 40);
        for (let a = 0; a <= (LEVELS.length - 1) * .9; a += .04)
            TR.push(Math.sin(a) * 2.3, a / .9 * 1.12, Math.cos(a) * 2.3);
        const ST1 = pts(S1), ST2 = pts(S2), TRL = pts(TR);
        let VP;
        function dMesh(m, tx, model, o) { o = o || {}; gl.useProgram(pm); gl.bindBuffer(gl.ARRAY_BUFFER, m.vb); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib); for (let i = 0; i < 3; i++)
            gl.enableVertexAttribArray(i); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24); gl.uniformMatrix4fv(L.mvp, false, M4.mul(VP, model)); gl.uniformMatrix4fv(L.m, false, model); gl.uniform3fv(L.g, o.g || [0, 0, 0]); gl.uniform1f(L.un, o.un ? 1 : 0); gl.uniform1f(L.dim, o.dim == null ? 1 : o.dim); gl.uniform1f(L.a, 1); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx); gl.uniform1i(L.t, 0); gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_SHORT, 0); }
        function dPts(p, size, col, model) { gl.useProgram(pp); gl.bindBuffer(gl.ARRAY_BUFFER, p.b); gl.enableVertexAttribArray(0); gl.disableVertexAttribArray(1); gl.disableVertexAttribArray(2); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.uniformMatrix4fv(L.pmvp, false, M4.mul(VP, model || M4.id())); gl.uniform1f(L.ps, size * DPR); gl.uniform4fv(L.pc, col); gl.drawArrays(gl.POINTS, 0, p.n); }
        function glTex(c) { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c); gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
        const cvs = n => { const c = document.createElement('canvas'); c.width = c.height = n; return c; };
        const T2 = Object.assign({ earth: ['#9ed0ff', '#2a6fd0', '#0b2a5c', '#0a1a3a'] }, TH), KIND = { earth: 'e' }, RAD = {}, TC = {};
        BODY.forEach(b => { KIND[b.id] = b.k; RAD[b.id] = b.r; });
        const hx = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255), col = id => hx(T2[id][0]);
        function tex(id) {
            if (TC[id])
                return TC[id];
            const t = T2[id], k = KIND[id], c = document.createElement('canvas'), W = c.width = 512, H = c.height = 256, x = c.getContext('2d'), q = Math.random;
            const bl = (px, py, r, cl, a) => { const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, cl); g.addColorStop(1, cl + '00'); x.globalAlpha = a; x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r); x.globalAlpha = 1; };
            const lg = x.createLinearGradient(0, 0, 0, H);
            lg.addColorStop(0, t[1]);
            lg.addColorStop(.5, t[0]);
            lg.addColorStop(1, t[1]);
            x.fillStyle = lg;
            x.fillRect(0, 0, W, H);
            if (k === 'r')
                for (let i = 0; i < 150; i++) {
                    const r = 2 + q() * q() * 26, px = q() * W, py = q() * H;
                    bl(px, py, r, '#000000', .32);
                    x.strokeStyle = '#ffffff22';
                    x.beginPath();
                    x.arc(px, py, r * .9, 0, 7);
                    x.stroke();
                }
            if (k === 'm') {
                for (let i = 0; i < 40; i++)
                    bl(q() * W, q() * H, 20 + q() * 50, q() < .6 ? '#5a1c08' : '#f0b090', .4);
                x.fillStyle = '#ffffffcc';
                x.fillRect(0, 0, W, 9);
                x.fillRect(0, H - 9, W, 9);
            }
            if (k === 'v' || k === 'g' || k === 'i') {
                const pal = k === 'i' ? ['#1e4d9a', '#6fc3ff', '#0d2a66'] : k === 'v' ? ['#fff0b0', '#c98a2a', '#ffd98a'] : ['#f4e2c0', '#b9793f', '#8a5a2a', '#e8c690'];
                for (let y = 0, i = 0; y < H; y += 6 + q() * 16, i++) {
                    x.globalAlpha = .55;
                    x.fillStyle = pal[i % pal.length];
                    x.beginPath();
                    x.moveTo(0, y);
                    for (let px = 0; px <= W; px += 32)
                        x.lineTo(px, y + Math.sin(px * .05 + i) * 3);
                    x.lineTo(W, y + 14);
                    x.lineTo(0, y + 14);
                    x.fill();
                }
                x.globalAlpha = 1;
                if (k === 'g')
                    bl(350, 170, 34, '#c1440e', .7);
            }
            if (k === 's')
                for (let i = 0; i < 90; i++)
                    bl(q() * W, q() * H, 12 + q() * 40, q() < .5 ? '#fff2a0' : '#c2410c', .45);
            if (k === 'c') {
                for (let i = 0; i < 60; i++) {
                    x.strokeStyle = q() < .5 ? '#5a7a9a55' : '#ffffff44';
                    x.lineWidth = 1 + q() * 2;
                    x.beginPath();
                    x.moveTo(q() * W, q() * H);
                    x.quadraticCurveTo(q() * W, q() * H, q() * W, q() * H);
                    x.stroke();
                }
                for (let i = 0; i < 25; i++)
                    bl(q() * W, q() * H, 15 + q() * 40, '#ffffff', .25);
            }
            if (k === 'o')
                for (let i = 0; i < 70; i++)
                    bl(q() * W, q() * H, 6 + q() * 22, q() < .5 ? '#3a2a10' : q() < .5 ? '#e05a1a' : '#fff3b0', .6);
            if (k === 'h')
                for (let i = 0; i < 30; i++)
                    bl(q() * W, q() * H, 30 + q() * 60, q() < .5 ? '#e09a3a' : '#8a5a1a', .25);
            if (k === 'p') {
                for (let i = 0; i < 40; i++)
                    bl(q() * W, q() * H, 15 + q() * 45, q() < .6 ? '#6a4a30' : '#e8d2b0', .45);
                bl(300, 130, 60, '#ffffff', .85);
            }
            if (k === 'e') {
                x.fillStyle = '#1f6fbf';
                x.fillRect(0, 0, W, H);
                for (let i = 0; i < 16; i++)
                    bl(q() * W, 40 + q() * 176, 25 + q() * 55, q() < .75 ? '#3f9a4a' : '#c9a24a', .95);
                x.fillStyle = '#ffffffdd';
                x.fillRect(0, 0, W, 8);
                x.fillRect(0, H - 8, W, 8);
                for (let i = 0; i < 40; i++)
                    bl(q() * W, q() * H, 18 + q() * 40, '#ffffff', .3);
            }
            return TC[id] = glTex(c);
        }
        function ringTex() { const c = cvs(256), x = c.getContext('2d'); for (let r = 70; r < 127; r++) {
            const f = r / 128;
            x.strokeStyle = `rgba(${216 - Math.random() * 30 | 0},${192 - Math.random() * 30 | 0},138,${(.3 + .55 * Math.sin(f * 38) ** 2) * (f > .83 && f < .87 ? .12 : 1)})`;
            x.lineWidth = 1.6;
            x.beginPath();
            x.arc(128, 128, r, 0, 7);
            x.stroke();
        } return glTex(c); }
        function pulseTex() { const c = cvs(128), x = c.getContext('2d'); x.strokeStyle = '#4fd1ff'; x.lineWidth = 5; x.shadowColor = '#4fd1ff'; x.shadowBlur = 10; x.beginPath(); x.arc(64, 64, 50, 0, 7); x.stroke(); return glTex(c); }
        function rocketTex() { const c = cvs(64), x = c.getContext('2d'); x.translate(32, 32); x.fillStyle = '#ff9a3c'; x.beginPath(); x.moveTo(-12, 0); x.lineTo(-27, -6); x.lineTo(-27, 6); x.fill(); x.fillStyle = '#e0442f'; x.beginPath(); x.moveTo(-8, -7); x.lineTo(-17, -17); x.lineTo(-2, -7); x.fill(); x.beginPath(); x.moveTo(-8, 7); x.lineTo(-17, 17); x.lineTo(-2, 7); x.fill(); x.fillStyle = '#f4f4f8'; x.beginPath(); x.ellipse(0, 0, 16, 8, 0, 0, 7); x.fill(); x.fillStyle = '#e0442f'; x.beginPath(); x.moveTo(10, -6); x.quadraticCurveTo(24, 0, 10, 6); x.fill(); x.fillStyle = '#4fd1ff'; x.beginPath(); x.arc(2, 0, 3.2, 0, 7); x.fill(); return glTex(c); }
        const RT = ringTex(), PT = pulseTex(), RK = rocketTex();
        let lt = 0, off = 0, offT = 0, mapK = 1, M = 'intro', rot = 0, fx = 0, fxF = false, fxC = [.3, 1, .6], spin = 0, drag = null;
        const nodes = [];
        const at = (px, py) => [(px / innerWidth - .5) * vh * innerWidth / innerHeight, (.5 - py / innerHeight) * vh];
        function scr(x, y, z) { const m = VP, cx = m[0] * x + m[4] * y + m[8] * z + m[12], cy = m[1] * x + m[5] * y + m[9] * z + m[13], cw = m[3] * x + m[7] * y + m[11] * z + m[15]; return [(cx / cw * .5 + .5) * innerWidth, (-cy / cw * .5 + .5) * innerHeight, cw]; }
        function go(i) { if (LEVELS[i].open)
            startMission(LEVELS[i].id);
        else
            beep(160, .2); }
        function refresh() {
            const N = LEVELS.length, nx = LEVELS.findIndex(l => l.open && !stars[l.id]);
            if (!nodes.length)
                LEVELS.forEach((l, i) => { const a = i * .9, el = document.createElement('div'); el.className = 'lbl3d'; el.onclick = () => go(i); lb.appendChild(el); nodes.push({ id: l.id, p: [Math.sin(a) * 2.3, i * 1.12, Math.cos(a) * 2.3], el, sx: -999, sy: -999, sr: 0, d: 0 }); });
            nodes.forEach((n, i) => { const l = LEVELS[i], s = stars[l.id] || 0; n.open = l.open; n.next = i === nx; n.el.className = 'lbl3d' + (l.open ? '' : ' lock') + (i === nx ? ' next' : ''); n.el.innerHTML = (l.open ? (i === nx ? '▶ ' : '') : '🔒 ') + l.n + (l.open ? `<span class="s">${'★'.repeat(s) + '☆'.repeat(3 - s)}</span>` : ''); });
            offT = (nx < 0 ? LEVELS.map(l => l.open).lastIndexOf(true) : nx) * 1.12;
        }
        function drawMap(t) {
            const w = innerWidth, h = innerHeight, ppu = h / vh, a = h - 210, s = Math.min(a / ppu * .94 / 9.8, w / ppu * .9 / 7.2), mc = at(w / 2, 150 + a / 2), c = Math.cos(rot), n0 = Math.sin(rot);
            mapK = ppu * s;
            const ps = nodes.map(n => ({ x: (c * n.p[0] + n0 * n.p[2]) * s + mc[0], y: (n.p[1] - off) * s + mc[1], z: (-n0 * n.p[0] + c * n.p[2]) * s })), vis = ps.map(q => Math.abs(q.y - mc[1]) < (a / ppu) * .46);
            gl.disable(gl.BLEND);
            gl.depthMask(true);
            nodes.forEach((n, i) => { if (!vis[i])
                return; const q = ps[i], r = RAD[n.id] * s; dMesh(SP, tex(n.id), mm(M4.tr(q.x, q.y, q.z), M4.rz(.25), M4.rx(.35), M4.ry(spin * 1.3 + i), ssc(n.id, r)), { g: col(n.id), un: n.id === 'sun', dim: n.open ? 1 : .22 }); });
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            nodes.forEach((n, i) => { if (!vis[i])
                return; const q = ps[i], r = RAD[n.id] * s; if (n.id === 'saturn')
                dMesh(QX, RT, mm(M4.tr(q.x, q.y, q.z), M4.rz(.25), M4.rx(.35), M4.sc(r * 2.3)), { un: true, dim: n.open ? 1 : .3 }); if (n.next)
                dMesh(QY, PT, mm(M4.tr(q.x, q.y, q.z + r * 1.2), M4.sc(r * 1.5 * (1 + .07 * Math.sin(t * 3)))), { un: true }); });
            dPts(TRL, 3, [.31, .82, 1, .75], mm(M4.tr(mc[0], mc[1] - off * s, 0), M4.ry(rot), M4.sc(s)));
            gl.depthMask(true);
            nodes.forEach((n, i) => { if (!vis[i]) {
                n.el.style.display = 'none';
                n.sx = -999;
                return;
            } n.el.style.display = 'block'; const q = ps[i], r = RAD[n.id] * s, p = scr(q.x, q.y, q.z), rp = r * h / (vh * p[2] / 10); n.sx = p[0]; n.sy = p[1]; n.sr = rp; n.d = p[2]; n.el.style.transform = `translate(${p[0]}px,${p[1] + rp + 4}px) translateX(-50%)`; n.el.style.zIndex = Math.round(1000 - p[2] * 20); });
        }
        function drawBig(t) {
            const id = M === 'intro' ? 'earth' : (cur && cur.levelId) || 'moon', h = innerHeight, w = innerWidth, ppu = h / vh;
            let c, S;
            if (M === 'stage') {
                const b = document.querySelector('.stage').getBoundingClientRect();
                c = at(b.left + b.width / 2, b.top + b.height / 2);
                S = b.height * .42 / ppu;
            }
            else {
                const r = w * .8;
                c = at(w / 2, h + r * .3 + lt * lt * 700);
                S = r / ppu;
            }
            S *= 1 + .1 * fx;
            const g = col(id).map((v, i) => v + (fxC[i] - v) * fx), base = mm(M4.tr(c[0], c[1], 0), M4.rz(.2), M4.rx(.4));
            gl.disable(gl.BLEND);
            gl.depthMask(true);
            dMesh(SP, tex(id), mm(base, M4.ry(spin), M4.sc(S)), { g, un: id === 'sun' });
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            if (id === 'saturn')
                dMesh(QX, RT, mm(base, M4.sc(S * 2.3)), { un: true });
            if (M === 'stage') {
                const a = t * .9, o = S * 1.9, dx = -Math.sin(a) * o, dy = Math.cos(a) * o * .3;
                dMesh(QY, RK, mm(M4.tr(c[0] + Math.cos(a) * o, c[1] + Math.sin(a) * o * .3, Math.sin(a) * o * .8), M4.rz(Math.atan2(dy, dx)), M4.sc(S * .3)), { un: true });
            }
            gl.depthMask(true);
        }
        function frame(t) {
            requestAnimationFrame(frame);
            if (document.hidden)
                return;
            t *= .001;
            const dt = Math.min(.05, t - (frame.l || t));
            frame.l = t;
            spin += dt * .2;
            if (lt > 0)
                lt += dt;
            fx = Math.max(0, fx - dt * 1.4);
            if (!drag) {
                rot += dt * .25;
                off += (offT - off) * Math.min(1, dt * 4);
            }
            const cw = innerWidth * DPR | 0, ch = innerHeight * DPR | 0;
            if (cv.width !== cw || cv.height !== ch) {
                cv.width = cw;
                cv.height = ch;
            }
            gl.viewport(0, 0, cw, ch);
            gl.depthMask(true);
            gl.clearColor(.02, .03, .075, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            VP = M4.mul(persp(), M4.tr(fxF ? rr(.4) * fx : 0, 0, -10));
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            const rz = M4.rz(t * .004), so = (lt * lt * 16) % 130;
            [0, 130].forEach(o => { const m = mm(M4.tr(0, o - so, 0), rz); dPts(ST1, 2, [.85, .9, 1, .8], m); dPts(ST2, 3.6, [1, 1, 1, .45 + .35 * Math.sin(t * 2)], m); });
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            if (M === 'map')
                drawMap(t);
            else
                drawBig(t);
        }
        document.addEventListener('pointerdown', e => { if (M !== 'map' || e.target.closest('button,a,input,.lbl3d'))
            return; drag = { x: e.clientX, y: e.clientY, m: 0 }; });
        const clampO = v => Math.max(0, Math.min((LEVELS.length - 1) * 1.12, v));
        document.addEventListener('pointermove', e => { if (!drag)
            return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.m += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; rot += dx * .01; off = clampO(off + dy / mapK); offT = off; });
        document.addEventListener('pointerup', e => { if (drag && drag.m < 6) {
            let b = null;
            nodes.forEach((n, i) => { if (Math.hypot(e.clientX - n.sx, e.clientY - n.sy) < n.sr + 10 && (!b || n.d < b.d))
                b = { i, d: n.d }; });
            if (b)
                go(b.i);
        } drag = null; });
        addEventListener('wheel', e => { if (M === 'map') {
            off = clampO(off + e.deltaY / mapK);
            offT = off;
        } }, { passive: true });
        refresh();
        requestAnimationFrame(frame);
        document.body.classList.add('gl-on');
        return { launch: on => { lt = on ? .001 : 0; }, mode: id => { M = id === 's-levels' ? 'map' : id === 's-game' ? 'stage' : id === 's-end' ? 'end' : 'intro'; }, refresh, fx: ok => { fx = 1; fxF = !ok; fxC = ok ? [.3, 1, .6] : [1, .25, .25]; } };
    }
    catch (e) {
        console.warn('3D off', e);
        return null;
    }
})();
if (GL) {
    const _s = showScreen;
    showScreen = id => { _s(id); GL.mode(id); };
    const _r = renderLevels;
    renderLevels = () => { _r(); GL.refresh(); };
    const _p = pick;
    pick = i => { _p(i); GL.fx(!document.querySelector('.outcome.bad')); };
    GL.mode(document.querySelector('.screen.active').id);
}
