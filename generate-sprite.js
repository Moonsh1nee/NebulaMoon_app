const fs = require('fs');
const path = require('path');
const SVGSpriter = require('svg-sprite');

const spriteConfig = {
  mode: {
    symbol: {
      dest: './src/assets/images/icons', // Куда сохранить спрайт
      sprite: 'sprite.svg',     // Имя файла
    },
  },
};

const spriter = new SVGSpriter(spriteConfig);

// Путь к папке с иконками
const iconsDir = path.resolve(__dirname, './src/assets/images/icons');

// Читаем все SVG-файлы
fs.readdirSync(iconsDir).forEach((file) => {
  if (file.endsWith('.svg') && file !== 'sprite.svg') {
    spriter.add(
      path.resolve(iconsDir, file),
      file,
      fs.readFileSync(path.resolve(iconsDir, file), 'utf-8')
    );
  }
});

// Генерируем спрайт
spriter.compile((error, result) => {
  if (error) {
    console.error('Ошибка при генерации спрайта:', error);
    return;
  }
  fs.writeFileSync(
    path.resolve(iconsDir, 'sprite.svg'),
    result.symbol.sprite.contents
  );
  console.log('Спрайт успешно сгенерирован!');
});