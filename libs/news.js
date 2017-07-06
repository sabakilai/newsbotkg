var parser = require('../libs/parser.js');

module.exports = function (){
  Promise.all([
    parser('https://ru.sputnik.kg/Kyrgyzstan/','.b-stories__item','.b-stories__title h2','a@href','sputnik.json'),
    parser('https://24.kg/','.one','.title','.title a@href', '24.json')
    //,
    //parser('https://kloop.kg/news/','.td-block-span12','.item-details h3','.item-details a@href', 'kloop.json'),
    //parser('https://rus.azattyk.org/z/3734','.media-block','h4','.content a@href','azattyk.json'),
    //parser('http://knews.kg/','.td-block-span4','h3','a@href', 'knews.json')
  ]).then((messages) =>{
    console.log(messages);
  }).catch((error) =>{
    console.log('Error saving files: ' + error);
  })
}
