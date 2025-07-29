const express = require('express');
const path = require('path');
const fs = require('fs');
const designsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'design.json')));
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Homepage = Gallery
app.get('/', (req, res) => {
  const imagesDir = path.join(__dirname, 'public/pictures/test/start-1');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error loading images');
    }
    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.render('index', { images });
  });
});

// Route for Logos gallery page
app.get('/logos', (req, res) => {
  const imagesDir = path.join(__dirname, 'public/pictures/test/logos');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error loading images');
    }
    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.render('logos', { images });
  });
});


// Route for Artwork gallery page
app.get('/artwork', (req, res) => {
  const imagesDir = path.join(__dirname, 'public/pictures/test/artwork');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error loading images');
    }
    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.render('artwork', { images });
  });
});


// designs data   
app.get('/design/:id', (req, res) => {
  const { id } = req.params;
  const design = designsData[id];
  if (!design) return res.status(404).send('Design not found');

  // Pick the main type tag (first, or look for coffee shop/magazine/studio/corporate)
  const mainTypeTag = design.tags.find(tag =>
    ["coffee shop", "studio", "magazine", "corporate"].includes(tag)
  );

  // Filter for similar designs with the same main type tag
  const similar = Object.entries(designsData)
    .filter(([otherId, other]) =>
      otherId !== id &&
      other.tags.includes(mainTypeTag)
    )
    .map(([otherId, other]) => ({ ...other, id: otherId }));

  res.render('design', {
    design,
    similar
  });
});

app.get('/tags/:tag', (req, res) => {
  const tag = decodeURIComponent(req.params.tag);
  // Get all designs with this tag
  const filtered = Object.entries(designsData)
    .filter(([id, d]) => d.tags.includes(tag))
    .map(([id, d]) => ({ ...d, id }));
  res.render('tags', { tag, designs: filtered });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
