/*
  Shop preview data. One entry per product; product.html?p=<id> renders it and shop.html lists them.

  THEME PREVIEW: names, prices and photos come from the live store. Anything in [brackets],
  plus the option values and spec values, is sample content: copy the real text over from
  each product on eatsleepflyfish.com before launch.
*/
window.ESFF_PRODUCTS = (function () {
  var CDN = 'https://cdn.shopify.com/s/files/1/0056/9016/3270/';
  function img(path) { return CDN + path; }

  return [
    {
      id: 'highland-stealth',
      title: 'Highland Stealth Competition Rod',
      kind: 'Fly rod',
      line: 'Highland Rod Company',
      price: 749, from: true,
      badge: 'Built to order',
      soldOut: false,
      short: 'Roger’s competition design, built to order for you in 1–2 weeks.',
      leadTime: 'Ships in 1–2 weeks · built to order',
      live: 'https://eatsleepflyfish.com/collections/fly-rods/products/highland-stealth',
      images: [
        img('files/StealthRodCloseUp.jpg?v=1736611388'),
        img('files/Steallth_Rod_Upright.jpg?v=1736611425'),
        img('files/Stealth_Rod_Close_up_2.jpg?v=1736611424'),
        img('files/Stealth_Rod_Guides.jpg?v=1736611424')
      ],
      options: [{ name: 'Length / line weight', values: ['10′ 2wt', '10′ 3wt', '10′6″ 3wt', '11′ 3wt'] }],
      description: [
        '[Product description from the live store goes here: what the Stealth is built for, who it suits and how Roger fishes it.]',
        '[Second paragraph: blank, components, what’s included with the rod.]'
      ],
      specs: [['Length', '[length]'], ['Line weight', '[line weight]'], ['Pieces', '[pieces]'], ['Action', '[action]'],
              ['Grip', '[grip]'], ['Reel seat', '[reel seat]'], ['Weight', '[weight]']]
    },
    {
      id: 'highland-gladiator',
      title: 'Highland Gladiator Competition Rod',
      kind: 'Fly rod',
      line: 'Highland Rod Company',
      price: 295, from: false,
      badge: null,
      soldOut: true,
      short: '[One-line summary of the Gladiator rod.]',
      leadTime: null,
      live: 'https://eatsleepflyfish.com/collections/fly-rods/products/highland-gladiator-competition-rod',
      images: [
        img('products/Gladiator_Rod_1.jpg?v=1574045296'),
        img('products/Gladiator_Rod_2.jpg?v=1574045296')
      ],
      options: [{ name: 'Length / line weight', values: ['10′ 3wt', '10′ 4wt'] }],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Length', '[length]'], ['Line weight', '[line weight]'], ['Pieces', '[pieces]'], ['Action', '[action]'], ['Weight', '[weight]']]
    },
    {
      id: 'gladiator-cfx-reel',
      title: 'Gladiator CFX Fly Reel',
      kind: 'Fly reel',
      line: 'Highland Rod Company',
      price: 175, from: false,
      badge: null,
      soldOut: false,
      short: '[One-line summary of the CFX reel.]',
      leadTime: '[Shipping time]',
      live: 'https://eatsleepflyfish.com/collections/fly-rods/products/gladiator-cf-fly-reel',
      images: [
        img('products/FaceonShotBlack.jpg?v=1623808858'),
        img('products/SideShotBlack.jpg?v=1623808858'),
        img('products/BlackonBlack.jpg?v=1623808858')
      ],
      options: [{ name: 'Finish', values: ['Black'] }],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Diameter', '[diameter]'], ['Weight', '[weight]'], ['Arbor', '[arbor]'], ['Drag', '[drag]'], ['Fits line weights', '[line weights]']]
    },
    {
      id: 'stealth-sections',
      title: 'Stealth Replacement Sections',
      kind: 'Replacement sections',
      line: 'Highland Rod Company',
      price: 275, from: true,
      badge: null,
      soldOut: false,
      short: '[One-line summary: which sections are available and how to order the right one.]',
      leadTime: '[Shipping time]',
      live: 'https://eatsleepflyfish.com/collections/fly-rods/products/highland-stealth-competition-rod-replacement-sections',
      images: [
        img('files/Stealth_Rod_Guides.jpg?v=1736611424'),
        img('files/Katana_Grip_96b78428-d20a-4441-9481-a2acf0d34b00.jpg?v=1739242450')
      ],
      options: [
        { name: 'Section', values: ['Tip', 'Mid', 'Butt'] },
        { name: 'Rod model', values: ['10′ 2wt', '10′ 3wt', '11′ 3wt'] }
      ],
      description: ['[Product description from the live store goes here.]'],
      specs: [['Fits', '[rod models]'], ['Sections available', '[sections]'], ['Lead time', '[lead time]']]
    }
  ];
})();
