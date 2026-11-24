/*
  Shop preview data.
    ESFF_COLLECTIONS: one entry per collection page (shop.html?c=<id>).
    ESFF_PRODUCTS:    one entry per product (product.html?p=<id>).
  A product shows up in a collection when its `cat` matches. On the Flies page, products are split
  into sections by `group` (the tier).

  THEME PREVIEW: names, prices, photos and the tier / course / instruction copy come from the homepage.
  Anything in [brackets], plus the option values and spec values, is sample content: copy the real
  text over from each product on eatsleepflyfish.com before launch.
*/
(function () {
  var CDN = 'https://cdn.shopify.com/s/files/1/0056/9016/3270/';
  function cdn(path) { return CDN + path; }

  window.ESFF_COLLECTIONS = {
    all: {
      title: 'Shop', eyebrow: 'Eat Sleep Fly Fish', crumb: 'All products',
      lede: 'Competition-proven rods, flies and instruction from Roger Wilson. One system from first cast to reading the river.'
    },
    rods: {
      title: 'Highland Rod Company', eyebrow: 'Designed by Roger', crumb: 'Fly Rods & Reels',
      lede: 'Fished by 4 of 6 Fly Fishing Team USA World Team members. Built for the precision the system demands.',
      promise: [['Built to order', 'Stealth rods are built for you in 1–2 weeks.'], ['30-day guarantee', 'No questions asked, money back.'], ['Fished by Team USA', '4 of 6 World Team members fish Highland.']]
    },
    flies: {
      title: 'Flies', eyebrow: 'Every fly mapped to the framework', crumb: 'Flies',
      lede: 'Organized by signal intensity, not species or season. Know your mode, and the fly follows.',
      // each tier gets its own section on the Flies page: [name, when to use it]
      groups: [['Tier 1 · Whisper', 'Natural mode · clear water · wild fish'], ['Tier 2 · Speak', 'Transitional · mixed systems · cautious fish'], ['Tier 3 · Shout', 'Control mode · slight stain · reactive fish'], ['Tier 4 · Scream', 'Stocked fish · dirty water · forced reaction']]
    },
    learn: {
      title: 'Books & Instruction', eyebrow: 'The complete system', crumb: 'Books & Instruction',
      lede: 'Sequential, not scattered. Read the books, take the course on the water, then fish it with Roger.'
    }
  };

  var P = [
    {
      id: 'highland-stealth', cat: 'rods', group: 'Rods',
      title: 'Highland Stealth Competition Rod', kind: 'Fly rod', line: 'Highland Rod Company',
      price: 749, from: true, badge: 'Built to order', soldOut: false,
      short: 'Roger’s competition design, built to order for you in 1–2 weeks.',
      leadTime: 'Ships in 1–2 weeks · built to order',
      images: [cdn('files/StealthRodCloseUp.jpg?v=1736611388'), cdn('files/Steallth_Rod_Upright.jpg?v=1736611425'),
               cdn('files/Stealth_Rod_Close_up_2.jpg?v=1736611424'), cdn('files/Stealth_Rod_Guides.jpg?v=1736611424')],
      options: [{ name: 'Length / line weight', values: ['10′ 2wt', '10′ 3wt', '10′6″ 3wt', '11′ 3wt'] }],
      description: ['[Product description from the live store goes here: what the Stealth is built for, who it suits and how Roger fishes it.]',
                    '[Second paragraph: blank, components, what’s included with the rod.]'],
      specs: [['Length', '[length]'], ['Line weight', '[line weight]'], ['Pieces', '[pieces]'], ['Action', '[action]'],
              ['Grip', '[grip]'], ['Reel seat', '[reel seat]'], ['Weight', '[weight]']]
    },
    {
      id: 'highland-gladiator', cat: 'rods', group: 'Rods',
      title: 'Highland Gladiator Competition Rod', kind: 'Fly rod', line: 'Highland Rod Company',
      price: 295, soldOut: true,
      short: '[One-line summary of the Gladiator rod.]',
      images: [cdn('products/Gladiator_Rod_1.jpg?v=1574045296'), cdn('products/Gladiator_Rod_2.jpg?v=1574045296')],
      options: [{ name: 'Length / line weight', values: ['10′ 3wt', '10′ 4wt'] }],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Length', '[length]'], ['Line weight', '[line weight]'], ['Pieces', '[pieces]'], ['Action', '[action]'], ['Weight', '[weight]']]
    },
    {
      id: 'gladiator-cfx-reel', cat: 'rods', group: 'Reels',
      title: 'Gladiator CFX Fly Reel', kind: 'Fly reel', line: 'Highland Rod Company',
      price: 175,
      short: '[One-line summary of the CFX reel.]',
      leadTime: '[Shipping time]',
      images: [cdn('products/FaceonShotBlack.jpg?v=1623808858'), cdn('products/SideShotBlack.jpg?v=1623808858'), cdn('products/BlackonBlack.jpg?v=1623808858')],
      options: [{ name: 'Finish', values: ['Black'] }],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Diameter', '[diameter]'], ['Weight', '[weight]'], ['Arbor', '[arbor]'], ['Drag', '[drag]'], ['Fits line weights', '[line weights]']]
    },
    {
      id: 'stealth-sections', cat: 'rods', group: 'Parts',
      title: 'Stealth Replacement Sections', kind: 'Replacement sections', line: 'Highland Rod Company',
      price: 275, from: true,
      short: '[One-line summary: which sections are available and how to order the right one.]',
      leadTime: '[Shipping time]',
      images: [cdn('files/Stealth_Rod_Guides.jpg?v=1736611424'), cdn('files/Katana_Grip_96b78428-d20a-4441-9481-a2acf0d34b00.jpg?v=1739242450')],
      options: [{ name: 'Section', values: ['Tip', 'Mid', 'Butt'] }, { name: 'Rod model', values: ['10′ 2wt', '10′ 3wt', '11′ 3wt'] }],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Fits', '[rod models]'], ['Sections available', '[sections]'], ['Lead time', '[lead time]']]
    },

    // ---------- books, course, instruction ----------
    {
      id: 'trout-decoded-course', cat: 'learn', group: 'Learn',
      title: 'Trout Decoded: The Complete Course', kind: 'Video course + book', line: 'The complete system',
      price: 295, badge: 'Book included',
      short: 'Video instruction filmed live on the river. 8 modules, with the Trout Decoded book included.',
      images: ['assets/hero.jpg', 'assets/forest.jpg'],
      options: [],
      description: ['Video instruction filmed live on the river, in 8 modules.',
                    'Includes Trout Decoded, Book One of the system. Read it first: why trout do what they do.',
                    '[More about what each module covers.]'],
      specs: [['Format', 'Video course'], ['Modules', '8'], ['Includes', 'Trout Decoded (book)'], ['Access', '[how and how long]']],
      delivery: '[How the course and book are delivered after purchase.]'
    },
    {
      id: 'hierarchy-of-stream-alignment', cat: 'learn', group: 'Learn',
      title: 'The Hierarchy of Stream Alignment', kind: 'Book · PDF download', line: 'Book Two',
      price: 49.95, badge: 'PDF download',
      short: 'Read second. Five layers, solved in order.',
      images: ['assets/river.jpg'],
      options: [],
      description: ['Book Two of the system. Read second: five layers, solved in order.',
                    'Born on the Lower Nantahala River, after a Team USA Regional lost by two fish. Session One, four fish. Session Two, nineteen.',
                    '[More about what the book covers.]'],
      specs: [['Format', 'PDF download'], ['Author', 'Roger Wilson'], ['Pages', '[pages]']],
      delivery: '[How the PDF is delivered after purchase.]'
    },
    {
      id: 'instruction-day', cat: 'learn', group: 'Learn',
      title: 'Private Instruction Day', kind: 'Instruction · by application', line: 'Private instruction',
      price: 595, badge: '1-on-1', unit: ' per day',
      short: 'Not a guided trip. A condensed apprenticeship: a full day on East Tennessee or Western North Carolina water with Roger.',
      images: ['assets/angler.jpg'],
      options: [{ name: 'Anglers', values: ['1 angler', '2 anglers'] }],
      cta: 'Apply for a day',
      description: ['I don’t want you to need me next time. A full day on East Tennessee or Western North Carolina water, with a pre-trip consultation and post-trip practice plan.',
                    'Up to 2 anglers per day.'],
      specs: [['Length', 'Full day'], ['Anglers', 'Up to 2'], ['Waters', 'East Tennessee · Western North Carolina'], ['Includes', 'Pre-trip consultation · post-trip practice plan']],
      delivery: 'Instruction days are by application. [How scheduling and payment work.]'
    }
  ];

  // ---------- flies (names and tiers from the homepage; prices and photos are placeholders) ----------
  var TIERS = [
    { name: 'Tier 1 · Whisper', use: 'Natural mode · clear water · wild fish', tint: 't1',
      flies: ['Natural PT', 'Blonde PT', 'Olive Thread Body', 'Choco PT', 'Walt’s Worm'] },
    { name: 'Tier 2 · Speak', use: 'Transitional · mixed systems · cautious fish', tint: 't2',
      flies: ['Duracell', 'Pink Lady', 'Redneck Woman', 'Carrot Fly', 'CDC Collar Fly'] },
    { name: 'Tier 3 · Shout', use: 'Control mode · slight stain · reactive fish', tint: 't3',
      flies: ['Blow Torch', 'FireFly', 'Frenchie', 'Purple Passion', 'Hott Butt Perdigon'] },
    { name: 'Tier 4 · Scream', use: 'Stocked fish · dirty water · forced reaction', tint: 't4',
      flies: ['Peach Egg', 'Chartreuse Egg', 'Cream Mop', 'Squirmy Worm', 'Bright Megg'] }
  ];
  TIERS.forEach(function (t) {
    t.flies.forEach(function (name) {
      P.push({
        id: 'fly-' + name.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-'),
        cat: 'flies', group: t.name,
        title: name, kind: t.name, line: 'Flies · ' + t.name,
        price: null, tint: t.tint,
        short: t.name + ': ' + t.use + '.',
        images: ['assets/bokeh.jpg'],
        options: [{ name: 'Hook size', values: ['14', '16', '18'] }, { name: 'Pack', values: ['Single', '3-pack', '6-pack'] }],
        description: ['A ' + t.name + ' fly. Reach for it in ' + t.use.toLowerCase() + '.', '[Fly description and tying notes from the live store.]'],
        specs: [['Tier', t.name], ['Use when', t.use], ['Hook', '[hook]'], ['Bead', '[bead]']]
      });
    });
  });

  window.ESFF_PRODUCTS = P;
})();
